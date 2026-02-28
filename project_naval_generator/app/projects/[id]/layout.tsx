import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StageHeader } from "@/components/StageHeader";

export default async function ProjectLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return notFound();

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-semibold">{project.title}</h2>
        <p className="text-sm text-slate-600">{project.description || "¥¼¶ñ¼g´y­z"}</p>
      </div>
      <StageHeader projectId={project.id} stage={project.stage as any} />
      {children}
    </div>
  );
}
