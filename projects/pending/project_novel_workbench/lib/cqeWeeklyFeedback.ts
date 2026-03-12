export type AiFeedbackSample = {
  rawInput: string;
  predictedTemplateId: string;
  finalTemplateId: string;
  finalValues: Record<string, string>;
  finalZhSummary: string;
  finalEnSummary: string;
};

export const feedbackSampleFields = [
  "rawInput",
  "predictedTemplateId",
  "finalTemplateId",
  "finalValues",
  "finalZhSummary",
  "finalEnSummary"
] as const;
