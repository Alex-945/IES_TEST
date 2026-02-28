const STAGES = ["PLANNING", "BIBLE", "OUTLINE", "CHAPTER_PLAN", "DRAFT", "QA", "EXPORT"];
const STORAGE_KEY = "novelWorkbenchLite.v1";

let folderHandle = null;
let state = loadState();

const $ = (id) => document.getElementById(id);
const projectListEl = $("projectList");
const workspaceEl = $("workspace");

init();

function init() {
  $("createProjectBtn").addEventListener("click", createProject);
  $("pickFolderBtn").addEventListener("click", pickFolder);
  $("exportBtn").addEventListener("click", exportCurrentProject);
  $("importBtn").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", importProjectJson);
  $("saveApiBtn").addEventListener("click", saveApiConfig);
  $("testApiBtn").addEventListener("click", testApiConnection);
  renderApiConfig();
  renderProjectList();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { projects: [], activeProjectId: null, api: defaultApiConfig() };
    return hydrateState(JSON.parse(raw));
  } catch {
    return { projects: [], activeProjectId: null, api: defaultApiConfig() };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createProject() {
  const title = $("projectName").value.trim();
  if (!title) return alert("請輸入專案名稱");

  const id = crypto.randomUUID();
  const project = {
    id,
    title,
    stage: "PLANNING",
    createdAt: new Date().toISOString(),
    stages: Object.fromEntries(STAGES.map((s) => [s, { versions: [], currentText: "{}", questionAnswers: {} }]))
  };

  project.stages.PLANNING.currentText = JSON.stringify(defaultPlanning(), null, 2);

  state.projects.unshift(project);
  state.activeProjectId = id;
  $("projectName").value = "";
  saveState();
  renderProjectList();
  renderWorkspace();
}

function renderProjectList() {
  projectListEl.innerHTML = "";
  state.projects.forEach((p) => {
    const li = document.createElement("li");
    li.className = p.id === state.activeProjectId ? "active" : "";
    li.innerHTML = `<strong>${escapeHtml(p.title)}</strong><br><small>${p.stage}</small>`;
    li.addEventListener("click", () => {
      state.activeProjectId = p.id;
      saveState();
      renderProjectList();
      renderWorkspace();
    });
    projectListEl.appendChild(li);
  });

  if (state.activeProjectId) renderWorkspace();
}

function renderWorkspace() {
  const project = currentProject();
  if (!project) {
    workspaceEl.innerHTML = '<div class="empty">先建立或選擇一個專案</div>';
    return;
  }

  workspaceEl.innerHTML = "";
  const tpl = $("workspaceTpl").content.cloneNode(true);
  workspaceEl.appendChild(tpl);

  $("wProjectTitle").textContent = project.title;
  refreshFolderStatus();

  const nav = $("stageNav");
  STAGES.forEach((stage) => {
    const btn = document.createElement("button");
    btn.textContent = stage;
    if (stage === project.stage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      project.stage = stage;
      saveState();
      renderWorkspace();
    });
    nav.appendChild(btn);
  });

  const stageData = project.stages[project.stage];
  const stageObj = safeJson(stageData.currentText || "{}");

  renderSummaryGapAndQuestions(project);
  renderHistory(project);
  renderStageEditor(project, stageObj);

  $("saveStageBtn").addEventListener("click", () => {
    saveVersion(project);
    renderHistory(project);
  });

  $("nextStageBtn").addEventListener("click", () => {
    const idx = STAGES.indexOf(project.stage);
    project.stage = STAGES[Math.min(idx + 1, STAGES.length - 1)];
    saveState();
    renderProjectList();
    renderWorkspace();
  });

  $("runQaBtn").addEventListener("click", () => {
    runQaDraft(project);
    renderWorkspace();
  });
}

