import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const title = String(form.get("title") || "未命名專案");
  const description = String(form.get("description") || "");
  const p = await prisma.project.create({ data: { title, description } });
  return NextResponse.redirect(new URL(`/projects/${p.id}/planning`, req.url));
}
