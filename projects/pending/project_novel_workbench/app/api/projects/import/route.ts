import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function rows<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("backupFile");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "請上傳 backup JSON 檔案" }, { status: 400 });
  }

  let data: Record<string, any>;
  try {
    data = JSON.parse(await file.text());
  } catch {
    return NextResponse.json({ error: "JSON 格式錯誤" }, { status: 400 });
  }

  const newProjectId = crypto.randomUUID().replace(/-/g, "");

  await prisma.$transaction(async (tx) => {
    await tx.project.create({
      data: {
        id: newProjectId,
        title: `${String(data.title || "匯入專案")} (Imported)`,
        description: data.description ? String(data.description) : "由本地備份匯入",
        workflowState: data.workflowState || "PLANNING",
      },
    });

    await tx.planningSnapshot.createMany({ data: rows<any>(data.planningSnapshots).map(({ id, projectId, ...row }) => ({ ...row, projectId: newProjectId })) });
    await tx.bibleVersion.createMany({ data: rows<any>(data.bibleVersions).map(({ id, projectId, ...row }) => ({ ...row, projectId: newProjectId })) });
    await tx.outlineVersion.createMany({ data: rows<any>(data.outlineVersions).map(({ id, projectId, ...row }) => ({ ...row, projectId: newProjectId })) });
    await tx.chapterPlanVersion.createMany({ data: rows<any>(data.chapterPlan).map(({ id, projectId, ...row }) => ({ ...row, projectId: newProjectId })) });
    await tx.chapterDraft.createMany({ data: rows<any>(data.chapterDrafts).map(({ id, projectId, ...row }) => ({ ...row, projectId: newProjectId })) });
    await tx.chapterSummary.createMany({ data: rows<any>(data.chapterSummaries).map(({ id, projectId, ...row }) => ({ ...row, projectId: newProjectId })) });
    await tx.qAReport.createMany({ data: rows<any>(data.qaReports).map(({ id, projectId, ...row }) => ({ ...row, projectId: newProjectId })) });
    await tx.experimentRun.createMany({ data: rows<any>(data.experimentRuns).map(({ id, projectId, ...row }) => ({ ...row, projectId: newProjectId })) });
    await tx.exportRecord.createMany({ data: rows<any>(data.exportRecords).map(({ id, projectId, ...row }) => ({ ...row, projectId: newProjectId })) });
  });

  return NextResponse.redirect(new URL(`/projects/${newProjectId}/planning`, req.url));
}
