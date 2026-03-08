"use client";

import { useMemo, useState } from "react";
import type { GeneratedFile } from "@/lib/vibe/types";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type PreviewPanelProps = {
  error?: string | null;
  files: GeneratedFile[];
  isLoading: boolean;
  previewUrl?: string | null;
  projectTitle: string;
  onSaveToApps?: () => Promise<void>;
};

export function PreviewPanel({
  error,
  files,
  isLoading,
  previewUrl,
  projectTitle,
  onSaveToApps,
}: PreviewPanelProps) {
  const [activePath, setActivePath] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const selectedPath = useMemo(() => {
    if (!files.length) {
      return null;
    }

    return files.some((file) => file.path === activePath)
      ? activePath
      : files[0].path;
  }, [activePath, files]);

  const activeFile = files.find((file) => file.path === selectedPath) ?? null;

  const handleSave = async () => {
    if (!onSaveToApps || saveStatus === "saving") return;
    setSaveStatus("saving");
    try {
      await onSaveToApps();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3500);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3500);
    }
  };

  const saveLabel =
    saveStatus === "saving" ? "Saving…"
      : saveStatus === "saved" ? "✓ Saved to Apps!"
        : saveStatus === "error" ? "✗ Save failed"
          : "Save to Apps";

  return (
    <div className="panel panel--preview">
      <div className="panel__header">
        <div>
          <p className="panel__eyebrow">Live Preview</p>
          <h2>{projectTitle}</h2>
        </div>
        <div className="preview-header-actions">
          <div className="preview-meta">
            <span>{files.length} files</span>
            <span>{previewUrl ? "Sandbox online" : "No sandbox yet"}</span>
          </div>
          {files.length > 0 && onSaveToApps && (
            <button
              className={`save-apps-button ${saveStatus === "saved" ? "save-apps-button--saved" : ""} ${saveStatus === "error" ? "save-apps-button--error" : ""}`}
              disabled={saveStatus === "saving" || saveStatus === "saved"}
              onClick={handleSave}
              type="button"
            >
              {saveStatus === "saving" && (
                <span className="save-spinner" />
              )}
              {saveLabel}
            </button>
          )}
        </div>
      </div>

      <div className="preview-stage">
        {previewUrl ? (
          <iframe
            className="preview-frame"
            src={previewUrl}
            title={projectTitle}
          />
        ) : (
          <div className="preview-placeholder">
            <p>Prompt を送ると E2B sandbox を起動して、ここに実プレビューを表示します。</p>
          </div>
        )}
        {isLoading ? <div className="preview-overlay">Generating preview...</div> : null}
      </div>

      {error ? <p className="error-banner">{error}</p> : null}

      <div className="code-shell">
        <div className="code-tabs">
          {files.map((file) => (
            <button
              key={file.path}
              className={
                file.path === selectedPath ? "code-tab code-tab--active" : "code-tab"
              }
              onClick={() => setActivePath(file.path)}
              type="button"
            >
              {file.path}
            </button>
          ))}
        </div>
        <pre className="code-block">
          <code>{activeFile?.content ?? "// Generated files will appear here."}</code>
        </pre>
      </div>
    </div>
  );
}
