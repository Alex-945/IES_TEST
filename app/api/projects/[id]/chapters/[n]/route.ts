import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string; n: string } }) {
  const { content } = await req.json();
  const chapterNumber = Number(params.n);
  const latest = await prisma.chapterDraft.findFirst({ where: { projectId: params.id, chapterNumber }, orderBy: { version: "desc" } });
  const version = (latest?.version ?? 0) + 1;
  await prisma.chapterDraft.create({ data: { projectId: params.id, chapterNumber, version, content } });
  await prisma.chapterSummary.create({ data: { projectId: params.id, chapterNumber, version, summary: content.slice(0, 300) } });
  return Response.json({ ok: true });
}

export async function PUT(req: Request, { params }: { params: { id: string; n: string } }) {
  const { qa } = await req.json();
  await prisma.qaReport.create({ data: { projectId: params.id, chapterNumber: Number(params.n), report: qa, score: qa.overallScore, hookScore: qa.chapterHook?.score } });
  await prisma.project.update({ where: { id: params.id }, data: { workflowState: "QA" } });
  return Response.json({ ok: true });
}
