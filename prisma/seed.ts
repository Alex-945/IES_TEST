import { PrismaClient, WorkflowState } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.upsert({
    where: { id: "demo-project" },
    update: {},
    create: {
      id: "demo-project",
      title: "Demo 商業奇幻",
      description: "帶你快速瀏覽 Planning→Export 流程",
      workflowState: WorkflowState.OUTLINE
    }
  });

  await prisma.planningSnapshot.upsert({
    where: { projectId_version: { projectId: project.id, version: 1 } },
    update: {},
    create: {
      projectId: project.id,
      version: 1,
      payload: {
        genre: "奇幻",
        subgenre: "都會奇幻",
        logline: "落魄獵魔人必須與宿敵合作阻止城市沉沒。",
        hooks: ["敵我同盟", "城市倒數毀滅", "主角黑歷史曝光"]
      }
    }
  });

  await prisma.bibleVersion.upsert({
    where: { projectId_version: { projectId: project.id, version: 1 } },
    update: {},
    create: {
      projectId: project.id,
      version: 1,
      content: {
        hardRules: ["禁術需付出壽命", "聖印不可偽造"],
        protagonist: { name: "林夜", flaw: "自負", arc: "學會信任" }
      }
    }
  });

  await prisma.outlineVersion.upsert({
    where: { projectId_version: { projectId: project.id, version: 1 } },
    update: {},
    create: {
      projectId: project.id,
      version: 1,
      content: {
        acts: ["開場災難", "中段背叛", "終局反攻"]
      }
    }
  });
}

main().finally(() => prisma.$disconnect());
