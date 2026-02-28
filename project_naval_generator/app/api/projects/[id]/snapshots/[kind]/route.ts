import { NextRequest, NextResponse } from "next/server";
import { Stage } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Kind = "planning" | "bible" | "outline" | "chapterPlan";

function getModel(kind: Kind) {
  if (kind === "planning") return prisma.planningSnapshot;
  if (kind === "bible") return prisma.bibleVersion;
  if (kind === "outline") return prisma.outlineVersion;
  return prisma.chapterPlanVersion;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; kind: Kind }> }) {
  const { id, kind } = await params;
  const model = getModel(kind);
  const versionParam = req.nextUrl.searchParams.get("version");

  if (versionParam) {
    const versioned = await model.findFirst({ where: { projectId: id, version: Number(versionParam) } });
    return NextResponse.json({ versioned });
  }

  const [latest, versions] = await Promise.all([
    model.findFirst({ where: { projectId: id }, orderBy: { version: "desc" } }),
    model.findMany({ where: { projectId: id }, orderBy: { version: "desc" }, select: { version: true, createdAt: true } })
  ]);

  return NextResponse.json({ latest, versions });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; kind: Kind }> }) {
  const { id, kind } = await params;
  const model = getModel(kind);
  const body = await req.json();

  const max = await model.findFirst({ where: { projectId: id }, orderBy: { version: "desc" }, select: { version: true } });
  const nextVersion = (max?.version || 0) + 1;

  const record = await model.create({
    data: {
      projectId: id,
      version: nextVersion,
      json: body.json
    }
  });

  if (body.generation?.promptHash) {
    await prisma.generationLog.create({
      data: {
        projectId: id,
        task: kind,
        promptHash: body.generation.promptHash,
        model: body.generation.model,
        params: body.generation.params || {},
        refs: body.generation.refs || {}
      }
    });
  }

  if (body.advanceStage && Object.values(Stage).includes(body.advanceStage)) {
    await prisma.project.update({ where: { id }, data: { stage: body.advanceStage } });
  }

  return NextResponse.json({ record });
}
