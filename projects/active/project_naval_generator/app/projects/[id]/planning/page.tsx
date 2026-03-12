"use client";

import { useEffect, useMemo, useState } from "react";
import { GapPanel } from "@/components/GapPanel";
import { QuestionRound } from "@/components/QuestionRound";
import { VersionHistory } from "@/components/VersionHistory";
import { buildGapList, buildQuestionsFromGaps, summarizeJson } from "@/lib/gap";

const defaultPlanning = {
  market_format: { genre: "", subgenre: "", target_audience_age: "", platform: "", total_word_target: 100000, chapters_target: 50, chapter_word_target: 2000, pov: "", tense: "", pacing_style: "" },
  core_selling_points: { logline: "", hooks: ["", "", ""], taboo: ["", "", "", "", ""], tone_keywords: ["", "", "", "", ""] },
  world_rules: { time_period: "", location: "", society_system: "", tech_or_magic_system: "", hard_rules: ["", "", "", "", ""], limitation_and_cost: ["", "", ""], realism_level: "" },
  characters: [
    { name: "", age: "", role: "主角", desire: "", flaw: "", fear: "", skill: "", weakness: "", bottom_line: "", arc_start: "", arc_end: "", relationship_map: "" },
    { name: "", age: "", role: "對手", desire: "", flaw: "", fear: "", skill: "", weakness: "", bottom_line: "", arc_start: "", arc_end: "", relationship_map: "" },
    { name: "", age: "", role: "盟友", desire: "", flaw: "", fear: "", skill: "", weakness: "", bottom_line: "", arc_start: "", arc_end: "", relationship_map: "" }
  ],
  plot_nodes: { opening_scene_requirement: "", inciting_incident: "", midpoint_reversal: "", climax: "", ending_type: "", commercial_paywall_hooks: [{ chapterNo: 1, event: "" }, { chapterNo: 2, event: "" }] },
  style_constraints: { style_do: "", style_dont: "", dialogue_ratio: "50%", description_ratio: "50%", forbidden_tropes: "" }
};

export default function PlanningPage({ params }: { params: { id: string } }) {
  const [planning, setPlanning] = useState<any>(defaultPlanning);
  const [versions, setVersions] = useState<Array<{ version: number; createdAt: string }>>([]);

  async function load() {
    const res = await fetch(`/api/projects/${params.id}/snapshots/planning`);
    const data = await res.json();
    if (data.latest?.json) setPlanning(data.latest.json);
    setVersions(data.versions || []);
  }

  useEffect(() => {
    load();
  }, []);

  const gaps = useMemo(() => buildGapList("planning", planning), [planning]);
  const qs = useMemo(() => buildQuestionsFromGaps(gaps), [gaps]);

  async function savePlanning() {
    const res = await fetch(`/api/projects/${params.id}/snapshots/planning`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: planning, advanceStage: "BIBLE" })
    });
    if (!res.ok) alert("儲存失敗");
    await load();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="card"><h3 className="mb-2 text-sm font-semibold">現有資料摘要</h3><pre className="whitespace-pre-wrap text-xs text-slate-700">{summarizeJson(planning)}</pre></div>
        <GapPanel gaps={gaps} />
        <QuestionRound items={qs} />
        <div className="card space-y-2">
          <h3 className="text-sm font-semibold">工作區（Planning Form JSON）</h3>
          <textarea className="w-full rounded border p-2 font-mono text-xs" value={JSON.stringify(planning, null, 2)} onChange={(e) => { try { setPlanning(JSON.parse(e.target.value)); } catch {} }} />
          <button className="btn" onClick={savePlanning}>提交並進入 Gap Q&A</button>
        </div>
      </div>
      <VersionHistory title="Planning 版本歷史" items={versions} />
    </div>
  );
}
