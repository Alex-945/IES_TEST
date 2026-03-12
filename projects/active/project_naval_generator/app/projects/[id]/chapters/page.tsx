"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GapPanel } from "@/components/GapPanel";
import { QuestionRound } from "@/components/QuestionRound";
import { VersionHistory } from "@/components/VersionHistory";
import { buildGapList, buildQuestionsFromGaps, summarizeJson } from "@/lib/gap";

export default function ChaptersPage({ params }: { params: { id: string } }) {
  const [json, setJson] = useState<any>({ chapters: [] });
  const [versions, setVersions] = useState<Array<{ version: number; createdAt: string }>>([]);
  const [count, setCount] = useState(10);

  async function load() {
    const res = await fetch(`/api/projects/${params.id}/snapshots/chapterPlan`);
    const data = await res.json();
    setJson(data.latest?.json || { chapters: [] });
    setVersions(data.versions || []);
  }

  useEffect(() => {
    load();
  }, []);

  const gaps = useMemo(() => buildGapList("chapters", json), [json]);
  const qs = useMemo(() => buildQuestionsFromGaps(gaps), [gaps]);

  async function generate() {
    const res = await fetch(`/api/projects/${params.id}/chapters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count })
    });
    if (!res.ok) {
      const err = await res.json();
      return alert(err.error || "生成失敗");
    }
    await load();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="card"><h3 className="mb-2 text-sm font-semibold">現有資料摘要</h3><pre className="whitespace-pre-wrap text-xs">{summarizeJson(json)}</pre></div>
        <GapPanel gaps={gaps} />
        <QuestionRound items={qs} />
        <div className="card space-y-2">
          <h3 className="text-sm font-semibold">工作區（章節卡）</h3>
          <div className="flex items-center gap-2 text-sm">
            <span>生成章數</span>
            <input className="w-20 rounded border px-2 py-1" type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} />
            <button className="btn" onClick={generate}>生成 N 章</button>
          </div>
          <div className="grid gap-2">
            {(json.chapters || []).map((c: any) => (
              <Link key={c.chapterNo} href={`/projects/${params.id}/chapters/${c.chapterNo}`} className="rounded border p-3 hover:bg-slate-50">
                第 {c.chapterNo} 章 - {c.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <VersionHistory title="Chapter Plan 版本歷史" items={versions} />
    </div>
  );
}
