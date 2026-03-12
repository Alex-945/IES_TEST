import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      planningSnapshots: { orderBy: { version: "asc" } },
      bibleVersions: { orderBy: { version: "asc" } },
      outlineVersions: { orderBy: { version: "asc" } },
      chapterPlan: { orderBy: { version: "asc" } },
      chapterDrafts: { orderBy: [{ chapterNumber: "asc" }, { version: "asc" }] },
      chapterSummaries: { orderBy: [{ chapterNumber: "asc" }, { version: "asc" }] },
      qaReports: { orderBy: { createdAt: "asc" } },
      experimentRuns: { orderBy: { createdAt: "asc" } },
      exportRecords: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!project) return new Response("Not found", { status: 404 });

  const filename = `${project.title.replace(/\s+/g, "-") || "project"}-backup.json`;
  return new Response(JSON.stringify(project, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
