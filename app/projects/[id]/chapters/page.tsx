import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ChaptersPage({ params }: { params: { id: string } }) {
  const drafts = await prisma.chapterDraft.findMany({ where: { projectId: params.id }, orderBy: [{ chapterNumber: "asc" }, { version: "desc" }] });
  const latestByChapter = new Map<number, typeof drafts[number]>();
  drafts.forEach((d) => { if (!latestByChapter.has(d.chapterNumber)) latestByChapter.set(d.chapterNumber, d); });
  const list = Array.from(latestByChapter.values());
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Chapter Plan / 章節卡</h2>
      <form action={`/api/projects/${params.id}/chapters`} method="post" className="card flex items-end gap-2">
        <input type="number" name="count" defaultValue={3} min={1} max={50} />
        <button type="submit">生成 N 章章節卡</button>
      </form>
      <div className="grid gap-2">
        {list.map((d) => (
          <Link key={d.id} href={`/projects/${params.id}/chapters/${d.chapterNumber}`} className="card">第 {d.chapterNumber} 章（v{d.version}）</Link>
        ))}
      </div>
      <Link href={`/projects/${params.id}/experiments`} className="rounded border border-slate-700 px-3 py-2 inline-block">Experiments</Link>
    </div>
  );
}
