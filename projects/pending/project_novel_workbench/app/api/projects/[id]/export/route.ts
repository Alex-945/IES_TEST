import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  buildProjectExportContent,
  formatExportContent,
  normalizeExportFormat,
} from "@/lib/export";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const url = new URL(req.url);
  const format = normalizeExportFormat(url.searchParams.get("format") || "Markdown");
  const scope = String(url.searchParams.get("scope") || "full");
  const saveRecord = url.searchParams.get("save") !== "0";
  const base = await buildProjectExportContent(params.id, scope);
  const content = formatExportContent(base, format);

  if (saveRecord) {
    await prisma.exportRecord.create({
      data: { projectId: params.id, format, chapterScope: scope, content },
    });
    await prisma.project.update({
      where: { id: params.id },
      data: { workflowState: "EXPORT" },
    });
  }

  const filename = `project-${params.id}-${scope}.${format === "TXT" ? "txt" : "md"}`;
  return new Response(content, {
    headers: {
      "Content-Type": format === "TXT" ? "text/plain; charset=utf-8" : "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const f = await req.formData();
  const format = normalizeExportFormat(String(f.get("format") || "Markdown"));
  const scope = String(f.get("scope") || "full");
  const base = await buildProjectExportContent(params.id, scope);
  const content = formatExportContent(base, format);

  await prisma.exportRecord.create({
    data: { projectId: params.id, format, chapterScope: scope, content },
  });
  await prisma.project.update({
    where: { id: params.id },
    data: { workflowState: "EXPORT" },
  });

  return NextResponse.redirect(new URL(`/projects/${params.id}/export`, req.url));
}
