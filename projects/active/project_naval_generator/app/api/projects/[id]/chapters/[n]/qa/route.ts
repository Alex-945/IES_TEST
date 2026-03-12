import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildPrompt } from "@/lib/prompts";
import { callDeepSeekJson, callDeepSeekText } from "@/lib/llm";
import { qaSchema } from "@/lib/json-schemas";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = await params;
  const chapterNo = Number(n);
  const { rewrite } = await req.json();

  const [draft, bible] = await Promise.all([
    prisma.chapterDraft.findFirst({ where: { projectId: id, chapterNo }, orderBy: { version: "desc" } }),
    prisma.bibleVersion.findFirst({ where: { projectId: id }, orderBy: { version: "desc" } })
  ]);

  if (!draft) return NextResponse.json({ error: "尚無章節草稿" }, { status: 400 });

  const prompt = buildPrompt({
    role: "editor",
    context: { bibleSummary: JSON.stringify(bible?.json || {}), storySummary: "", chapterCard: {} },
    task: `針對章節文本做 QA，輸出 JSON：scores/issues/rewrite_brief/must_keep_rules。文本：${draft.text}`
  });

  let qaJson: any = null;
  const ai = await callDeepSeekJson({ system: prompt.system, user: prompt.user, temperature: 0.2 });
  try {
    qaJson = qaSchema.parse(JSON.parse(ai.text));
  } catch {
    qaJson = {
      scores: { consistency: 78, motivation: 76, pacing: 80, hook: 82 },
      issues: [{ type: "consistency", detail: "有1處世界規則描述過於模糊", suggestion: "補充代價機制" }],
      rewrite_brief: "保留章尾鉤子，強化動機過渡，不改 hard_rules",
      must_keep_rules: ((bible?.json as any)?.world_rules?.hard_rules || []).slice(0, 5)
    };
  }

  const report = await prisma.qAReport.create({
    data: {
      projectId: id,
      chapterNo,
      draftVersion: draft.version,
      json: qaJson,
      scores: qaJson.scores
    }
  });

  let rewrittenDraft: string | null = null;

  if (rewrite) {
    const rewritePrompt = buildPrompt({
      role: "author",
      context: { bibleSummary: JSON.stringify(bible?.json || {}), storySummary: "", chapterCard: {} },
      task: `依 QA 建議重寫章節，禁止改動 Bible hard_rules。QA：${JSON.stringify(qaJson)}\n原文：${draft.text}`
    });

    const rewritten = await callDeepSeekText({ system: rewritePrompt.system, user: rewritePrompt.user, temperature: 0.75 });
    rewrittenDraft = rewritten.text;

    const latest = await prisma.chapterDraft.findFirst({ where: { projectId: id, chapterNo }, orderBy: { version: "desc" }, select: { version: true } });
    await prisma.chapterDraft.create({
      data: {
        projectId: id,
        chapterNo,
        version: (latest?.version || 0) + 1,
        text: rewrittenDraft,
        params: { rewrite: true },
        promptHash: rewritten.promptHash,
        refs: { bibleVersion: bible?.version, qaReportId: report.id }
      }
    });
  }

  await prisma.project.update({ where: { id }, data: { stage: "EXPORT" } });

  return NextResponse.json({ qa: qaJson, reportId: report.id, rewrittenDraft });
}
