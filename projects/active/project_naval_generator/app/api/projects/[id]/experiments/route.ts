import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { times } = await req.json();

  const run = await prisma.experimentRun.create({
    data: {
      projectId: id,
      title: `前3章批量試點 x${times}`,
      rounds: times || 2
    }
  });

  const chapters = [1, 2, 3];
  const resultRows: any[] = [];

  for (const chapterNo of chapters) {
    for (let i = 1; i <= (times || 2); i++) {
      const draftText = `Chapter ${chapterNo} / Variant ${i}: 試點草稿示意內容。`;
      const result = await prisma.experimentResult.create({
        data: {
          runId: run.id,
          chapterNo,
          variantName: `v${i}`,
          draftText,
          qaJson: { score: 70 + i }
        }
      });
      resultRows.push(result);
    }
  }

  return NextResponse.json({ run, results: resultRows.slice(0, 2), total: resultRows.length });
}
