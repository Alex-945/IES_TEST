import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const form = await req.formData();
  const content = JSON.parse(String(form.get("content") || "{}"));
  const latest = await prisma.bibleVersion.findFirst({ where: { projectId: params.id }, orderBy: { version: "desc" } });
  const version = (latest?.version ?? 0) + 1;
  await prisma.bibleVersion.create({ data: { projectId: params.id, version, content } });
  await prisma.project.update({ where: { id: params.id }, data: { workflowState: "OUTLINE" } });
  return NextResponse.redirect(new URL(`/projects/${params.id}/bible`, req.url));
}
