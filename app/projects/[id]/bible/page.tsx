import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BiblePage({ params }: { params: { id: string } }) {
  const versions = await prisma.bibleVersion.findMany({ where: { projectId: params.id }, orderBy: { version: "desc" } });
  const current = versions[0];
  const previous = versions[1];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Bible（JSON + 版本）</h2>
      <form action={`/api/projects/${params.id}/bible`} method="post" className="card space-y-2">
        <textarea name="content" rows={16} defaultValue={JSON.stringify(current?.content ?? { hardRules: [], characters: [], world: {} }, null, 2)} />
        <button type="submit">儲存新版本</button>
      </form>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="card"><h3>當前版本 v{current?.version ?? 0}</h3><pre>{JSON.stringify(current?.content ?? {}, null, 2)}</pre></div>
        <div className="card"><h3>前一版本 v{previous?.version ?? 0}</h3><pre>{JSON.stringify(previous?.content ?? {}, null, 2)}</pre></div>
      </div>
      <Link href={`/projects/${params.id}/outline`} className="rounded border border-slate-700 px-3 py-2 inline-block">下一步：Outline</Link>
    </div>
  );
}
