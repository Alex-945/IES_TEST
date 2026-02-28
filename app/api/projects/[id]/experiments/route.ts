import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const f = await req.formData();
  const chapterNumber = Number(f.get("chapterNumber") || 1);
  const n = Number(f.get("n") || 3);
  const temperature = Number(f.get("temperature") || 0.8);
  const top_p = Number(f.get("top_p") || 0.9);
  const seed = Number(f.get("seed") || 42);
  const styleWeight = Number(f.get("styleWeight") || 0.7);
  for (let i = 0; i < n; i++) {
    await prisma.experimentRun.create({
      data: {
        projectId: params.id,
        chapterNumber,
        variantName: `exp-${Date.now()}-${i + 1}`,
        params: { temperature, top_p, seed: seed + i, styleWeight },
        draftContent: `實驗稿 ${i + 1}`,
        qaReport: { ok: true },
        qaScore: 70 + i,
        hookScore: 6 + i * 0.5
      }
    });
  }
  return NextResponse.redirect(new URL(`/projects/${params.id}/experiments`, req.url));
}
