import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let title = "·s±M®×";

  if (contentType.includes("application/json")) {
    const body = await req.json();
    title = body.title || title;
  } else {
    const form = await req.formData();
    title = String(form.get("title") || title);
  }

  const project = await prisma.project.create({
    data: { title }
  });

  if (!contentType.includes("application/json")) {
    return NextResponse.redirect(new URL(`/projects/${project.id}/planning`, req.url), 303);
  }

  return NextResponse.json({ project });
}
