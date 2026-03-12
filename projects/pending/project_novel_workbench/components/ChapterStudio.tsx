"use client";

import { useState } from "react";

export function ChapterStudio({ projectId, chapterNumber, initial }: { projectId: string; chapterNumber: number; initial: string }) {
  const [text, setText] = useState(initial);
  const [streaming, setStreaming] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  async function generate() {
    const ac = new AbortController();
    setController(ac);
    setStreaming(true);
    setText("");
    const resp = await fetch("/api/llm/stream", {
      method: "POST",
      body: JSON.stringify({ task: `生成第${chapterNumber}章草稿` }),
      signal: ac.signal
    });
    const reader = resp.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setText((t) => t + decoder.decode(value));
    }
    setStreaming(false);
  }

  async function save() {
    await fetch(`/api/projects/${projectId}/chapters/${chapterNumber}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: text }) });
    alert("已儲存");
  }

  async function runQa() {
    const resp = await fetch("/api/llm/json", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "qa", content: text }) });
    const data = await resp.json();
    await fetch(`/api/projects/${projectId}/chapters/${chapterNumber}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ qa: data }) });
    alert("QA 完成");
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button type="button" onClick={generate} disabled={streaming}>串流生成</button>
        <button type="button" onClick={() => controller?.abort()} disabled={!streaming}>中止</button>
        <button type="button" onClick={save}>儲存版本</button>
        <button type="button" onClick={runQa}>執行 QA</button>
      </div>
      <textarea rows={20} value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
