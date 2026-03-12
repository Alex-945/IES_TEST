import { hashPrompt } from "./hash";

const SYSTEM = `你同時扮演三種角色：\n1) 商業小說策劃\n2) 職業作者\n3) 嚴格編輯\n輸出必須可執行且可回溯。`;

export function buildPrompt(input: { bibleSummary?: string; storySummary?: string; chapterCard?: string; task: string }) {
  const payload = {
    system: SYSTEM,
    context: {
      bibleSummary: input.bibleSummary ?? "",
      storySummary: input.storySummary ?? "",
      chapterCard: input.chapterCard ?? ""
    },
    task: input.task
  };
  return { ...payload, promptHash: hashPrompt(payload) };
}
