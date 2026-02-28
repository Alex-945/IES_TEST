"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GapPanel } from "@/components/GapPanel";
import { QuestionRound } from "@/components/QuestionRound";
import { buildQuestionsFromGaps } from "@/lib/gap";

export default function ChapterDetailPage({ params }: { params: { id: string; n: string } }) {
  const chapterNo = Number(params.n);
  const [chapterCard, setChapterCard] = useState<any>({});
  const [draft, setDraft] = useState("");
  const [qa, setQa] = useState<any>(null);
  const [streaming, setStreaming] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  async function load() {
    const res = await fetch(`/api/projects/${params.id}/chapters/${chapterNo}`);
    const data = await res.json();
    setChapterCard(data.chapterCard || {});
    setDraft(data.latestDraft?.text || "");
    setQa(data.latestQA || null);
  }

  useEffect(() => {
    load();
  }, [chapterNo]);

  const gaps = useMemo(() => (draft ? ["可再檢查節奏與章尾鉤子"] : ["尚未生成草稿"]), [draft]);
  const qs = useMemo(() => buildQuestionsFromGaps(gaps), [gaps]);

  async function generateDraft() {
    setDraft("");
    setStreaming(true);
    const controller = new AbortController();
    controllerRef.current = controller;

    const resp = await fetch("/api/llm/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: params.id, chapterNo, chapterCard, task: "生成本章草稿" }),
      signal: controller.signal
    });

    if (!resp.body) {
      setStreaming(false);
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() || "";
      for (const chunk of chunks) {
        const line = chunk.split("\n").find((x) => x.startsWith("data:"));
        if (!line) continue;
        const payload = JSON.parse(line.replace(/^data:\s*/, ""));
        if (payload.type === "token") setDraft((prev) => prev + payload.delta);
      }
    }

    setStreaming(false);
    await load();
  }

  async function saveDraft() {
    await fetch(`/api/projects/${params.id}/chapters/${chapterNo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: draft, params: { manual: true } })
    });
    await load();
  }

  async function runQA(rewrite = false) {
    const res = await fetch(`/api/projects/${params.id}/chapters/${chapterNo}/qa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rewrite })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "QA 失敗");
    setQa(data.qa);
    if (data.rewrittenDraft) setDraft(data.rewrittenDraft);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="card"><h3 className="font-semibold">章節卡</h3><pre className="mt-2 whitespace-pre-wrap text-xs">{JSON.stringify(chapterCard, null, 2)}</pre></div>
        <GapPanel gaps={gaps} />
        <QuestionRound items={qs} />
        <div className="card space-y-2">
          <h3 className="font-semibold">工作區（Draft）</h3>
          <div className="flex gap-2">
            <button className="btn" onClick={generateDraft} disabled={streaming}>串流生成 Draft</button>
            <button className="btn-secondary" onClick={() => controllerRef.current?.abort()} disabled={!streaming}>中止</button>
            <button className="btn-secondary" onClick={saveDraft}>手動儲存</button>
          </div>
          <textarea className="w-full rounded border p-2 text-sm" value={draft} onChange={(e) => setDraft(e.target.value)} />
        </div>
      </div>
      <div className="space-y-4">
        <div className="card space-y-2">
          <h3 className="font-semibold">QA 報告</h3>
          <div className="flex gap-2">
            <button className="btn" onClick={() => runQA(false)}>執行 QA</button>
            <button className="btn-secondary" onClick={() => runQA(true)}>按建議重寫</button>
          </div>
          <pre className="whitespace-pre-wrap text-xs">{qa ? JSON.stringify(qa, null, 2) : "尚無 QA"}</pre>
        </div>
      </div>
    </div>
  );
}
