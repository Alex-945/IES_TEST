import { prisma } from "@/lib/prisma";

export async function buildProjectExportContent(projectId: string, scope: string) {
  const drafts = await prisma.chapterDraft.findMany({
    where: { projectId },
    orderBy: [{ chapterNumber: "asc" }, { version: "desc" }],
  });

  const latestByChapter = new Map<number, string>();
  drafts.forEach((draft) => {
    if (!latestByChapter.has(draft.chapterNumber)) {
      latestByChapter.set(draft.chapterNumber, draft.content);
    }
  });

  const chapterEntries = Array.from(latestByChapter.entries());
  if (scope === "by_chapter") {
    return chapterEntries
      .map(([n, c]) => `## 章節 ${n}\n\n${c}`)
      .join("\n\n");
  }

  return chapterEntries
    .map(([n, c]) => `# 第${n}章\n\n${c}`)
    .join("\n\n");
}

export function normalizeExportFormat(format: string) {
  return format.toUpperCase() === "TXT" ? "TXT" : "Markdown";
}

export function formatExportContent(content: string, format: string) {
  if (format === "TXT") {
    return content
      .replace(/^#\s+/gm, "")
      .replace(/^##\s+/gm, "");
  }
  return content;
}