function renderSummaryGapAndQuestions(project) {
  const stageText = project.stages[project.stage].currentText || "{}";
  const json = safeJson(stageText);
  const stageStore = project.stages[project.stage];
  stageStore.questionAnswers = stageStore.questionAnswers || {};

  $("summaryBox").textContent = buildHumanSummary(project.stage, json);

  const gaps = buildGaps(project.stage, json);
  const gapList = $("gapList");
  gapList.innerHTML = "";
  gaps.forEach((g) => {
    const li = document.createElement("li");
    li.textContent = g;
    gapList.appendChild(li);
  });

  const qWrap = $("questionList");
  qWrap.innerHTML = "";
  gaps.slice(0, 3).forEach((g, i) => {
    const q = document.createElement("div");
    q.className = "q";
    const key = `${project.stage}::${g}`;
    const example = buildQuestionExample(project.stage, g);
    q.innerHTML = `<strong>Q${i + 1}：請補充 ${escapeHtml(g)}</strong>
      <div>為何要問：確保下一階段有足夠上下文。</div>
      <div>不答風險：可能產生設定衝突或內容空泛。</div>
      <div>建議格式：2-5句，最好包含可量化限制。</div>
      <div class="q-example"><strong>範例回答：</strong>${escapeHtml(example)}</div>`;
    const answer = document.createElement("textarea");
    answer.placeholder = "請在這裡直接作答（會自動儲存）";
    answer.value = stageStore.questionAnswers[key] || "";
    answer.addEventListener("input", () => {
      stageStore.questionAnswers[key] = answer.value;
      saveState();
      $("summaryBox").textContent = buildHumanSummary(project.stage, json);
    });
    q.appendChild(answer);
    qWrap.appendChild(q);
  });
}

function renderHistory(project) {
  const historyEl = $("historyList");
  historyEl.innerHTML = "";
  const items = project.stages[project.stage].versions || [];
  if (!items.length) {
    historyEl.innerHTML = "<li>尚無版本</li>";
    return;
  }

  items.slice().reverse().forEach((v) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>v${v.version}</strong> <small>${new Date(v.createdAt).toLocaleString()}</small>`;
    li.addEventListener("click", () => {
      project.stages[project.stage].currentText = v.text;
      project.stages[project.stage].questionAnswers = { ...(v.answers || {}) };
      saveState();
      renderWorkspace();
    });
    historyEl.appendChild(li);
  });
}

function saveVersion(project) {
  const stage = project.stage;
  const target = project.stages[stage];
  target.questionAnswers = target.questionAnswers || {};
  const next = (target.versions.at(-1)?.version || 0) + 1;
  target.versions.push({
    version: next,
    text: target.currentText,
    createdAt: new Date().toISOString(),
    answers: { ...target.questionAnswers }
  });
  saveState();
}

function runQaDraft(project) {
  const draft = safeJson(project.stages.DRAFT.currentText);
  const bible = safeJson(project.stages.BIBLE.currentText);

  const qa = {
    scores: {
      consistency: calcScore(draft, ["world", "rule", "角色"]),
      motivation: calcScore(draft, ["想要", "動機", "fear"]),
      pacing: calcScore(draft, ["衝突", "轉折", "章尾"]),
      hook: calcScore(draft, ["鉤子", "懸念", "下一章"])
    },
    issues: [
      "檢查世界規則是否與 Bible hard_rules 衝突",
      "檢查人物決策是否有前置動機",
      "檢查段落是否重複",
      "檢查章尾鉤子是否明確"
    ],
    must_keep_rules: bible?.world_rules?.hard_rules || [],
    rewrite_brief: "重寫時保留 hard_rules，不改世界底層規則，補強章尾鉤子與動機遞進。"
  };

  project.stages.QA.currentText = JSON.stringify(qa, null, 2);
  project.stage = "QA";
  saveVersion(project);
  saveState();
}

function renderStageEditor(project, stageObj) {
  const editorForm = $("editorForm");
  editorForm.innerHTML = "";
  const stage = project.stage;

  if (stage === "PLANNING") {
    const planning = normalizePlanning(stageObj);
    editorForm.appendChild(makePlanningForm(planning, (nextObj) => {
      project.stages.PLANNING.currentText = JSON.stringify(nextObj);
      saveState();
      renderSummaryGapAndQuestions(project);
    }));
    return;
  }

  const wrap = document.createElement("div");
  const ta = document.createElement("textarea");
  ta.placeholder = "請輸入本階段內容（非程式碼）";
  ta.value = pickPlainText(stageObj);
  ta.addEventListener("input", () => {
    const next = { content: ta.value.trim() };
    project.stages[stage].currentText = JSON.stringify(next);
    saveState();
    renderSummaryGapAndQuestions(project);
  });
  wrap.appendChild(ta);
  editorForm.appendChild(wrap);
}

function makePlanningForm(planning, onChange) {
  const form = document.createElement("div");
  form.className = "planning-form";
  const groups = [
    ["A 市場與格式", planning.market_format],
    ["B 核心賣點", planning.core_selling_points],
    ["C 世界觀硬規則", planning.world_rules],
    ["E 情節節點", planning.plot_nodes],
    ["F 風格約束", planning.style_constraints]
  ];

  groups.forEach(([title, obj]) => {
    const card = document.createElement("div");
    card.className = "card";
    const h = document.createElement("h4");
    h.textContent = title;
    card.appendChild(h);
    Object.keys(obj).forEach((k) => {
      const row = document.createElement("div");
      row.style.marginBottom = "8px";
      const label = document.createElement("label");
      label.textContent = k;
      label.style.display = "block";
      label.style.marginBottom = "4px";
      const input = document.createElement("input");
      input.value = Array.isArray(obj[k]) ? obj[k].join(" | ") : String(obj[k] ?? "");
      input.addEventListener("input", () => {
        obj[k] = input.value.includes("|")
          ? input.value.split("|").map((x) => x.trim()).filter(Boolean)
          : smartValue(input.value);
        onChange(planning);
      });
      row.appendChild(label);
      row.appendChild(input);
      card.appendChild(row);
    });
    form.appendChild(card);
  });

  const charCard = document.createElement("div");
  charCard.className = "card";
  const ch = document.createElement("h4");
  ch.textContent = "D 角色（主角/對手/盟友）";
  charCard.appendChild(ch);
  planning.characters.forEach((c, idx) => {
    const sec = document.createElement("div");
    sec.style.border = "1px solid #d6deeb";
    sec.style.borderRadius = "8px";
    sec.style.padding = "8px";
    sec.style.marginBottom = "8px";
    const t = document.createElement("strong");
    t.textContent = `${c.role || "角色"} #${idx + 1}`;
    sec.appendChild(t);
    ["name", "age", "desire", "flaw", "fear", "skill", "weakness", "bottom_line", "arc_start", "arc_end", "relationship_map"].forEach((k) => {
      const row = document.createElement("div");
      row.style.marginTop = "6px";
      const label = document.createElement("label");
      label.textContent = k;
      label.style.display = "block";
      const input = document.createElement("input");
      input.value = String(c[k] ?? "");
      input.addEventListener("input", () => {
        c[k] = input.value;
        onChange(planning);
      });
      row.appendChild(label);
      row.appendChild(input);
      sec.appendChild(row);
    });
    charCard.appendChild(sec);
  });
  form.appendChild(charCard);
  return form;
}

