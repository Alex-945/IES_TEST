import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">專案列表</h2>
      <p className="text-sm text-slate-400">本工具是本機網頁應用（localhost），所有資料預設保存在你電腦的 SQLite 檔案中。</p>

      <form action="/api/projects" method="post" className="card grid gap-2">
        <input name="title" placeholder="新專案名稱" required />
        <textarea name="description" placeholder="描述" />
        <button type="submit">新增專案</button>
      </form>

      <form action="/api/projects/import" method="post" encType="multipart/form-data" className="card grid gap-2">
        <p className="text-sm font-medium">匯入本地備份（JSON）</p>
        <input type="file" name="backupFile" accept="application/json" required />
        <button type="submit">從檔案匯入專案</button>
      </form>

      <div className="grid gap-3">
        {projects.map((p) => (
          <div key={p.id} className="card">
            <Link href={`/projects/${p.id}/planning`} className="block">
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-slate-400">{p.workflowState}</p>
            </Link>
            <div className="mt-2">
              <a href={`/api/projects/${p.id}/backup`} className="text-xs underline">
                下載專案備份 JSON
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
