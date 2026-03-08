import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import type { ChatMessage, GeneratedFile } from "@/lib/types";

const fileSchema = z.object({
  path: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9._/-]+$/),
  content: z.string().min(1),
});

const generatedAppSchema = z.object({
  projectTitle: z.string().min(1),
  assistantMessage: z.string().min(1),
  files: z.array(fileSchema).min(1).max(12),
});

const generatedAppJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectTitle: { type: "string" },
    assistantMessage: { type: "string" },
    files: {
      type: "array",
      minItems: 1,
      maxItems: 12,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          path: { type: "string" },
          content: { type: "string" },
        },
        required: ["path", "content"],
      },
    },
  },
  required: ["projectTitle", "assistantMessage", "files"],
} as const;

type GeneratedApp = z.infer<typeof generatedAppSchema>;

const SYSTEM_PROMPT = `
You generate small, polished front-end apps for live preview.

Return a complete app as static files that can run in a plain browser with no build step.
Use exactly the files needed for the app, usually:
- index.html
- styles.css
- script.js

Rules:
- Output valid structured data only.
- Make the design feel intentional and non-generic.
- Keep the app self-contained. Do not require npm install.
- Use accessible HTML.
- Prefer modern vanilla JavaScript over frameworks.
- The app must work by opening index.html and loading local CSS/JS files.
- If the user asks for interactivity, implement it in script.js.
- If the user asks for Japanese copy, keep the UI copy in Japanese.
- Always regenerate the full file set.

The assistantMessage should briefly explain what you built and what changed.
`;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  return new GoogleGenAI({ apiKey });
}

function sanitizeFilePath(path: string) {
  const normalized = path.replace(/^\/+/, "");

  if (
    normalized.includes("..") ||
    normalized.startsWith(".") ||
    normalized.length === 0
  ) {
    throw new Error(`Invalid generated file path: ${path}`);
  }

  return normalized;
}

export async function generateAppFiles(
  history: ChatMessage[],
  currentFiles: GeneratedFile[]
): Promise<GeneratedApp> {
  const client = getClient();
  const model = process.env.GEMINI_MODEL ?? "gemini-3-flash-preview";

  const fileContext =
    currentFiles.length > 0
      ? `Current generated files:\n${currentFiles
          .map(
            (file) =>
              `FILE: ${file.path}\n\`\`\`\n${file.content}\n\`\`\``
          )
          .join("\n\n")}`
      : "No files exist yet. Create the first version.";

  const response = await client.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: [
              SYSTEM_PROMPT.trim(),
              "",
              fileContext,
              "",
              "Conversation history:",
              ...history.map(
                (message) =>
                  `${message.role === "assistant" ? "Assistant" : "User"}: ${message.content}`
              ),
            ].join("\n"),
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: generatedAppJsonSchema,
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  const parsed = generatedAppSchema.parse(JSON.parse(text));

  return {
    ...parsed,
    files: parsed.files.map((file) => ({
      path: sanitizeFilePath(file.path),
      content: file.content,
    })),
  };
}
