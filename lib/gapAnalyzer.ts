export type GapQuestion = { key: string; question: string; reason: string; risk: string; formatHint: string };

export function analyzePlanningGap(payload: any): GapQuestion[] {
  const q: GapQuestion[] = [];
  const antagonist = payload?.characters?.find?.((c: any) => c.role?.includes("對手") || c.role?.includes("反派"));
  if (!antagonist?.desire) {
    q.push({
      key: "antagonist_goal",
      question: "你的反派/對手最終想達成什麼，為什麼現在就要行動？",
      reason: "對手目標是衝突引擎。",
      risk: "沒有明確對手目標，劇情容易流於事件堆疊且張力不足。",
      formatHint: "請用 1-2 句描述『目標 + 時限/壓力』。"
    });
  }
  if (!payload?.limitation_and_cost?.length || payload.limitation_and_cost.length < 3) {
    q.push({
      key: "rule_cost",
      question: "世界規則的代價與限制有哪些？至少補足 3 條。",
      reason: "代價決定戲劇性與可信度。",
      risk: "若無代價，能力系統會失衡且削弱危機感。",
      formatHint: "每條用「規則 → 代價/限制」格式。"
    });
  }
  const protagonist = payload?.characters?.find?.((c: any) => c.role?.includes("主角"));
  if (protagonist && protagonist.flaw && protagonist.arc_end && protagonist.arc_end.includes(protagonist.flaw)) {
    q.push({
      key: "arc_mismatch",
      question: "主角缺陷如何被克服？請具體描述轉折事件與行為改變。",
      reason: "角色弧需可觀察的改變。",
      risk: "缺陷與成長弧不一致，讀者會覺得角色沒有成長。",
      formatHint: "請用「起點缺陷→關鍵事件→終點行為」一句話。"
    });
  }
  const hooks = payload?.commercial_paywall_hooks ?? [];
  if (!hooks.length || hooks.some((h: any) => !h.chapter || !h.event)) {
    q.push({
      key: "paywall_hook",
      question: "請補上付費鉤子的章號與具體事件（至少 2 個）。",
      reason: "商業節奏需要可落地的章節節點。",
      risk: "若缺少章號和事件，後續章節規劃難以對齊變現節點。",
      formatHint: "格式：第X章｜事件｜鉤子一句話。"
    });
  }
  if (!payload?.taboo?.length || payload.taboo.length < 5 || payload.taboo.some((t: string) => t.length < 2)) {
    q.push({
      key: "taboo",
      question: "禁忌清單目前不足或過於含糊，請補滿至少 5 條可執行規範。",
      reason: "禁忌是風格邊界與品牌一致性保障。",
      risk: "若禁忌模糊，生成內容可能踩雷並偏離目標讀者。",
      formatHint: "每條以「避免…，改用…」描述。"
    });
  }
  return q.slice(0, 3);
}
