export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type GeneratedFile = {
  path: string;
  content: string;
};