function normalizePlanning(obj) {
  const base = defaultPlanning();
  const src = (obj && typeof obj === "object") ? obj : {};
  return {
    market_format: { ...base.market_format, ...(src.market_format || {}) },
    core_selling_points: { ...base.core_selling_points, ...(src.core_selling_points || {}) },
    world_rules: { ...base.world_rules, ...(src.world_rules || {}) },
    characters: Array.isArray(src.characters) && src.characters.length >= 3 ? src.characters : base.characters,
    plot_nodes: { ...base.plot_nodes, ...(src.plot_nodes || {}) },
    style_constraints: { ...base.style_constraints, ...(src.style_constraints || {}) }
  };
}

function pickPlainText(obj) {
  if (!obj || typeof obj !== "object") return "";
  if (typeof obj.content === "string") return obj.content;
  return buildHumanSummary("GENERIC", obj);
}

function buildHumanSummary(stage, json) {
  if (!json || typeof json !== "object") return "尚無內容";
  const lines = [];
  const project = currentProject();
  const answerCount = project ? countAnswered(project.stages[project.stage]?.questionAnswers || {}) : 0;
  if (stage === "PLANNING") {
    const m = json.market_format || {};
    const c = json.core_selling_points || {};
    const w = json.world_rules || {};
    lines.push(`題材：${m.genre || "-"} / ${m.subgenre || "-"}`);
    lines.push(`受眾：${m.target_audience_age || "-"}，平台：${m.platform || "-"}`);
    lines.push(`總字數目標：${m.total_word_target || "-"}`);
    lines.push(`Logline：${c.logline || "-"}`);
    lines.push(`Hooks 數量：${Array.isArray(c.hooks) ? c.hooks.length : 0}`);
    lines.push(`Hard Rules 數量：${Array.isArray(w.hard_rules) ? w.hard_rules.length : 0}`);
    lines.push(`角色數量：${Array.isArray(json.characters) ? json.characters.length : 0}`);
    lines.push(`追問已回答：${answerCount} 題`);
    return lines.join("\n");
  }
  flattenObject(json, "", lines);
  lines.unshift(`追問已回答：${answerCount} 題`);
  return lines.slice(0, 30).join("\n") || "尚無內容";
}

function flattenObject(value, prefix, out) {
  if (value == null) return;
  if (typeof value !== "object") {
    out.push(`${prefix}: ${String(value)}`);
    return;
  }
  if (Array.isArray(value)) {
    if (!value.length) out.push(`${prefix}: (空)`);
    value.forEach((v, i) => flattenObject(v, `${prefix}[${i + 1}]`, out));
    return;
  }
  Object.entries(value).forEach(([k, v]) => {
    const next = prefix ? `${prefix}.${k}` : k;
    flattenObject(v, next, out);
  });
}

