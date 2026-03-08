import { Sandbox } from "@e2b/code-interpreter";
import type { GeneratedFile } from "@/lib/vibe/types";

const APP_DIR = "/home/user/app";
const SANDBOX_TIMEOUT_MS = 30 * 60 * 1000;

function getPreviewUrl(host: string) {
  return host.startsWith("http://") || host.startsWith("https://")
    ? host
    : `https://${host}`;
}

async function getSandbox(existingSandboxId?: string) {
  const apiKey = process.env.E2B_API_KEY;

  if (!apiKey) {
    throw new Error("E2B_API_KEY is not set.");
  }

  const sandbox = existingSandboxId
    ? await Sandbox.connect(existingSandboxId, { apiKey })
    : await Sandbox.create({ apiKey, timeoutMs: SANDBOX_TIMEOUT_MS });

  await sandbox.setTimeout(SANDBOX_TIMEOUT_MS);

  return sandbox;
}

export async function publishPreview(
  files: GeneratedFile[],
  _existingSandboxId?: string
) {
  // Reusing a sandbox requires killing the previous preview server reliably.
  // Creating a fresh sandbox per build is slower but avoids "signal: terminated"
  // failures from process cleanup races.
  const sandbox = await getSandbox();

  await sandbox.commands.run(`mkdir -p ${APP_DIR}`, { timeoutMs: 20_000 });
  await sandbox.commands.run(
    `find ${APP_DIR} -mindepth 1 -maxdepth 1 -exec rm -rf {} +`,
    { timeoutMs: 20_000 }
  );

  await sandbox.files.write(
    files.map((file) => ({
      path: `${APP_DIR}/${file.path}`,
      data: file.content,
    }))
  );

  await sandbox.commands.run(
    `python3 -m http.server 3000 --directory ${APP_DIR}`,
    {
      background: true,
      timeoutMs: 10_000,
    }
  );

  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    sandboxId: sandbox.sandboxId,
    previewUrl: getPreviewUrl(sandbox.getHost(3000)),
  };
}
