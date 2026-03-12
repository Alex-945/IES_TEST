import { prisma } from "@/lib/prisma";
import { ChapterStudio } from "@/components/ChapterStudio";

export default async function ChapterDetailPage({ params }: { params: { id: string; n: string } }) {
  const chapterNumber = Number(params.n);
  const drafts = await prisma.chapterDraft.findMany({ where: { projectId: params.id, chapterNumber }, orderBy: { version: "desc" } });
  const qa = await prisma.qaReport.findMany({ where: { projectId: params.id, chapterNumber }, orderBy: { createdAt: "desc" }, take: 3 });
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">第 {chapterNumber} 章</h2>
      <div className="card text-sm">版本列表：{drafts.map((d) => `v${d.version}`).join(", ") || "無"}</div>
      <ChapterStudio projectId={params.id} chapterNumber={chapterNumber} initial={drafts[0]?.content ?? ""} />
      <div className="card text-xs"><h3>QA 歷史</h3><pre>{JSON.stringify(qa.map((x) => x.report), null, 2)}</pre></div>
    </div>
  );
}
