import { z } from "zod";

export const qaSchema = z.object({
  consistency: z.array(z.string()),
  motivation: z.array(z.string()),
  repetition: z.array(z.string()),
  pacing: z.array(z.string()),
  chapterHook: z.object({ score: z.number().min(0).max(10), notes: z.string() }),
  overallScore: z.number().min(0).max(100),
  rewriteSuggestions: z.array(z.string())
});

export const outlineSchema = z.object({ acts: z.array(z.string()), chapterBeats: z.array(z.object({ chapter: z.number(), beat: z.string() })) });

export const bibleSchema = z.object({ hardRules: z.array(z.string()), characters: z.array(z.object({ name: z.string(), arc: z.string() })), world: z.record(z.any()) });

export const cqeWeeklyAiSchema = z.object({
  templateId: z.string(),
  values: z.record(z.string()),
  confidence: z.number().min(0).max(1),
  notes: z.array(z.string()).default([])
});
