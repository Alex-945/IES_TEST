import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <main className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">小說工作台</h1>
          <p className="text-sm text-slate-600">本機單人版，資料全落地於 ./data</p>
        </div>
        <form action="/api/projects" method="post" className="flex gap-2">
          <input name="title" required placeholder="新專案名稱" className="rounded border px-3 py-2" />
          <button className="btn" type="submit">新增</button>
        </form>
      </div>

      <div className="grid gap-3">
        {projects.map((p) => (
          <Link key={p.id} className="card hover:bg-slate-50" href={`/projects/${p.id}/planning`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-slate-500">{p.description || "無描述"}</div>
              </div>
              <div className="rounded-full bg-slate-100 px-2 py-1 text-xs">{p.stage}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
