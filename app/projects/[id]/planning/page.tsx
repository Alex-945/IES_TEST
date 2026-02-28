import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WorkflowDashboard } from "@/components/WorkflowDashboard";

export default async function PlanningPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id }, include: { planningSnapshots: { orderBy: { version: "desc" }, take: 1 } } });
  if (!project) return <div>Project not found</div>;
  const latest = project.planningSnapshots[0];
  return (
    <div className="space-y-4">
      <WorkflowDashboard state={project.workflowState} />
      <h2 className="text-lg font-semibold">Planning 詳細表單</h2>
      <form action={`/api/projects/${params.id}/planning`} method="post" className="card space-y-3">
        <textarea name="payload" rows={18} defaultValue={JSON.stringify(latest?.payload ?? {
          genre: "", subgenre: "", target_audience_age: "", audience_preference: "", platform: "", total_word_target: 120000,
          chapters_target: 100, chapter_word_target: 1200, pov: "3rd", tense: "past", pacing_style: "fast",
          logline: "", hooks: [], taboo: [], tone_keywords: [], time_period: "", location: "", society_system: "",
          tech_or_magic_system: "", hard_rules: [], limitation_and_cost: [], realism_level: "", characters: [],
          opening_scene_requirement: "", inciting_incident: "", midpoint_reversal: "", climax: "", ending_type: "",
          commercial_paywall_hooks: [], style_do: [], style_dont: [], dialogue_ratio: "", description_ratio: "", forbidden_tropes: []
        }, null, 2)} />
        <button type="submit">提交並做 Gap Detection</button>
      </form>

      {latest?.gaps && (
        <div className="card space-y-2">
          <h3 className="font-semibold">本輪澄清問題（最多3題）</h3>
          <pre className="overflow-auto text-xs">{JSON.stringify(latest.gaps, null, 2)}</pre>
        </div>
      )}

      <div className="flex gap-3">
        <Link href={`/projects/${params.id}/bible`} className="rounded border border-slate-700 px-3 py-2">下一步：Bible</Link>
      </div>
    </div>
  );
}
