"use client";

import { useEffect, useMemo, useState } from "react";
import { GapPanel } from "@/components/GapPanel";
import { QuestionRound } from "@/components/QuestionRound";
import { VersionHistory } from "@/components/VersionHistory";
import { buildGapList, buildQuestionsFromGaps, summarizeJson } from "@/lib/gap";

export default function BiblePage({ params }: { params: { id: string } }) {
  const [json, setJson] = useState<any>({});
  const [versions, setVersions] = useState<Array<{ version: number; createdAt: string }>>([]);
  const [selected, setSelected] = useState<any>(null);

  async function load() {
    const res = await fetch(`/api/projects/${params.id}/snapshots/bible`);
    const data = await res.json();
    setJson(data.latest?.json || {});
    setVersions(data.versions || []);
  }

  useEffect(() => {
    load();
  }, []);

  const gaps = useMemo(() => buildGapList("bible", json), [json]);
  const qs = useMemo(() => buildQuestionsFromGaps(gaps), [gaps]);

  async function generate() {
    const res = await fetch("/api/llm/json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        schemaName: "bible",
        projectId: params.id,
        task: "根據 planning 生成 Bible JSON",
        role: "planning"
      })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "生成失敗");

    await fetch(`/api/projects/${params.id}/snapshots/bible`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: data.json, advanceStage: "OUTLINE", generation: data.meta })
    });
    await load();
  }

  async function viewVersion(v: number) {
    const res = await fetch(`/api/projects/${params.id}/snapshots/bible?version=${v}`);
    const data = await res.json();
    setSelected(data.versioned?.json || null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="card"><h3 className="mb-2 text-sm font-semibold">現有資料摘要</h3><pre className="whitespace-pre-wrap text-xs">{summarizeJson(json)}</pre></div>
        <GapPanel gaps={gaps} />
        <QuestionRound items={qs} />
        <div className="card space-y-2">
          <h3 className="text-sm font-semibold">工作區（Bible JSON）</h3>
          <textarea className="w-full rounded border p-2 font-mono text-xs" value={JSON.stringify(json, null, 2)} onChange={(e) => { try { setJson(JSON.parse(e.target.value)); } catch {} }} />
          <div className="flex gap-2">
            <button className="btn" onClick={generate}>生成 Bible</button>
            <button className="btn-secondary" onClick={async () => {
              await fetch(`/api/projects/${params.id}/snapshots/bible`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ json }) });
              await load();
            }}>手動存版本</button>
          </div>
          {selected && <pre className="rounded border bg-slate-50 p-2 text-xs">Diff參考（選中版本）\n{JSON.stringify(selected, null, 2)}</pre>}
        </div>
      </div>
      <VersionHistory title="Bible 版本歷史" items={versions} onPick={viewVersion} />
    </div>
  );
}
