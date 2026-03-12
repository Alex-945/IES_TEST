import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function OutlinePage({ params }: { params: { id: string } }) {
  const versions = await prisma.outlineVersion.findMany({ where: { projectId: params.id }, orderBy: { version: "desc" } });
  const current = versions[0];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Outline 生成/編輯</h2>
      <form action={`/api/projects/${params.id}/outline`} method="post" className="card space-y-2">
        <textarea name="content" rows={14} defaultValue={JSON.stringify(current?.content ?? { acts: [], chapterBeats: [] }, null, 2)} />
        <button type="submit">儲存 Outline 版本</button>
      </form>
      <Link href={`/projects/${params.id}/chapters`} className="rounded border border-slate-700 px-3 py-2 inline-block">下一步：Chapter Plan</Link>
    </div>
  );
}
