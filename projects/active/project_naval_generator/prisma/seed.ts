import { PrismaClient, Stage } from "@prisma/client";

const prisma = new PrismaClient();

const planningDemo = {
  market_format: {
    genre: "都市奇幻",
    subgenre: "懸疑成長",
    target_audience_age: "18-35",
    platform: "網文平台",
    total_word_target: 120000,
    chapters_target: 60,
    chapter_word_target: 2200,
    pov: "第一人稱",
    tense: "過去式",
    pacing_style: "快節奏"
  },
  core_selling_points: {
    logline: "一名失憶潛航員在港城迷案中，發現自己其實是『潮汐引擎』唯一鑰匙。",
    hooks: ["每章以倒數計時收尾", "主角記憶會被海潮重寫", "反派其實是未來的自己"],
    taboo: ["不降智", "不拖更式水文", "不無意義三角戀", "不臨時外掛", "不神轉折硬拗"],
    tone_keywords: ["冷冽", "緊繃", "帶鹽味", "黑色幽默", "情緒克制"]
  }
};

const bibleDemo = {
  world_rules: {
    time_period: "近未來 2090",
    location: "東亞沿海巨型港城",
    society_system: "企業邦聯 + 半自治區",
    tech_or_magic_system: "潮汐引擎可改寫局部因果",
    hard_rules: ["引擎每次啟動最多90秒", "不能復活已死亡超過24小時者", "同一人每週最多改寫一次"],
    limitation_and_cost: ["啟動者會失去一段記憶", "需要稀有冷卻介質", "高壓會導致幻聽"],
    realism_level: "中高"
  },
  characters: [
    { name: "林岑", role: "主角", desire: "找回真相", flaw: "過度控制", arc_start: "逃避", arc_end: "承擔" },
    { name: "遲航", role: "對手", desire: "封鎖引擎", flaw: "偏執", arc_start: "鐵腕", arc_end: "鬆動" },
    { name: "蘇羽", role: "盟友", desire: "保護社區", flaw: "衝動", arc_start: "單打", arc_end: "協作" }
  ]
};

const outlineDemo = {
  acts: [
    { act: 1, summary: "主角甦醒並捲入港口爆炸案" },
    { act: 2, summary: "中段反轉揭露『遲航=未來林岑』" },
    { act: 3, summary: "高潮決戰於潮汐引擎核心" }
  ]
};

const chapterPlanDemo = {
  chapters: [
    { chapterNo: 1, title: "潮聲裡的空白", goal: "建立世界與危機", hook: "倒數 89:59" },
    { chapterNo: 2, title: "鹽霧追獵", goal: "追查線索", hook: "盟友遭綁架" },
    { chapterNo: 3, title: "第二把鑰匙", goal: "揭露半個真相", hook: "反派現身" }
  ]
};

async function main() {
  const exists = await prisma.project.findFirst();
  if (exists) return;

  const project = await prisma.project.create({
    data: {
      title: "Demo - 潮汐引擎",
      description: "可直接點流程示範",
      stage: Stage.PLANNING
    }
  });

  await prisma.planningSnapshot.create({
    data: { projectId: project.id, version: 1, json: planningDemo }
  });
  await prisma.bibleVersion.create({
    data: { projectId: project.id, version: 1, json: bibleDemo }
  });
  await prisma.outlineVersion.create({
    data: { projectId: project.id, version: 1, json: outlineDemo }
  });
  await prisma.chapterPlanVersion.create({
    data: { projectId: project.id, version: 1, json: chapterPlanDemo }
  });

  await prisma.chapterDraft.create({
    data: {
      projectId: project.id,
      chapterNo: 1,
      version: 1,
      text: "林岑在潮聲中醒來，口袋裡只有一把生鏽鑰匙與陌生人的求救訊息。",
      params: { temperature: 0.8 },
      promptHash: "seed_demo",
      refs: { bibleVersion: 1, outlineVersion: 1, chapterPlanVersion: 1 }
    }
  });

  await prisma.chapterSummary.create({
    data: {
      projectId: project.id,
      chapterNo: 1,
      version: 1,
      summary: "林岑甦醒後被捲入港口爆炸調查，發現自己可能與潮汐引擎事件有關。"
    }
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
