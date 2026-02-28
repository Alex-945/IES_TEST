import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDataDirs } from "@/lib/data-dir";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { type } = await req.json();

  ensureDataDirs();

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const drafts = await prisma.chapterDraft.findMany({ where: { projectId: id }, orderBy: [{ chapterNo: "asc" }, { version: "desc" }] });

  const byChapter = new Map<number, string>();
  for (const d of drafts) {
    if (!byChapter.has(d.chapterNo)) byChapter.set(d.chapterNo, d.text);
  }

  const entries = [...byChapter.entries()].sort((a, b) => a[0] - b[0]);
  const exportDir = join(process.cwd(), "data", "exports");

  const writes: string[] = [];

  if (type === "markdown_split" || type === "txt_split") {
    for (const [n, text] of entries) {
      const ext = type.startsWith("markdown") ? "md" : "txt";
      const p = join(exportDir, `${project.title.replace(/\s+/g, "_")}_chapter_${n}.${ext}`);
      writeFileSync(p, type.startsWith("markdown") ? `# ²Ä ${n} ³¹\n\n${text}` : text, "utf8");
      writes.push(p);
      await prisma.exportRecord.create({ data: { projectId: id, type, path: p } });
    }
  } else {
    const ext = type.startsWith("markdown") ? "md" : "txt";
    const content = entries.map(([n, text]) => (type.startsWith("markdown") ? `# ²Ä ${n} ³¹\n\n${text}` : `²Ä${n}³¹\n${text}`)).join("\n\n");
    const p = join(exportDir, `${project.title.replace(/\s+/g, "_")}_full.${ext}`);
    writeFileSync(p, content, "utf8");
    writes.push(p);
    await prisma.exportRecord.create({ data: { projectId: id, type, path: p } });
  }

  return NextResponse.json({ ok: true, files: writes });
}
