import { stageSystemPrompts } from "./types";

export function buildPrompt(input: {
  role: "planning" | "author" | "editor";
  context: {
    bibleSummary?: string;
    storySummary?: string;
    chapterCard?: unknown;
  };
  task: string;
}) {
  const system = stageSystemPrompts[input.role];
  const contextBlock = {
    bible_summary: input.context.bibleSummary ?? "",
    story_summary: input.context.storySummary ?? "",
    chapter_card: input.context.chapterCard ?? {}
  };

  return {
    system,
    user: `Context:\n${JSON.stringify(contextBlock, null, 2)}\n\nTask:\n${input.task}`
  };
}
