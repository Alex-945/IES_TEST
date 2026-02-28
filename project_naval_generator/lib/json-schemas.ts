import { z } from "zod";

export const bibleSchema = z.object({
  world_rules: z.object({
    time_period: z.string(),
    location: z.string(),
    society_system: z.string(),
    tech_or_magic_system: z.string(),
    hard_rules: z.array(z.string()).min(5),
    limitation_and_cost: z.array(z.string()).min(3),
    realism_level: z.string()
  }),
  characters: z.array(z.record(z.any())).min(3)
});

export const outlineSchema = z.object({
  acts: z.array(
    z.object({
      act: z.number(),
      summary: z.string()
    })
  ).min(3)
});

export const chapterPlanSchema = z.object({
  chapters: z.array(
    z.object({
      chapterNo: z.number(),
      title: z.string(),
      goal: z.string(),
      hook: z.string()
    })
  ).min(1)
});

export const qaSchema = z.object({
  scores: z.object({
    consistency: z.number().min(0).max(100),
    motivation: z.number().min(0).max(100),
    pacing: z.number().min(0).max(100),
    hook: z.number().min(0).max(100)
  }),
  issues: z.array(z.object({
    type: z.string(),
    detail: z.string(),
    suggestion: z.string()
  })),
  rewrite_brief: z.string(),
  must_keep_rules: z.array(z.string())
});

export const planningSchema = z.record(z.any());

export const schemaMap = {
  planning: planningSchema,
  bible: bibleSchema,
  outline: outlineSchema,
  chapter_plan: chapterPlanSchema,
  qa: qaSchema
};

export type SchemaName = keyof typeof schemaMap;
