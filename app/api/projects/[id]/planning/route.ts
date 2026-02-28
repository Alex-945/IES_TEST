import { prisma } from "@/lib/prisma";
import { analyzePlanningGap } from "@/lib/gapAnalyzer";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const form = await req.formData();
  const payload = JSON.parse(String(form.get("payload") || "{}"));
  const latest = await prisma.planningSnapshot.findFirst({ where: { projectId: params.id }, orderBy: { version: "desc" } });
  const version = (latest?.version ?? 0) + 1;
  const gaps = analyzePlanningGap(payload);
  await prisma.planningSnapshot.create({ data: { projectId: params.id, version, payload, gaps } });
  await prisma.project.update({ where: { id: params.id }, data: { workflowState: "BIBLE" } });
  return NextResponse.redirect(new URL(`/projects/${params.id}/planning`, req.url));
}
