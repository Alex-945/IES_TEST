"use client";

import { useEffect, useMemo, useState } from "react";
import { GapPanel } from "@/components/GapPanel";
import { QuestionRound } from "@/components/QuestionRound";
import { VersionHistory } from "@/components/VersionHistory";
import { buildGapList, buildQuestionsFromGaps, summarizeJson } from "@/lib/gap";

export default function OutlinePage({ params }: { params: { id: string } }) {
  const [json, setJson] = useState<any>({});
  const [versions, setVersions] = useState<Array<{ version: number; createdAt: string }>>([]);

  async function load() {
    const res = await fetch(`/api/projects/${params.id}/snapshots/outline`);
    const data = await res.json();
    setJson(data.latest?.json || {});
    setVersions(data.versions || []);
  }

  useEffect(() => {
    load();
  }, []);

  const gaps = useMemo(() => buildGapList("outline", json), [json]);
  const qs = useMemo(() => buildQuestionsFromGaps(gaps), [gaps]);

  async function generate() {
    const res = await fetch("/api/llm/json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schemaName: "outline", projectId: params.id, task: "根據 Bible 生成三幕 Outline", role: "planning" })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "生成失敗");
    await fetch(`/api/projects/${params.id}/snapshots/outline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: data.json, advanceStage: "CHAPTER_PLAN", generation: data.meta })
    });
    await load();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="card"><h3 className="mb-2 text-sm font-semibold">現有資料摘要</h3><pre className="whitespace-pre-wrap text-xs">{summarizeJson(json)}</pre></div>
        <GapPanel gaps={gaps} />
        <QuestionRound items={qs} />
        <div className="card space-y-2">
          <h3 className="text-sm font-semibold">工作區（Outline JSON）</h3>
          <textarea className="w-full rounded border p-2 font-mono text-xs" value={JSON.stringify(json, null, 2)} onChange={(e) => { try { setJson(JSON.parse(e.target.value)); } catch {} }} />
          <div className="flex gap-2">
            <button className="btn" onClick={generate}>生成 Outline</button>
            <button className="btn-secondary" onClick={async () => {
              await fetch(`/api/projects/${params.id}/snapshots/outline`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ json }) });
              await load();
            }}>手動存版本</button>
          </div>
        </div>
      </div>
      <VersionHistory title="Outline 版本歷史" items={versions} />
    </div>
  );
}
