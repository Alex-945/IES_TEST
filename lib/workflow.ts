export const WORKFLOW_STEPS = ["PLANNING", "BIBLE", "OUTLINE", "CHAPTER_PLAN", "DRAFT", "QA", "EXPORT"] as const;

export function workflowProgress(state: string) {
  const idx = WORKFLOW_STEPS.indexOf(state as (typeof WORKFLOW_STEPS)[number]);
  return idx < 0 ? 0 : Math.round(((idx + 1) / WORKFLOW_STEPS.length) * 100);
}
