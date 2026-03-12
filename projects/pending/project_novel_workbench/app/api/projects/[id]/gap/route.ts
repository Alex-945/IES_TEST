import { prisma } from "@/lib/prisma";
import { analyzePlanningGap } from "@/lib/gapAnalyzer";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const latest = await prisma.planningSnapshot.findFirst({ where: { projectId: params.id }, orderBy: { version: "desc" } });
  const gaps = analyzePlanningGap((latest?.payload as any) ?? {});
  return Response.json({ gaps });
}