function smartValue(v) {
  const t = String(v).trim();
  if (t === "") return "";
  if (!Number.isNaN(Number(t)) && t !== "") return Number(t);
  return t;
}

function buildGaps(stage, json) {
  if (!json || typeof json !== "object") return ["內容不是有效 JSON"];

  if (stage === "PLANNING") {
    const needed = ["market_format", "core_selling_points", "world_rules", "characters", "plot_nodes", "style_constraints"];
    const gaps = needed.filter((k) => !json[k]).map((k) => `缺少 ${k}`);
    return gaps.length ? gaps : ["無明顯缺口"];
  }
  if (stage === "BIBLE") {
    const gaps = [];
    if (!json.world_rules) gaps.push("缺少 world_rules");
    if (!Array.isArray(json.characters) || json.characters.length < 3) gaps.push("characters 少於 3 人");
    return gaps.length ? gaps : ["無明顯缺口"];
  }
  if (stage === "OUTLINE") {
    if (!Array.isArray(json.acts) || json.acts.length < 3) return ["acts 至少需要 3 幕"];
    return ["無明顯缺口"];
  }
  if (stage === "CHAPTER_PLAN") {
    if (!Array.isArray(json.chapters) || json.chapters.length < 1) return ["尚未建立章節卡"];
    return ["無明顯缺口"];
  }
  if (stage === "DRAFT") {
    return String(json).length < 100 ? ["草稿內容偏少"] : ["可進行 QA"];
  }
  if (stage === "QA") return ["可依建議重寫，且禁止改動 hard_rules"];
  return ["可導出 Markdown / TXT"];
}

function defaultPlanning() {
  return {
    market_format: {
      genre: "",
      subgenre: "",
      target_audience_age: "",
      platform: "",
      total_word_target: 100000,
      chapters_target: 50,
      chapter_word_target: 2000,
      pov: "",
      tense: "",
      pacing_style: ""
    },
    core_selling_points: {
      logline: "",
      hooks: ["", "", ""],
      taboo: ["", "", "", "", ""],
      tone_keywords: ["", "", "", "", ""]
    },
    world_rules: {
      time_period: "",
      location: "",
      society_system: "",
      tech_or_magic_system: "",
      hard_rules: ["", "", "", "", ""],
      limitation_and_cost: ["", "", ""],
      realism_level: ""
    },
    characters: [
      { role: "主角", name: "", desire: "", flaw: "", arc_start: "", arc_end: "" },
      { role: "對手", name: "", desire: "", flaw: "", arc_start: "", arc_end: "" },
      { role: "盟友", name: "", desire: "", flaw: "", arc_start: "", arc_end: "" }
    ],
    plot_nodes: {
      opening_scene_requirement: "",
      inciting_incident: "",
      midpoint_reversal: "",
      climax: "",
      ending_type: "",
      commercial_paywall_hooks: [{ chapterNo: 1, event: "" }, { chapterNo: 2, event: "" }]
    },
    style_constraints: {
      style_do: "",
      style_dont: "",
      dialogue_ratio: "50%",
      description_ratio: "50%",
      forbidden_tropes: ""
    }
  };
}

async function pickFolder() {
  if (!window.showDirectoryPicker) {
    alert("你的瀏覽器不支援資料夾寫入 API，將改用下載檔案方式。建議使用最新版 Chrome/Edge。");
    return;
  }

  try {
    folderHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    refreshFolderStatus();
  } catch {
    // ignore
  }
}

function refreshFolderStatus() {
  const el = $("folderStatus");
  if (!el) return;
  el.textContent = folderHandle ? `已綁定：${folderHandle.name}` : "未綁定資料夾";
}

async function exportCurrentProject() {
  const project = currentProject();
  if (!project) return alert("請先選擇專案");

  const payload = JSON.stringify(project, null, 2);
  const filename = `${slug(project.title)}.json`;

  if (folderHandle) {
    try {
      const dataDir = await ensureSubdir(folderHandle, "data");
      const exportDir = await ensureSubdir(dataDir, "exports");
      const fileHandle = await exportDir.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(payload);
      await writable.close();
      alert(`已寫入 ${folderHandle.name}/data/exports/${filename}`);
      return;
    } catch (err) {
      console.error(err);
      alert("寫入資料夾失敗，改用下載方式。");
    }
  }

  downloadText(filename, payload, "application/json");
}

