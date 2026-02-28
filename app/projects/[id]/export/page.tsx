import { prisma } from "@/lib/prisma";

export default async function ExportPage({ params }: { params: { id: string } }) {
  const records = await prisma.exportRecord.findMany({
    where: { projectId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">導出</h2>
      <form action={`/api/projects/${params.id}/export`} method="post" className="card grid grid-cols-2 gap-2">
        <select name="format">
          <option>Markdown</option>
          <option>TXT</option>
        </select>
        <select name="scope">
          <option>full</option>
          <option>by_chapter</option>
        </select>
        <button className="col-span-2">只保存到系統紀錄</button>
      </form>

      <div className="card grid grid-cols-2 gap-2 text-sm">
        <a
          className="underline"
          href={`/api/projects/${params.id}/export?format=Markdown&scope=full&save=1`}
        >
          下載 Markdown（並保存紀錄）
        </a>
        <a className="underline" href={`/api/projects/${params.id}/export?format=TXT&scope=full&save=1`}>
          下載 TXT（並保存紀錄）
        </a>
      </div>

      {records.map((r) => (
        <div key={r.id} className="card text-xs">
          {r.format} / {r.chapterScope}
          <pre>{r.content.slice(0, 200)}</pre>
        </div>
      ))}
    </div>
  );
}
