import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = await params;
  const chapterNo = Number(n);

  const [plan, latestDraft, latestQA] = await Promise.all([
    prisma.chapterPlanVersion.findFirst({ where: { projectId: id }, orderBy: { version: "desc" } }),
    prisma.chapterDraft.findFirst({ where: { projectId: id, chapterNo }, orderBy: { version: "desc" } }),
    prisma.qAReport.findFirst({ where: { projectId: id, chapterNo }, orderBy: { createdAt: "desc" } })
  ]);

  const chapters = ((plan?.json as any)?.chapters || []) as any[];
  const chapterCard = chapters.find((x) => Number(x.chapterNo) === chapterNo) || {};

  return NextResponse.json({ chapterCard, latestDraft, latestQA });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = await params;
  const chapterNo = Number(n);
  const body = await req.json();

  const latest = await prisma.chapterDraft.findFirst({ where: { projectId: id, chapterNo }, orderBy: { version: "desc" }, select: { version: true } });
  const version = (latest?.version || 0) + 1;

  const draft = await prisma.chapterDraft.create({
    data: {
      projectId: id,
      chapterNo,
      version,
      text: body.text,
      params: body.params || {},
      promptHash: body.promptHash || "manual",
      refs: body.refs || {}
    }
  });

  await prisma.project.update({ where: { id }, data: { stage: "QA" } });

  return NextResponse.json({ draft });
}