function importProjectJson(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result));
      if (!imported.id || !imported.stages) throw new Error("格式錯誤");
      imported.id = crypto.randomUUID();
      imported.title = `${imported.title || "Imported"} (import)`;
      imported.stages = normalizeStages(imported.stages || {});
      state.projects.unshift(imported);
      state.activeProjectId = imported.id;
      saveState();
      renderProjectList();
      renderWorkspace();
      alert("匯入成功");
    } catch {
      alert("匯入失敗：JSON 格式不正確");
    }
    e.target.value = "";
  };
  reader.readAsText(file, "utf-8");
}

function defaultApiConfig() {
  return {
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-chat",
    apiKey: ""
  };
}

function hydrateState(input) {
  const next = input && typeof input === "object" ? input : {};
  const projects = Array.isArray(next.projects) ? next.projects : [];
  return {
    projects: projects.map((p) => ({
      ...p,
      stages: normalizeStages(p.stages || {})
    })),
    activeProjectId: next.activeProjectId || null,
    api: { ...defaultApiConfig(), ...(next.api || {}) }
  };
}

function normalizeStages(stages) {
  const result = {};
  STAGES.forEach((s) => {
    const src = stages[s] || {};
    result[s] = {
      versions: Array.isArray(src.versions) ? src.versions : [],
      currentText: typeof src.currentText === "string" ? src.currentText : "{}",
      questionAnswers: src.questionAnswers && typeof src.questionAnswers === "object" ? src.questionAnswers : {}
    };
  });
  return result;
}

function buildQuestionExample(stage, gap) {
  if (stage === "PLANNING" && gap.includes("world_rules")) {
    return "例如：魔法每天只能施放 2 次，每次需消耗 1 枚記憶碎片，超過會失憶 24 小時。";
  }
  if (stage === "BIBLE" && gap.includes("characters")) {
    return "例如：主角林岑（28）目標是救回妹妹，弱點是恐水，對手是前隊長遲航。";
  }
  if (stage === "OUTLINE") {
    return "例如：第一幕導火線=港口爆炸；第二幕反轉=反派其實是未來主角；第三幕高潮=引擎決戰。";
  }
  if (stage === "CHAPTER_PLAN") {
    return "例如：第12章目標=揭露內鬼，章尾鉤子=盟友留下血字訊息『別相信林岑』。";
  }
  if (stage === "DRAFT") {
    return "例如：本章新增兩次衝突、一次情感反轉，最後一句留下懸念讓讀者想追下一章。";
  }
  return "例如：回答請包含人物、事件、限制條件三部分，並盡量量化。";
}

function countAnswered(answers) {
  return Object.values(answers).filter((v) => String(v || "").trim()).length;
}

function renderApiConfig() {
  $("apiBaseUrl").value = state.api?.baseUrl || "";
  $("apiModel").value = state.api?.model || "";
  $("apiKey").value = state.api?.apiKey || "";
  setApiStatus("尚未測試");
}

function saveApiConfig() {
  state.api = {
    baseUrl: $("apiBaseUrl").value.trim(),
    model: $("apiModel").value.trim(),
    apiKey: $("apiKey").value.trim()
  };
  saveState();
  setApiStatus("已儲存");
}

async function testApiConnection() {
  saveApiConfig();
  const { baseUrl, apiKey } = state.api;
  if (!baseUrl || !apiKey) {
    setApiStatus("請先填 Base URL 與 API Key");
    return;
  }
  setApiStatus("測試中...");
  try {
    const resp = await fetch(`${baseUrl.replace(/\/$/, "")}/models`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    setApiStatus(resp.ok ? "連線成功" : `連線失敗 (${resp.status})`);
  } catch {
    setApiStatus("連線失敗（可能被公司網路或 CORS 限制）");
  }
}

function setApiStatus(text) {
  const el = $("apiStatus");
  if (el) el.textContent = text;
}

async function ensureSubdir(parent, name) {
  return parent.getDirectoryHandle(name, { create: true });
}

function currentProject() {
  return state.projects.find((p) => p.id === state.activeProjectId) || null;
}

function safeJson(text) {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return { _error: "JSON 格式錯誤", raw: String(text).slice(0, 500) };
  }
}

function calcScore(obj, hints) {
  const txt = JSON.stringify(obj || {});
  let hit = 0;
  hints.forEach((h) => {
    if (txt.includes(h)) hit += 1;
  });
  return Math.min(100, 60 + hit * 10);
}

function downloadText(name, text, type) {
  const blob = new Blob([text], { type: type || "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function slug(s) {
  return String(s).trim().replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 50) || "project";
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
