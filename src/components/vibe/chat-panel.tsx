"use client";

import { FormEvent } from "react";
import type { ChatMessage } from "@/lib/vibe/types";

type ChatPanelProps = {
  input: string;
  isLoading: boolean;
  messages: ChatMessage[];
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  suggestions: string[];
};

export function ChatPanel({
  input,
  isLoading,
  messages,
  onInputChange,
  onSubmit,
  suggestions,
}: ChatPanelProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="panel panel--chat">
      <div className="panel__header">
        <div>
          <p className="panel__eyebrow">Assistant</p>
          <h2>Describe the app you want</h2>
        </div>
        <div className="topbar__badge">
          <span className="status-dot" />
          {isLoading ? "Generating" : "Ready"}
        </div>
      </div>

      <div className="template-strip">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            className="template-chip"
            disabled={isLoading}
            onClick={() => onInputChange(suggestion)}
            type="button"
          >
            <span>{suggestion}</span>
            <small>Use as prompt</small>
          </button>
        ))}
      </div>

      <div className="chat-log">
        {messages.map((message) => (
          <article
            key={message.id}
            className={
              message.role === "assistant"
                ? "message message--assistant"
                : "message message--user"
            }
          >
            <p className="message__role">
              {message.role === "assistant" ? "Builder" : "You"}
            </p>
            <p>{message.content}</p>
          </article>
        ))}
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <label className="composer__label" htmlFor="prompt">
          Prompt
        </label>
        <textarea
          className="composer__textarea"
          disabled={isLoading}
          id="prompt"
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="例: 和モダンな採用ページを作って。価値観、社員の声、応募 CTA、モバイル対応。"
          rows={6}
          value={input}
        />
        <div className="composer__actions">
          <p className="composer__hint">
            Gemini がコードを生成し、E2B sandbox でそのまま実行します。
          </p>
          <button className="primary-button" disabled={isLoading} type="submit">
            {isLoading ? "Building..." : "Build Preview"}
          </button>
        </div>
      </form>
    </div>
  );
}
