import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const form = await req.formData();
  const count = Number(form.get("count") || 3);
  const chapterCards = Array.from({ length: count }).map((_, i) => ({
    chapter: i + 1,
    objective: `第${i + 1}章主要目標`,
    conflict: `第${i + 1}章衝突升級`,
    hook: `第${i + 1}章章尾鉤子`
  }));

  const latestPlan = await prisma.chapterPlanVersion.findFirst({ where: { projectId: params.id }, orderBy: { version: "desc" } });
  await prisma.chapterPlanVersion.create({
    data: {
      projectId: params.id,
      version: (latestPlan?.version ?? 0) + 1,
      content: { chapterCards }
    }
  });

  for (let i = 1; i <= count; i++) {
    const latestDraft = await prisma.chapterDraft.findFirst({ where: { projectId: params.id, chapterNumber: i }, orderBy: { version: "desc" } });
    await prisma.chapterDraft.create({
      data: {
        projectId: params.id,
        chapterNumber: i,
        version: (latestDraft?.version ?? 0) + 1,
        content: `第${i}章章節卡：${chapterCards[i - 1].conflict}`
      }
    });
  }

  await prisma.project.update({ where: { id: params.id }, data: { workflowState: "DRAFT" } });
  return NextResponse.redirect(new URL(`/projects/${params.id}/chapters`, req.url));
}
