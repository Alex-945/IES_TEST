export function summarizeJson(data: unknown) {
  try {
    const text = JSON.stringify(data, null, 2);
    return text.length > 500 ? `${text.slice(0, 500)}...` : text;
  } catch {
    return "(invalid json)";
  }
}

export function buildGapList(stage: string, json: any) {
  if (!json) return ["尚未建立資料"];
  const gaps: string[] = [];

  if (stage === "planning") {
    const checks: Array<[string, any]> = [
      ["A.市場與格式", json.market_format],
      ["B.核心賣點", json.core_selling_points],
      ["C.世界觀硬規則", json.world_rules],
      ["D.角色", json.characters],
      ["E.情節節點", json.plot_nodes],
      ["F.風格約束", json.style_constraints]
    ];
    checks.forEach(([label, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        gaps.push(`${label} 缺少內容`);
      }
    });
  }

  if (stage === "bible" && (!json.world_rules || !json.characters)) {
    gaps.push("Bible 缺 world_rules 或 characters");
  }

  if (stage === "outline" && (!json.acts || json.acts.length < 3)) {
    gaps.push("Outline 至少需要三幕結構");
  }

  if (stage === "chapters" && (!json.chapters || json.chapters.length === 0)) {
    gaps.push("尚未建立章節卡");
  }

  return gaps.length ? gaps : ["目前無明顯缺口"];
}

export function buildQuestionsFromGaps(gaps: string[]) {
  return gaps.slice(0, 3).map((gap, i) => ({
    id: i + 1,
    question: `請補齊：${gap}`,
    why: "這是下一階段生成的必要上下文",
    risk: "若略過，模型可能產生空泛或衝突內容",
    format: "建議用 2-5 句，包含可量化條件"
  }));
}
