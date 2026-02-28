import { prisma } from "@/lib/prisma";

export default async function ExperimentsPage({ params }: { params: { id: string } }) {
  const runs = await prisma.experimentRun.findMany({ where: { projectId: params.id }, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Experiment Runner</h2>
      <form action={`/api/projects/${params.id}/experiments`} method="post" className="card grid grid-cols-2 gap-2">
        <input name="chapterNumber" type="number" defaultValue={1} />
        <input name="n" type="number" defaultValue={3} />
        <input name="temperature" defaultValue={0.8} />
        <input name="top_p" defaultValue={0.9} />
        <input name="seed" defaultValue={42} />
        <input name="styleWeight" defaultValue={0.7} />
        <button className="col-span-2" type="submit">批量生成並評分</button>
      </form>
      <div className="grid gap-2">
        {runs.map((r) => <div key={r.id} className="card text-sm">{r.variantName}｜QA {r.qaScore ?? "-"}｜Hook {r.hookScore ?? "-"}</div>)}
      </div>
    </div>
  );
}
