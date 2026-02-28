export const STAGES = ["PLANNING", "BIBLE", "OUTLINE", "CHAPTER_PLAN", "DRAFT", "QA", "EXPORT"] as const;
export type Stage = (typeof STAGES)[number];

export const stageRoutes: Record<Stage, string> = {
  PLANNING: "planning",
  BIBLE: "bible",
  OUTLINE: "outline",
  CHAPTER_PLAN: "chapters",
  DRAFT: "chapters",
  QA: "chapters",
  EXPORT: "export"
};

export const stageSystemPrompts = {
  planning: "你是小說策劃總編，擅長把模糊需求變成可執行藍圖。輸出務必完整、具商業可行性。",
  author: "你是長篇連載作者，擅長節奏與鉤子，對角色動機連續性敏感。",
  editor: "你是嚴格責編，專注於一致性、動機、節奏、章尾轉折和可讀性。"
} as const;
