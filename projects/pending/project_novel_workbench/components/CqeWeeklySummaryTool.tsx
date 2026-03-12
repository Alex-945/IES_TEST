"use client";

import { useState } from "react";
import {
  cqeWeeklyTemplates,
  generateSummary,
  getTemplateById,
  summaryRules
} from "@/lib/cqeWeeklyTemplates";
import { glossary, projectMemory } from "@/lib/cqeWeeklyKnowledge";

type FormValues = Record<string, string>;
type AiState = {
  loading: boolean;
  error: string;
  confidence: number | null;
  notes: string[];
};

function createInitialValues(templateId: string) {
  const template = getTemplateById(templateId);
  return Object.fromEntries(template.fields.map((field) => [field.key, ""]));
}

export default function CqeWeeklySummaryTool() {
  const [templateId, setTemplateId] = useState(cqeWeeklyTemplates[0].id);
  const [values, setValues] = useState<FormValues>(() => createInitialValues(cqeWeeklyTemplates[0].id));
  const [copied, setCopied] = useState<"" | "zh" | "en" | "both">("");
  const [rawInput, setRawInput] = useState("");
  const [aiState, setAiState] = useState<AiState>({
    loading: false,
    error: "",
    confidence: null,
    notes: []
  });

  const currentTemplate = getTemplateById(templateId);
  const result = generateSummary(templateId, values);

  function handleChange(key: string, nextValue: string) {
    setValues((current) => ({ ...current, [key]: nextValue }));
  }

  function handleTemplateSelect(nextTemplateId: string) {
    setTemplateId(nextTemplateId);
    setValues(createInitialValues(nextTemplateId));
    setCopied("");
  }

  async function handleAiGenerate() {
    if (!rawInput.trim()) {
      setAiState({
        loading: false,
        error: "請先貼上工程師描述、客戶郵件或會議摘要。",
        confidence: null,
        notes: []
      });
      return;
    }

    setAiState({ loading: true, error: "", confidence: null, notes: [] });

    try {
      const response = await fetch("/api/cqe-weekly/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: rawInput })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "AI generation failed");
      }

      setTemplateId(payload.templateId);
      setValues({ ...createInitialValues(payload.templateId), ...payload.values });
      setAiState({
        loading: false,
        error: "",
        confidence: typeof payload.confidence === "number" ? payload.confidence : null,
        notes: Array.isArray(payload.notes) ? payload.notes : []
      });
    } catch (error) {
      setAiState({
        loading: false,
        error: error instanceof Error ? error.message : "AI generation failed",
        confidence: null,
        notes: []
      });
    }
  }

  async function copyText(kind: "zh" | "en" | "both") {
    const payload =
      kind === "both" ? `${result.zh}\n${result.en}` : kind === "zh" ? result.zh : result.en;
    await navigator.clipboard.writeText(payload);
    setCopied(kind);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-amber-300/20 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_34%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.96))] p-6 shadow-[0_20px_80px_rgba(15,23,42,0.55)]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">CQE Weekly Summary</p>
            <h2 className="text-3xl font-semibold text-white">固定句型總結工具</h2>
            <p className="text-sm leading-6 text-slate-300">
              依據 `CQE_weekly_product_database&formate_20251204` 的模板重建。主流程改為 AI 先判斷模板與抽欄位，工程師只需要貼資料並確認。
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
            <div>模板數量：{cqeWeeklyTemplates.length}</div>
            <div>目前模式：AI 選模板 + 規則化產生</div>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-amber-300/20 bg-black/20 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">AI 快速輸入</h3>
              <p className="mt-1 text-sm text-slate-300">
                貼上客訴、會議紀錄、拜訪重點或工程師零散描述。系統會自動選模板、抽欄位並生成中英文總結。
              </p>
            </div>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={aiState.loading}
              className="bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-200"
            >
              {aiState.loading ? "AI 分析中..." : "AI 產生"}
            </button>
          </div>
          <textarea
            value={rawInput}
            onChange={(event) => setRawInput(event.target.value)}
            rows={6}
            placeholder="例如：Kostal 3/20 反映 Jiading 專案 window switch 在客戶線發現 scratch 12pcs，目前已安排 sorting，FA 진행中..."
            className="border-white/10 bg-slate-950/80 text-white placeholder:text-slate-500"
          />
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {aiState.confidence !== null ? (
              <div className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                AI confidence: {(aiState.confidence * 100).toFixed(0)}%
              </div>
            ) : null}
            {aiState.error ? (
              <div className="rounded-full border border-rose-300/30 bg-rose-500/10 px-3 py-1 text-rose-200">
                {aiState.error}
              </div>
            ) : null}
          </div>
          {aiState.notes.length > 0 ? (
            <div className="mt-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-slate-300">
              {aiState.notes.map((note) => (
                <div key={note}>{note}</div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
              <label className="mb-2 block text-sm font-medium text-slate-200">選擇模板</label>
              <select
                value={templateId}
                onChange={(event) => handleTemplateSelect(event.target.value)}
                className="border-white/10 bg-slate-950/80 text-white"
              >
                {cqeWeeklyTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.category} / {template.type} / {template.label}
                  </option>
                ))}
              </select>
              <div className="mt-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-slate-300">
                <div className="mb-1 text-cyan-300">{currentTemplate.description}</div>
                <div className="font-mono text-xs text-slate-400">{currentTemplate.sourceTemplate}</div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-3 text-xs text-slate-300">
                  <div className="mb-1 text-slate-100">Project Memory</div>
                  <div>{projectMemory.length} 筆可擴充主資料</div>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-3 text-xs text-slate-300">
                  <div className="mb-1 text-slate-100">Controlled Glossary</div>
                  <div>{glossary.length} 筆受控術語</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/45 p-5 md:grid-cols-2">
              {currentTemplate.fields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    {field.label}
                    {field.required ? <span className="ml-2 text-amber-300">*</span> : null}
                  </span>
                  <input
                    value={values[field.key] ?? ""}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="border-white/10 bg-slate-950/80 text-white placeholder:text-slate-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">輸出規則</h3>
                <span className="rounded-full border border-amber-300/30 px-3 py-1 text-xs text-amber-200">
                  Source CSV Rules
                </span>
              </div>
              <div className="space-y-2 text-sm leading-6 text-slate-300">
                {summaryRules.map((rule) => (
                  <div key={rule} className="rounded-2xl border border-white/5 bg-white/5 px-3 py-2">
                    {rule}
                  </div>
                ))}
              </div>
              {result.missing.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  缺少必填欄位：{result.missing.join("、")}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  必填欄位完整，已按模板生成。
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">中文 Summary</h3>
                <button type="button" onClick={() => copyText("zh")} className="bg-amber-500 px-3 py-2 text-sm text-slate-950 hover:bg-amber-400">
                  {copied === "zh" ? "已複製" : "複製中文"}
                </button>
              </div>
              <div className="min-h-28 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-100">
                {result.zh}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">English Summary</h3>
                <button type="button" onClick={() => copyText("en")} className="bg-sky-500 px-3 py-2 text-sm text-slate-950 hover:bg-sky-400">
                  {copied === "en" ? "Copied" : "Copy English"}
                </button>
              </div>
              <div className="min-h-28 rounded-2xl border border-white/10 bg-black/20 p-4 font-mono text-sm leading-7 text-slate-100">
                {result.en}
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyText("both")}
              className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200"
            >
              {copied === "both" ? "中英文已複製" : "複製中英文"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
