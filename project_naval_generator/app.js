const STAGES = ["PLANNING", "BIBLE", "OUTLINE", "CHAPTER_PLAN", "DRAFT", "QA", "EXPORT"];
const STORAGE_KEY = "novelWorkbenchLite.v1";

const FIELD_META = {
  market_format: {
    genre: { label: "題材 / Genre", example: "例 Example: 都市奇幻 Urban Fantasy" },
    subgenre: { label: "子題材 / Subgenre", example: "例 Example: 懸疑成長 Mystery Growth" },
    target_audience_age: { label: "目標年齡 / Target Audience Age", example: "例 Example: 18-35" },
    platform: { label: "發表平台 / Platform", example: "例 Example: 起點、Webnovel" },
    total_word_target: { label: "總字數目標 / Total Word Target", example: "例 Example: 120000" },
    chapters_target: { label: "目標章數 / Chapters Target", example: "例 Example: 60" },
    chapter_word_target: { label: "單章字數 / Chapter Word Target", example: "例 Example: 2200" },
    pov: { label: "視角 / POV", example: "例 Example: 第一人稱 First-person" },
    tense: { label: "時態 / Tense", example: "例 Example: 過去式 Past tense" },
    pacing_style: { label: "節奏風格 / Pacing Style", example: "例 Example: 快節奏 Fast-paced" }
  },
  core_selling_points: {
    logline: { label: "一句話賣點 / Logline", example: "例 Example: 失憶潛航員是潮汐引擎唯一鑰匙。" },
    hooks: { label: "鉤子 / Hooks", example: "例 Example: 倒數收尾 | 記憶重寫 | 反派是未來自己" },
    taboo: { label: "禁忌 / Taboo", example: "例 Example: 不降智 | 不拖戲 | 不硬拗" },
    tone_keywords: { label: "語氣關鍵字 / Tone Keywords", example: "例 Example: 冷冽 | 緊繃 | 黑色幽默" }
  },
  world_rules: {
    time_period: { label: "時代 / Time Period", example: "例 Example: 近未來 2090" },
    location: { label: "地點 / Location", example: "例 Example: 東亞沿海巨型港城" },
    society_system: { label: "社會制度 / Society System", example: "例 Example: 企業邦聯 + 半自治區" },
    tech_or_magic_system: { label: "科技或魔法系統 / Tech or Magic System", example: "例 Example: 潮汐引擎改寫局部因果" },
    hard_rules: { label: "硬規則 / Hard Rules", example: "例 Example: 每次最多90秒 | 每週最多改寫1次" },
    limitation_and_cost: { label: "限制與代價 / Limitation and Cost", example: "例 Example: 啟動會失去記憶 | 需稀有冷卻介質" },
    realism_level: { label: "寫實程度 / Realism Level", example: "例 Example: 中高 Medium-high" }
  },
  plot_nodes: {
    opening_scene_requirement: { label: "開場要求 / Opening Scene Requirement", example: "例 Example: 1頁內出現異常事件" },
    inciting_incident: { label: "導火線事件 / Inciting Incident", example: "例 Example: 港口爆炸案" },
    midpoint_reversal: { label: "中段反轉 / Midpoint Reversal", example: "例 Example: 反派其實是未來主角" },
    climax: { label: "高潮 / Climax", example: "例 Example: 引擎核心決戰" },
    ending_type: { label: "結局類型 / Ending Type", example: "例 Example: 苦甜結局 Bittersweet" },
    commercial_paywall_hooks: { label: "商業付費鉤子 / Paywall Hooks", example: "例 Example: 第10章真相揭露 | 第20章盟友背叛" }
  },
  style_constraints: {
    style_do: { label: "應做風格 / Style Do", example: "例 Example: 短句、強衝突" },
    style_dont: { label: "避免風格 / Style Don't", example: "例 Example: 說教、流水帳" },
    dialogue_ratio: { label: "對話比例 / Dialogue Ratio", example: "例 Example: 55%" },
    description_ratio: { label: "描寫比例 / Description Ratio", example: "例 Example: 45%" },
    forbidden_tropes: { label: "禁止套路 / Forbidden Tropes", example: "例 Example: 天降神力、失憶洗白" }
  },
  characters: {
    name: { label: "姓名 / Name", example: "例 Example: 林岑 Lin Cen" },
    age: { label: "年齡 / Age", example: "例 Example: 28" },
    desire: { label: "慾望目標 / Desire", example: "例 Example: 找回妹妹" },
    flaw: { label: "缺陷 / Flaw", example: "例 Example: 過度控制" },
    fear: { label: "恐懼 / Fear", example: "例 Example: 深海恐懼" },
    skill: { label: "技能 / Skill", example: "例 Example: 壓力艙維修" },
    weakness: { label: "弱點 / Weakness", example: "例 Example: 易暈船" },
    bottom_line: { label: "底線 / Bottom Line", example: "例 Example: 不傷害平民" },
    arc_start: { label: "弧線起點 / Arc Start", example: "例 Example: 逃避責任" },
    arc_end: { label: "弧線終點 / Arc End", example: "例 Example: 主動承擔" },
    relationship_map: { label: "關係圖 / Relationship Map", example: "例 Example: 與遲航敵對、與蘇羽互信" }
  }
};

const PHASES = ["STRATEGY", "PILOT", "PRODUCTION", "QA", "EXPORT"];
const STAGE_GUIDE = {
  STRATEGY: "策略層：PLANNING+BIBLE+OUTLINE 同頁完成，確認故事基礎。",
  PILOT: "試寫層：先產生一章試寫，確認語氣與風格是否合適。",
  PRODUCTION: "執行層：CHAPTER_PLAN + DRAFT 批量生成並修訂。",
  QA: "品管層：檢查衝突、動機、重複與節奏，輸出修訂建議。",
  EXPORT: "交付層：導出備份與發布格式（TXT/MD/JSON）。"
};
const NON_GUESSABLE_FIELDS = [
  { key: "plot_nodes.ending_type", label: "結局類型 / ending_type", note: "例：HE/BE/開放式/苦甜" },
  { key: "core_selling_points.taboo", label: "禁忌清單 / taboo", note: "至少 5 條，例：不失憶洗白" },
  { key: "plot_nodes.commercial_paywall_hooks", label: "章尾付費鉤子 / commercial_paywall_hooks", note: "至少 2 個章節鉤子" },
  { key: "core_selling_points.tone_keywords", label: "語氣關鍵詞 / tone_keywords", note: "至少 5 個，例：冷峻、壓迫" },
  { key: "style_constraints.forbidden_tropes", label: "禁用套路 / forbidden_tropes", note: "例：天降神力、全靠巧合" }
];
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
  $("toggleDebugBtn").addEventListener("click", toggleDebugMode);
  $("exportDebugBtn").addEventListener("click", exportDebugPack);
  $("clearDebugBtn").addEventListener("click", clearDebugLog);
  $("forceUnlockBtn").addEventListener("click", forceUnlockActiveProject);
  $("refreshDebugBtn").addEventListener("click", renderDebugViewer);
  $("copyDebugBtn").addEventListener("click", copyDebugViewer);
  $("importFile").addEventListener("change", importProjectJson);
  $("saveApiBtn").addEventListener("click", saveApiConfig);
  $("testApiBtn").addEventListener("click", testApiConnection);
  window.addEventListener("error", (event) => {
    pushDebugLog("window.error", {
      message: event?.message || "unknown",
      filename: event?.filename || "",
      lineno: event?.lineno || 0,
      colno: event?.colno || 0
    }, "err");
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event?.reason;
    pushDebugLog("window.unhandledrejection", {
      reason: typeof reason === "string" ? reason : String(reason?.message || reason || "unknown")
    }, "err");
  });
  recoverStaleBusyTasks();
  renderApiConfig();
  renderDebugStatus();
  pushDebugLog("app.init", { ok: true });
  renderDebugViewer();
  renderProjectList();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { projects: [], activeProjectId: null, api: defaultApiConfig(), debug: defaultDebugConfig() };
    return hydrateState(JSON.parse(raw));
  } catch {
    return { projects: [], activeProjectId: null, api: defaultApiConfig(), debug: defaultDebugConfig() };
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
    phase: "STRATEGY",
    entryMode: "auto",
    authorConfirm: {},
    authorDrafts: {},
    authorInputs: {},
    autoFillHints: "",
    intakeLevel: "未輸入",
    phaseEdit: { STRATEGY: true, PILOT: false, PRODUCTION: false, QA: false, EXPORT: false },
    production: { chapterPlanConfirmed: false, dissatisfaction: "", strategyFeedback: "", draftStatus: "待命", draftErrorCode: "", targetChapterNo: 1 },
    runtime: { busy: false, task: "", taskId: "", startedAt: "" },
    readinessLog: [],
    chatHistory: [
      {
        role: "ai",
        content: "先用一句話說你的故事點子。我會一步步引導，並幫你整理成 Planning 模板。"
      }
    ],
    locks: { "world_rules.hard_rules": true },
    tasksCollapsed: true,
    createdAt: new Date().toISOString(),
    stages: Object.fromEntries(STAGES.map((s) => [s, { versions: [], currentText: "{}", questionAnswers: {}, questionFeedback: {} }]))
  };

  project.stages.PLANNING.currentText = JSON.stringify(defaultPlanning(), null, 2);

  state.projects.unshift(project);
  state.activeProjectId = id;
  $("projectName").value = "";
  saveState();
  renderProjectList();
  renderWorkspace();
  showToast(`已建立專案：${title}`, "ok");
  pushOpLog(project, `建立專案：${title}`);
}

function renderProjectList() {
  projectListEl.innerHTML = "";
  state.projects.forEach((p) => {
    const li = document.createElement("li");
    li.className = p.id === state.activeProjectId ? "active" : "";
    li.innerHTML = `<div class="project-row"><strong>${escapeHtml(p.title)}</strong><button class="project-del" data-id="${p.id}">刪除</button></div><small>${p.stage}</small>`;
    li.addEventListener("click", () => {
      state.activeProjectId = p.id;
      saveState();
      renderProjectList();
      renderWorkspace();
    });
    li.querySelector(".project-del")?.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteProjectById(p.id);
    });
    projectListEl.appendChild(li);
  });

  if (state.activeProjectId) renderWorkspace();
}

function deleteProjectById(projectId) {
  const target = state.projects.find((p) => p.id === projectId);
  if (!target) return;
  const ok = confirm(`確定刪除專案「${target.title}」？此動作無法復原。`);
  if (!ok) return;
  const oldTitle = target.title;
  state.projects = state.projects.filter((p) => p.id !== projectId);
  if (state.activeProjectId === projectId) {
    state.activeProjectId = state.projects[0]?.id || null;
  }
  saveState();
  renderProjectList();
  renderWorkspace();
  showToast(`已刪除專案：${oldTitle}`, "warn");
}

function renderWorkspace() {
  const project = currentProject();
  if (!project) {
    workspaceEl.innerHTML = '<div class="empty">先建立或選擇一個專案</div>';
    return;
  }
  ensureProjectDefaults(project);

  workspaceEl.innerHTML = "";
  const tpl = $("workspaceTpl").content.cloneNode(true);
  workspaceEl.appendChild(tpl);

  $("wProjectTitle").textContent = project.title;
  refreshFolderStatus();

  renderStageGuide(project);

  project.stage = stageFromPhase(project.phase, project.stage);
  const stageData = project.stages[project.stage];
  const stageObj = safeJson(stageData.currentText || "{}");

  renderEntryExperience(project);
  renderScoresAndLocks(project, stageObj);
  renderPhaseWorkspace(project);
  setProjectBusyUI(project, !!project.runtime?.busy, project.runtime?.task || "");
  renderDebugViewer();
}

function renderEntryExperience(project) {
  const autoPane = $("autoPane");
  const taskBody = $("taskBody");
  const toggleTasksBtn = $("toggleTasksBtn");
  const beginnerPane = $("beginnerPane");
  const advancedPane = $("advancedPane");
  project.entryMode = "smart";
  if (autoPane) autoPane.classList.remove("hidden");
  if (beginnerPane) beginnerPane.classList.add("hidden");
  if (advancedPane) advancedPane.classList.add("hidden");
  $("autoGenerateBtn").addEventListener("click", () => handleAutoGenerate(project));
  $("autoFillGapsBtn").addEventListener("click", () => handleAutoFillGaps(project, $("autoFillGapsBtn")));
  const hintsInput = $("autoFillHintsInput");
  if (hintsInput) {
    hintsInput.value = project.autoFillHints || "";
    hintsInput.addEventListener("input", () => {
      project.autoFillHints = hintsInput.value;
      saveState();
    });
  }
  renderAutoAnalysis(project);
  renderIntakeLevel(project, $("autoIdeaInput")?.value || "");
  $("autoIdeaInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAutoGenerate(project);
    }
  });
  $("autoIdeaInput").addEventListener("input", () => {
    const val = $("autoIdeaInput")?.value || "";
    renderIntakeLevel(project, val);
  });
  if (taskBody && toggleTasksBtn) {
    taskBody.classList.toggle("hidden", !!project.tasksCollapsed);
    toggleTasksBtn.textContent = project.tasksCollapsed ? "展開" : "收合";
    toggleTasksBtn.addEventListener("click", () => {
      project.tasksCollapsed = !project.tasksCollapsed;
      saveState();
      taskBody.classList.toggle("hidden", !!project.tasksCollapsed);
      toggleTasksBtn.textContent = project.tasksCollapsed ? "展開" : "收合";
    });
  }
  renderSummaryGapAndQuestions(project);
}

function renderPhaseWorkspace(project) {
  const container = $("phaseWorkspace");
  const title = $("phaseTitle");
  if (!container || !title) return;
  container.innerHTML = "";
  title.textContent = `工作區 / ${project.phase}`;

  if (project.phase === "STRATEGY") {
    const card = document.createElement("div");
    card.className = "card";
    const planning = normalizePlanning(safeJson(project.stages.PLANNING.currentText || "{}"));
    const phaseGuide = document.createElement("div");
    phaseGuide.className = "risk-detail";
    phaseGuide.innerHTML = "<strong>你現在要做什麼</strong><div>完成策略層（PLANNING/BIBLE/OUTLINE）並達到就緒條件。</div><strong>按鈕順序</strong><div>1. 開始編輯 2. 補齊缺口/作者確認 3. 策略確認進入 PILOT</div>";
    card.appendChild(phaseGuide);

    if (!project.phaseEdit.STRATEGY) {
      const preview = document.createElement("pre");
      preview.className = "debug-pre";
      preview.textContent = buildHumanSummary("PLANNING", planning);
      card.appendChild(preview);
      const viewActions = document.createElement("div");
      viewActions.className = "actions";
      const editBtn = document.createElement("button");
      editBtn.className = "btn";
      editBtn.textContent = "開始編輯";
      editBtn.addEventListener("click", () => {
        project.phaseEdit.STRATEGY = true;
        saveState();
        renderWorkspace();
      });
      const toPilotView = document.createElement("button");
      toPilotView.className = "btn secondary";
      toPilotView.textContent = "策略確認，進入 PILOT";
      toPilotView.addEventListener("click", () => {
        const readiness = getReadiness(project, planning);
        if (!readiness.ready) {
          alert(`尚未就緒：\n- ${readiness.reasons.join("\n- ")}`);
          return;
        }
        project.phaseEdit.STRATEGY = false;
        project.phase = "PILOT";
        saveState();
        renderWorkspace();
      });
      viewActions.appendChild(editBtn);
      viewActions.appendChild(toPilotView);
      card.appendChild(viewActions);
      container.appendChild(card);
      return;
    }

    const planningWrap = document.createElement("div");
    planningWrap.innerHTML = "<h4>PLANNING</h4>";
    planningWrap.appendChild(makePlanningForm(project, planning, (nextObj) => {
      project.stages.PLANNING.currentText = JSON.stringify(nextObj);
      saveState();
      const scores = evaluateScores(project, nextObj);
      renderScoresAndLocks(project, nextObj);
      renderSummaryGapAndQuestions(project);
      pushOpLog(project, `更新 PLANNING（Coverage ${scores.coverage}）`);
    }));
    card.appendChild(planningWrap);

    const bible = document.createElement("div");
    bible.innerHTML = "<h4>BIBLE</h4>";
    const bibleTa = document.createElement("textarea");
    bibleTa.value = JSON.stringify(safeJson(project.stages.BIBLE.currentText || "{}"), null, 2);
    bibleTa.addEventListener("input", () => {
      project.stages.BIBLE.currentText = bibleTa.value;
      saveState();
    });
    bible.appendChild(bibleTa);
    card.appendChild(bible);

    const outline = document.createElement("div");
    outline.innerHTML = "<h4>OUTLINE</h4>";
    const outlineTa = document.createElement("textarea");
    outlineTa.value = JSON.stringify(safeJson(project.stages.OUTLINE.currentText || "{}"), null, 2);
    outlineTa.addEventListener("input", () => {
      project.stages.OUTLINE.currentText = outlineTa.value;
      saveState();
    });
    outline.appendChild(outlineTa);
    card.appendChild(outline);

    const actions = document.createElement("div");
    actions.className = "actions";
    const doneEdit = document.createElement("button");
    doneEdit.className = "btn secondary";
    doneEdit.textContent = "完成編輯（鎖定本頁）";
    doneEdit.addEventListener("click", () => {
      project.phaseEdit.STRATEGY = false;
      saveState();
      renderWorkspace();
    });
    const toPilot = document.createElement("button");
    toPilot.className = "btn";
    toPilot.textContent = "策略確認，進入 PILOT";
    toPilot.addEventListener("click", () => {
      const readiness = getReadiness(project, planning);
      if (!readiness.ready) {
        alert(`尚未就緒：\n- ${readiness.reasons.join("\n- ")}\n\n請先按「補齊至可進下一階段」或完成「作者必確認」項目。`);
        return;
      }
      project.phase = "PILOT";
      saveState();
      renderWorkspace();
    });
    actions.appendChild(doneEdit);
    actions.appendChild(toPilot);
    card.appendChild(actions);
    container.appendChild(card);
    return;
  }

  if (project.phase === "PILOT") {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = "<h4>試寫章 / Pilot Chapter</h4><div class=\"risk-detail\"><strong>你現在要做什麼</strong><div>先完成一章試寫，確認語氣與風格是否符合預期。</div></div>";
    if (!project.phaseEdit.PILOT) {
      const pv = document.createElement("pre");
      pv.className = "debug-pre";
      pv.textContent = (project.pilot.text || "").slice(0, 1200) || "尚無試寫內容";
      card.appendChild(pv);
      const va = document.createElement("div");
      va.className = "actions";
      const editBtn = document.createElement("button");
      editBtn.className = "btn";
      editBtn.textContent = "開始編輯";
      editBtn.addEventListener("click", () => {
        project.phaseEdit.PILOT = true;
        saveState();
        renderWorkspace();
      });
      const toProd = document.createElement("button");
      toProd.className = "btn secondary";
      toProd.textContent = "進入 PRODUCTION";
      toProd.addEventListener("click", () => {
        project.phaseEdit.PILOT = false;
        project.phase = "PRODUCTION";
        saveState();
        renderWorkspace();
      });
      va.appendChild(editBtn);
      va.appendChild(toProd);
      card.appendChild(va);
      container.appendChild(card);
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = project.pilot.text || "";
    ta.placeholder = "先生成或貼上試寫章，確認語氣與風格";
    ta.addEventListener("input", () => {
      project.pilot.text = ta.value;
      saveState();
    });
    const btns = document.createElement("div");
    btns.className = "actions";
    const gen = document.createElement("button");
    gen.className = "btn secondary";
    gen.textContent = "AI 生成試寫章";
    gen.addEventListener("click", async () => {
      await withProjectTask(project, "PILOT 生成試寫章", async () => {
        const idea = (safeJson(project.stages.PLANNING.currentText || "{}")?.core_selling_points?.logline || "試寫章").toString();
        const text = await callLLMText(`請根據此 logline 生成 800-1200 字試寫章：${idea}`, 0.8, false, 45000);
        project.pilot.text = text || `【本地試寫】${idea}`;
        saveState();
        renderWorkspace();
      });
    });
    const ok = document.createElement("button");
    ok.className = "btn";
    ok.textContent = "確認語氣，進入 PRODUCTION";
    ok.addEventListener("click", () => {
      project.phaseEdit.PILOT = false;
      project.phase = "PRODUCTION";
      saveState();
      renderWorkspace();
    });
    const doneEdit = document.createElement("button");
    doneEdit.className = "btn secondary";
    doneEdit.textContent = "完成編輯（鎖定本頁）";
    doneEdit.addEventListener("click", () => {
      project.phaseEdit.PILOT = false;
      saveState();
      renderWorkspace();
    });
    btns.appendChild(doneEdit);
    btns.appendChild(gen);
    btns.appendChild(ok);
    card.appendChild(ta);
    card.appendChild(btns);
    container.appendChild(card);
    return;
  }

  if (project.phase === "PRODUCTION") {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = "<h4>CHAPTER_PLAN + DRAFT</h4><div class=\"risk-detail\"><strong>你現在要做什麼</strong><div>先產生章節計畫並確認，再生成草稿。若不滿意可回策略層修正。</div><strong>按鈕順序</strong><div>1. AI 生成章節計畫 2. 我確認章節卡 3. AI 生成草稿 4. 進入 QA</div></div>";
    const cpSummary = summarizeChapterPlan(project.stages.CHAPTER_PLAN.currentText || "");
    const draftSummary = (pickPlainText(safeJson(project.stages.DRAFT.currentText || "{}")) || "").slice(0, 320);
    if (!project.phaseEdit.PRODUCTION) {
      const pv = document.createElement("pre");
      pv.className = "debug-pre";
      pv.textContent = `章節卡摘要：${cpSummary}\n\n草稿摘要：${draftSummary || "尚無草稿"}`;
      card.appendChild(pv);
      const va = document.createElement("div");
      va.className = "actions";
      const editBtn = document.createElement("button");
      editBtn.className = "btn";
      editBtn.textContent = "開始編輯";
      editBtn.addEventListener("click", () => {
        project.phaseEdit.PRODUCTION = true;
        saveState();
        renderWorkspace();
      });
      const toQaView = document.createElement("button");
      toQaView.className = "btn secondary";
      toQaView.textContent = "進入 QA";
      toQaView.addEventListener("click", () => {
        project.phaseEdit.PRODUCTION = false;
        project.phase = "QA";
        saveState();
        renderWorkspace();
      });
      va.appendChild(editBtn);
      va.appendChild(toQaView);
      card.appendChild(va);
      container.appendChild(card);
      return;
    }
    const cp = document.createElement("textarea");
    cp.value = project.stages.CHAPTER_PLAN.currentText || "{\"chapters\":[]}";
    cp.placeholder = "章節計畫 JSON";
    cp.addEventListener("input", () => {
      project.stages.CHAPTER_PLAN.currentText = cp.value;
      saveState();
    });
    const dr = document.createElement("textarea");
    dr.value = pickPlainText(safeJson(project.stages.DRAFT.currentText || "{}"));
    dr.placeholder = "章節草稿";
    dr.addEventListener("input", () => {
      project.stages.DRAFT.currentText = JSON.stringify({ content: dr.value });
      saveState();
    });
    const actions = document.createElement("div");
    actions.className = "actions";
    const genPlan = document.createElement("button");
    genPlan.className = "btn secondary";
    genPlan.textContent = "1) AI 生成章節計畫";
    genPlan.addEventListener("click", async () => {
      await withProjectTask(project, "PRODUCTION 生成章節計畫", async () => {
        const outline = project.stages.OUTLINE.currentText || "{}";
        const text = await callLLMText(`請根據 outline 生成 chapter plan JSON: ${outline}`, 0.5, true, 45000);
        project.stages.CHAPTER_PLAN.currentText = text || cp.value;
        project.production.chapterPlanConfirmed = false;
        saveState();
        renderWorkspace();
      });
    });
    const confirmPlan = document.createElement("button");
    confirmPlan.className = "btn secondary";
    confirmPlan.textContent = project.production.chapterPlanConfirmed ? "2) 已確認章節卡" : "2) 我確認章節卡";
    confirmPlan.addEventListener("click", () => {
      const ok = summarizeChapterPlan(project.stages.CHAPTER_PLAN.currentText || "") !== "尚無章節計畫";
      if (!ok) {
        showToast("請先生成或填寫章節計畫", "warn");
        return;
      }
      project.production.chapterPlanConfirmed = true;
      saveState();
      renderWorkspace();
      showToast("已確認章節卡，可生成草稿", "ok");
    });
    const chapterPickerWrap = document.createElement("label");
    chapterPickerWrap.className = "tag";
    chapterPickerWrap.textContent = "目標章節：";
    const chapterPicker = document.createElement("input");
    chapterPicker.type = "number";
    chapterPicker.min = "1";
    chapterPicker.step = "1";
    chapterPicker.value = String(project.production.targetChapterNo || 1);
    chapterPicker.style.width = "72px";
    chapterPicker.style.marginLeft = "6px";
    chapterPicker.addEventListener("input", () => {
      const n = Math.max(1, Number(chapterPicker.value || 1));
      project.production.targetChapterNo = n;
      saveState();
    });
    chapterPickerWrap.appendChild(chapterPicker);
    const genDraft = document.createElement("button");
    genDraft.className = "btn secondary";
    genDraft.textContent = "3) AI 生成草稿";
    genDraft.disabled = !project.production.chapterPlanConfirmed;
    const draftStatus = document.createElement("span");
    draftStatus.className = "tag";
    draftStatus.textContent = `草稿狀態：${project.production.draftStatus || "待命"}`;
    genDraft.addEventListener("click", async () => {
      if (!project.production.chapterPlanConfirmed) {
        showToast("請先確認章節卡", "warn");
        return;
      }
      await withProjectTask(project, "PRODUCTION 生成草稿", async () => {
        const chapterNo = Math.max(1, Number(project.production.targetChapterNo || 1));
        const card = extractChapterCard(project.stages.CHAPTER_PLAN.currentText || "{}", chapterNo);
        if (!card) {
          project.production.draftErrorCode = "short";
          project.production.draftStatus = "失敗（章節卡格式無法解析）";
          saveState();
          showToast("章節計畫格式無法解析，請先確認章節計畫", "err");
          return;
        }
        project.production.draftStatus = "生成中（第 1/2 次）";
        project.production.draftErrorCode = "";
        draftStatus.textContent = `草稿狀態：${project.production.draftStatus}`;
        pushDebugLog("draft.status", { status: project.production.draftStatus, chapterNo });
        saveState();
        const prompt = buildDraftPrompt({
          chapterCard: card,
          strategyBrief: buildStrategyBrief(project),
          constraints: { minWords: 800, maxWords: 1400 }
        });
        let first = await callLLMWithMeta(prompt, 0.8, false, 90000);
        let text = first.content;
        let errorCode = first.errorCode || "";
        if (!isValidDraftText(text)) {
          project.production.draftStatus = "重試中（第 2/2 次）";
          pushDebugLog("draft.status", { status: project.production.draftStatus, chapterNo });
          draftStatus.textContent = `草稿狀態：${project.production.draftStatus}`;
          saveState();
          const second = await callLLMWithMeta(prompt, 0.8, false, 120000);
          text = second.content;
          errorCode = second.errorCode || errorCode || "";
        }
        if (!isValidDraftText(text)) {
          project.production.draftErrorCode = errorCode || "short";
          const reasonMap = {
            timeout: "失敗（timeout）",
            network: "失敗（network failed）",
            short: "失敗（empty or short）"
          };
          project.production.draftStatus = reasonMap[project.production.draftErrorCode] || "失敗（empty or short）";
          draftStatus.textContent = `草稿狀態：${project.production.draftStatus}`;
          pushDebugLog("draft.status", { status: project.production.draftStatus, errorCode: project.production.draftErrorCode, chapterNo }, "err");
          pushDebugLog("draft.generate.failed", { reason: "empty_or_short_after_retry", errorCode: project.production.draftErrorCode, chapterNo }, "err");
          saveState();
          showToast("草稿生成失敗：請重試或檢查 API/網路", "err");
          return;
        }
        project.stages.DRAFT.currentText = JSON.stringify({ content: String(text).trim() });
        project.production.draftErrorCode = "";
        project.production.draftStatus = `完成（${String(text).trim().length} 字）`;
        draftStatus.textContent = `草稿狀態：${project.production.draftStatus}`;
        pushDebugLog("draft.status", { status: project.production.draftStatus, chapterNo });
        saveState();
        renderWorkspace();
      });
    });
    const backWrap = document.createElement("div");
    backWrap.className = "risk-detail";
    backWrap.innerHTML = "<strong>不滿意回策略層</strong><div>請填寫不滿意點，AI 會提示該改哪些策略欄位並可一鍵跳回。</div>";
    const dissatisfaction = document.createElement("textarea");
    dissatisfaction.placeholder = "例：語氣太平、主角動機薄弱、世界規則存在矛盾";
    dissatisfaction.value = project.production.dissatisfaction || "";
    dissatisfaction.addEventListener("input", () => {
      project.production.dissatisfaction = dissatisfaction.value;
      saveState();
    });
    const feedbackBox = document.createElement("pre");
    feedbackBox.className = "debug-pre";
    feedbackBox.textContent = project.production.strategyFeedback || "尚未分析。";
    const analyzeBackBtn = document.createElement("button");
    analyzeBackBtn.className = "btn secondary";
    analyzeBackBtn.textContent = "AI 分析不滿意點";
    analyzeBackBtn.addEventListener("click", async () => {
      await withProjectTask(project, "PRODUCTION 反饋分析", async () => {
        const fb = await buildStrategyFeedback(project, project.production.dissatisfaction || "", project.stages.CHAPTER_PLAN.currentText || "{}", project.stages.DRAFT.currentText || "{}");
        project.production.strategyFeedback = fb;
        saveState();
        renderWorkspace();
      });
    });
    const jumpBackBtn = document.createElement("button");
    jumpBackBtn.className = "btn secondary";
    jumpBackBtn.textContent = "回策略層修正";
    jumpBackBtn.addEventListener("click", () => {
      project.phaseEdit.PRODUCTION = false;
      project.phase = "STRATEGY";
      project.phaseEdit.STRATEGY = true;
      saveState();
      renderWorkspace();
      showToast("已跳回策略層，請依分析建議修正", "warn");
    });
    const toQa = document.createElement("button");
    toQa.className = "btn";
    toQa.textContent = "4) 進入 QA";
    toQa.addEventListener("click", () => {
      const draftText = pickPlainText(safeJson(project.stages.DRAFT.currentText || "{}"));
      if (!isValidDraftText(draftText)) {
        showToast("尚無有效草稿，請縮小章節卡範圍或重試", "warn");
        return;
      }
      project.phaseEdit.PRODUCTION = false;
      project.phase = "QA";
      saveState();
      renderWorkspace();
    });
    const doneEdit = document.createElement("button");
    doneEdit.className = "btn secondary";
    doneEdit.textContent = "完成編輯（鎖定本頁）";
    doneEdit.addEventListener("click", () => {
      project.phaseEdit.PRODUCTION = false;
      saveState();
      renderWorkspace();
    });
    actions.appendChild(genPlan);
    actions.appendChild(confirmPlan);
    actions.appendChild(chapterPickerWrap);
    actions.appendChild(genDraft);
    actions.appendChild(draftStatus);
    actions.appendChild(doneEdit);
    actions.appendChild(toQa);
    card.appendChild(cp);
    card.appendChild(dr);
    backWrap.appendChild(dissatisfaction);
    backWrap.appendChild(feedbackBox);
    const ba = document.createElement("div");
    ba.className = "actions";
    ba.appendChild(analyzeBackBtn);
    ba.appendChild(jumpBackBtn);
    backWrap.appendChild(ba);
    card.appendChild(actions);
    card.appendChild(backWrap);
    container.appendChild(card);
    return;
  }

  if (project.phase === "QA") {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = "<h4>QA 報告</h4><div class=\"risk-detail\"><strong>你現在要做什麼</strong><div>檢查衝突與節奏，確認修訂建議後再交付。</div></div>";
    if (!project.phaseEdit.QA) {
      const pv = document.createElement("pre");
      pv.className = "debug-pre";
      pv.textContent = (pickPlainText(safeJson(project.stages.QA.currentText || "{}")) || "尚無 QA 建議").slice(0, 1600);
      card.appendChild(pv);
      const va = document.createElement("div");
      va.className = "actions";
      const editBtn = document.createElement("button");
      editBtn.className = "btn";
      editBtn.textContent = "開始編輯";
      editBtn.addEventListener("click", () => {
        project.phaseEdit.QA = true;
        saveState();
        renderWorkspace();
      });
      const toExportView = document.createElement("button");
      toExportView.className = "btn secondary";
      toExportView.textContent = "進入 EXPORT";
      toExportView.addEventListener("click", () => {
        project.phaseEdit.QA = false;
        project.phase = "EXPORT";
        saveState();
        renderWorkspace();
      });
      va.appendChild(editBtn);
      va.appendChild(toExportView);
      card.appendChild(va);
      container.appendChild(card);
      return;
    }
    const qaTa = document.createElement("textarea");
    qaTa.value = pickPlainText(safeJson(project.stages.QA.currentText || "{}"));
    qaTa.placeholder = "QA 結果";
    qaTa.addEventListener("input", () => {
      project.stages.QA.currentText = JSON.stringify({ content: qaTa.value });
      saveState();
    });
    const actions = document.createElement("div");
    actions.className = "actions";
    const run = document.createElement("button");
    run.className = "btn secondary";
    run.textContent = "AI 產生 QA 建議";
    run.addEventListener("click", async () => {
      await withProjectTask(project, "QA 生成建議", async () => {
        await runQaDraft(project);
        renderWorkspace();
      });
    });
    const toExport = document.createElement("button");
    toExport.className = "btn";
    toExport.textContent = "進入 EXPORT";
    toExport.addEventListener("click", () => {
      project.phaseEdit.QA = false;
      project.phase = "EXPORT";
      saveState();
      renderWorkspace();
    });
    const doneEdit = document.createElement("button");
    doneEdit.className = "btn secondary";
    doneEdit.textContent = "完成編輯（鎖定本頁）";
    doneEdit.addEventListener("click", () => {
      project.phaseEdit.QA = false;
      saveState();
      renderWorkspace();
    });
    actions.appendChild(run);
    actions.appendChild(doneEdit);
    actions.appendChild(toExport);
    card.appendChild(qaTa);
    card.appendChild(actions);
    container.appendChild(card);
    return;
  }

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = "<h4>EXPORT</h4><div class=\"risk-detail\"><strong>你現在要做什麼</strong><div>導出備份與發布格式。</div></div>";
  if (!project.phaseEdit.EXPORT) {
    const va = document.createElement("div");
    va.className = "actions";
    const editBtn = document.createElement("button");
    editBtn.className = "btn";
    editBtn.textContent = "開始編輯";
    editBtn.addEventListener("click", () => {
      project.phaseEdit.EXPORT = true;
      saveState();
      renderWorkspace();
    });
    va.appendChild(editBtn);
    card.appendChild(va);
    container.appendChild(card);
    return;
  }
  const actions = document.createElement("div");
  actions.className = "actions";
  const expJson = document.createElement("button");
  expJson.className = "btn secondary";
  expJson.textContent = "導出專案 JSON";
  expJson.addEventListener("click", () => exportCurrentProject());
  const expTxt = document.createElement("button");
  expTxt.className = "btn";
  expTxt.textContent = "導出草稿 TXT";
  expTxt.addEventListener("click", () => {
    const txt = pickPlainText(safeJson(project.stages.DRAFT.currentText || "{}"));
    downloadText(`${slug(project.title)}_draft.txt`, txt, "text/plain");
    showToast("已導出 TXT", "ok");
  });
  const doneEdit = document.createElement("button");
  doneEdit.className = "btn secondary";
  doneEdit.textContent = "完成編輯（鎖定本頁）";
  doneEdit.addEventListener("click", () => {
    project.phaseEdit.EXPORT = false;
    saveState();
    renderWorkspace();
  });
  actions.appendChild(expJson);
  actions.appendChild(expTxt);
  actions.appendChild(doneEdit);
  card.appendChild(actions);
  container.appendChild(card);
}

function summarizeChapterPlan(raw) {
  const parsed = safeJson(raw || "{}");
  if (parsed._error) return "尚無章節計畫";
  if (Array.isArray(parsed.chapters) && parsed.chapters.length) {
    const first = parsed.chapters[0];
    return `共 ${parsed.chapters.length} 章，首章：${first?.title || "未命名"}`;
  }
  const text = String(raw || "").trim();
  if (!text) return "尚無章節計畫";
  return `已有章節計畫文字（${text.length} 字）`;
}

function isValidDraftText(text) {
  const t = String(text || "").trim();
  if (!t) return false;
  if (t.includes("【本地草稿】")) return false;
  return t.length >= 500;
}

function buildStrategyBrief(project) {
  const p = normalizePlanning(safeJson(project.stages.PLANNING.currentText || "{}"));
  const hardRules = (p.world_rules.hard_rules || []).map((x) => String(x || "").trim()).filter(Boolean).slice(0, 3);
  return {
    logline: p.core_selling_points.logline || "",
    styleDo: p.style_constraints.style_do || "",
    hardRules
  };
}

function extractChapterCard(chapterPlanRaw, chapterNo = 1) {
  const parsed = safeJson(chapterPlanRaw || "{}");
  let items = [];
  if (!parsed._error) {
    items = collectChapterItems(parsed);
  }
  const target = items.find((it) => Number(it.chapterNo) === Number(chapterNo))
    || items[0]
    || null;
  if (target) return target;
  const raw = String(chapterPlanRaw || "");
  if (!raw.trim()) return null;
  return {
    chapterNo: chapterNo,
    title: `第${chapterNo}章`,
    summary: previewText(raw, 900),
    source: "text_fallback"
  };
}

function collectChapterItems(value, out = []) {
  if (Array.isArray(value)) {
    value.forEach((v) => collectChapterItems(v, out));
    return out;
  }
  if (!value || typeof value !== "object") return out;
  const chapterNo = Number(value.chapter_number || value.chapterNo || value.no || value.number || 0);
  const title = String(value.title || value.name || "").trim();
  const summary = String(value.summary || value.desc || value.description || value.goal || "").trim();
  if ((chapterNo > 0 || title || summary) && (title || summary)) {
    out.push({
      chapterNo: chapterNo > 0 ? chapterNo : out.length + 1,
      title: title || `第${out.length + 1}章`,
      summary: summary || "",
      source: "json"
    });
  }
  Object.values(value).forEach((v) => collectChapterItems(v, out));
  return out;
}

function buildDraftPrompt({ chapterCard, strategyBrief, constraints }) {
  const minWords = Number(constraints?.minWords || 800);
  const maxWords = Number(constraints?.maxWords || 1400);
  const rules = (strategyBrief?.hardRules || []).map((x, i) => `${i + 1}. ${x}`).join("\n") || "（無）";
  return `你是小說代筆助手。請寫「可直接閱讀」的第一人稱/第三人稱小說正文草稿，不要輸出 JSON，不要列提綱。

目標章節：
- 章號：${chapterCard.chapterNo}
- 標題：${chapterCard.title}
- 章節摘要：${chapterCard.summary}

策略摘要：
- logline：${strategyBrief?.logline || "（無）"}
- 風格要求：${strategyBrief?.styleDo || "（無）"}
- 必守硬規則：
${rules}

輸出要求：
- 字數：${minWords}-${maxWords} 字
- 需要場景、行動、對話、衝突推進、章尾鉤子
- 僅輸出正文，不要任何前置說明`;
}

async function buildStrategyFeedback(project, dissatisfaction, chapterPlanText, draftText) {
  const issues = String(dissatisfaction || "").trim();
  const cp = summarizeChapterPlan(chapterPlanText);
  const draftPreview = pickPlainText(safeJson(draftText || "{}")).slice(0, 600);
  const local = [
    "不滿意點分析：",
    issues ? `- ${issues}` : "- （未填）請先具體描述不滿意點",
    "建議回策略層調整欄位：",
    "- core_selling_points.logline：是否聚焦核心衝突",
    "- world_rules.hard_rules：限制是否支持戲劇衝突",
    "- plot_nodes.inciting_incident / climax：推進是否足夠強",
    "- style_constraints.style_do：語氣節奏是否明確",
    `目前章節計畫：${cp}`,
    `草稿摘錄：${draftPreview || "（無）"}`
  ].join("\n");

  if (!(state.api?.apiKey || "").trim()) return local;
  const prompt = `請根據以下資訊輸出「回策略層修正建議」，格式：
1) 問題歸因（語氣/節奏/動機/世界規則）
2) 建議修改欄位（精確到 planning path）
3) 每個欄位給 1 個可直接貼上的示例

不滿意點：
${issues || "（未填）"}
章節計畫摘要：${cp}
草稿摘錄：
${draftPreview || "（無）"}
`;
  const text = await callLLMText(prompt, 0.4, false, 25000);
  return text || local;
}

async function handleConvertToPlanning(project) {
  await withProjectTask(project, "對話轉 Planning", async () => {
    const btn = $("chatToTemplateBtn");
    if (!btn) return;
    btn.disabled = true;
    btn.classList.add("busy");
    const oldText = btn.textContent;
    btn.textContent = "轉換中...";
    setActionStatus("正在把對話整理成 Planning 草稿...", "warn");
    pushOpLog(project, "開始：對話轉 Planning 草稿");
    try {
      await convertChatToPlanning(project);
      setActionStatus("已完成：對話已轉成 Planning 草稿，並已切換到 PLANNING 階段。", "ok");
      pushOpLog(project, "完成：對話轉 Planning 草稿");
      showToast("轉換完成，已切換到 PLANNING", "ok");
    } catch {
      setActionStatus("轉換失敗：請檢查 API 設定或稍後再試。", "err");
      pushOpLog(project, "失敗：對話轉 Planning 草稿");
      showToast("轉換失敗，請檢查 API 或稍後重試", "err");
    } finally {
      btn.disabled = false;
      btn.classList.remove("busy");
      btn.textContent = oldText || "把對話轉成 Planning 草稿";
    }
  });
}

async function handleAutoGenerate(project) {
  const input = $("autoIdeaInput");
  const btn = $("autoGenerateBtn");
  if (!input || !btn) return;
  const idea = input.value.trim();
  const intake = classifyIntakeText(idea);
  project.intakeLevel = intake.level;
  saveState();
  renderIntakeLevel(project, idea);
  if (!idea) {
    pushDebugLog("auto.generate.skip", { reason: "empty_idea" }, "warn");
    setAutoStatus("狀態：請先輸入故事類型與一句想法", "warn");
    showToast("請先輸入故事想法", "warn");
    return;
  }
  await withProjectTask(project, "全自動生成", async () => {
    btn.disabled = true;
    btn.classList.add("busy");
    const oldText = btn.textContent;
    btn.textContent = "首次生成中...";
    setAutoStatus("狀態：首次生成中...", "warn");
    pushDebugLog("auto.generate.start", { ideaLength: idea.length });
    pushOpLog(project, "開始：全自動生成策略層");
    try {
      const result = await smartGenerateStrategy(project, idea, intake.level);
      setAutoStatus("狀態：缺口分析中...", "warn");
      let nextPlanning = mergeWithLocks(project, normalizePlanning(result.planning));
      nextPlanning = autoPopulateNonGuessable(project, nextPlanning);
      project.stages.PLANNING.currentText = JSON.stringify(nextPlanning);
      project.stages.BIBLE.currentText = JSON.stringify(result.bible || {});
      project.stages.OUTLINE.currentText = JSON.stringify(result.outline || {});
      project.stage = "PLANNING";
      saveState();
      renderWorkspace();
      syncAuthorConfirmSuggestions(project, nextPlanning);
      const readiness = getReadiness(project, nextPlanning);
      pushDebugLog("auto.generate.done", { ready: readiness.ready, reasons: readiness.reasons });
      setAutoStatus(readiness.ready ? "狀態：完成，已可進下一階段" : "狀態：完成初稿，尚有缺口可按「補齊至可進下一階段」", readiness.ready ? "ok" : "warn");
      pushOpLog(project, "完成：全自動生成策略層");
      showToast("全自動生成完成，請先確認策略層內容", "ok");
    } catch (err) {
      pushDebugLog("auto.generate.error", { error: String(err?.message || err || "unknown") }, "err");
      setAutoStatus("狀態：生成失敗，已回退本地範例", "err");
      pushOpLog(project, "失敗：全自動生成策略層");
      showToast("生成失敗，請檢查 API 或稍後重試", "err");
    } finally {
      btn.disabled = false;
      btn.classList.remove("busy");
      btn.textContent = oldText || "一鍵自動生成";
      renderAutoAnalysis(project);
    }
  });
}

async function smartGenerateStrategy(project, inputText, intakeLevel) {
  if (intakeLevel === "完整級") {
    const parsed = parseJsonLoose(inputText);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const p = normalizePlanning(parsed.planning || parsed);
      return {
        planning: p,
        bible: parsed.bible || { world_rules: p.world_rules, characters: p.characters },
        outline: parsed.outline || { acts: [{ act: 1, summary: "" }, { act: 2, summary: "" }, { act: 3, summary: "" }] }
      };
    }
  }
  return autoGenerateStrategy(project, inputText);
}

async function handleAutoFillGaps(project, sourceBtn = null) {
  const btn = sourceBtn || $("autoFillGapsBtn") || $("readinessFillAllBtn");
  if (!project) return;
  if (btn?.disabled) return;
  const planning = normalizePlanning(safeJson(project.stages.PLANNING.currentText || "{}"));
  const readinessBefore = getReadiness(project, planning);
  pushDebugLog("auto.fill.start", {
    beforeReady: readinessBefore.ready,
    autoFillCount: (readinessBefore.autoFillItems || []).length,
    reasons: readinessBefore.reasons
  });
  if (readinessBefore.ready) {
    pushReadinessLog(project, "二次補全略過：已達可進下一階段門檻");
    showToast("已達可進下一階段門檻", "ok");
    setAutoStatus("狀態：已達標，無需補齊", "ok");
    return;
  }

  await withProjectTask(project, "二次補齊", async () => {
    if (btn) {
      btn.disabled = true;
      btn.classList.add("busy");
    }
    const oldText = btn?.textContent || "";
    if (btn) btn.textContent = "二次補全中...";
    setAutoStatus("狀態：二次補全中...", "warn");
    pushOpLog(project, "開始：二次補全缺口");
    pushReadinessLog(project, `開始二次補全：${(readinessBefore.autoFillItems || []).length} 項`);
    try {
      let next = await autoFillPlanningGaps(project, planning, readinessBefore.autoFillItems || []);
      next = autoPopulateNonGuessable(project, next);
      project.stages.PLANNING.currentText = JSON.stringify(mergeWithLocks(project, next));
      syncAuthorConfirmSuggestions(project, next);
      saveState();
      renderWorkspace();
      const readinessAfter = getReadiness(project, next);
      pushDebugLog("auto.fill.done", {
        afterReady: readinessAfter.ready,
        remainingReasons: readinessAfter.reasons
      });
      pushReadinessLog(project, readinessAfter.ready ? "二次補全完成：已達標" : `二次補全完成：仍有缺口 ${readinessAfter.reasons.join("；")}`);
      setAutoStatus(readinessAfter.ready ? "狀態：完成，已可進下一階段" : "狀態：補全完成，仍有作者必確認項目", readinessAfter.ready ? "ok" : "warn");
      showToast(readinessAfter.ready ? "補全完成，已達標" : "補全完成，請完成作者確認", readinessAfter.ready ? "ok" : "warn");
      pushOpLog(project, "完成：二次補全缺口");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove("busy");
        btn.textContent = oldText || "補齊至可進下一階段";
      }
      renderAutoAnalysis(project);
    }
  });
}

async function autoFillPlanningGaps(project, planning, items) {
  let next = normalizePlanning(planning);
  const list = Array.isArray(items) ? items : [];
  list.forEach((item) => {
    next = applyLocalGapFill(project, next, item);
  });
  const api = state.api || {};
  if (!api.apiKey || !api.baseUrl || !list.length) return next;

  const prompt = `請只補齊以下缺口欄位，禁止改動未列出欄位，輸出 planning JSON：
${list.map((i) => `- ${i.title}`).join("\n")}
作者補充想法:
${(project.autoFillHints || "（無）").slice(0, 1200)}
現有 planning:
${JSON.stringify(next)}
`;
  const text = await callLLMText(prompt, 0.3, true, 25000);
  const parsed = parseJsonLoose(text);
  if (!parsed || typeof parsed !== "object") return next;
  return normalizePlanning({ ...next, ...parsed });
}

async function autoGenerateStrategy(project, idea) {
  const api = state.api || {};
  const fallback = localAutoGenerate(idea);
  if (!api.apiKey || !api.baseUrl) return fallback;

  const prompt = `請根據以下 idea 產生小說策略層 JSON，輸出格式必須是:
{
  "planning": ${JSON.stringify(defaultPlanning())},
  "bible": {"world_rules":{},"characters":[]},
  "outline": {"acts":[{"act":1,"summary":""},{"act":2,"summary":""},{"act":3,"summary":""}]}
}
idea: ${idea}`;

  const text = await callLLMText(prompt, 0.4, true, 45000);
  const parsed = parseJsonLoose(text);
  if (!parsed || !parsed.planning) return fallback;

  return {
    planning: normalizePlanning(parsed.planning),
    bible: parsed.bible || fallback.bible,
    outline: parsed.outline || fallback.outline
  };
}

function localAutoGenerate(idea) {
  const planning = defaultPlanning();
  planning.market_format.genre = guessGenre(idea);
  planning.market_format.subgenre = "成長冒險";
  planning.market_format.platform = "網路連載";
  planning.core_selling_points.logline = `概念：${idea.slice(0, 80)}`;
  planning.core_selling_points.hooks = [
    "每章章尾留懸念",
    "主角祕密身份逐步揭露",
    "中段出現重大反轉"
  ];
  planning.world_rules.hard_rules = [
    "能力使用有次數限制",
    "每次使用都要付代價",
    "不能違反核心世界邏輯"
  ];
  planning.plot_nodes.inciting_incident = "主角被捲入不可逆事件";
  planning.plot_nodes.midpoint_reversal = "中段真相反轉";
  planning.plot_nodes.climax = "主角在巨大代價下做最終選擇";

  const bible = {
    world_rules: planning.world_rules,
    characters: planning.characters
  };
  const outline = {
    acts: [
      { act: 1, summary: "建立角色與世界，導火線事件發生。" },
      { act: 2, summary: "主角面對升級衝突，中段反轉改變目標。" },
      { act: 3, summary: "高潮決戰與代價選擇，完成主題收束。" }
    ]
  };
  return { planning, bible, outline };
}

function guessGenre(text) {
  const t = String(text || "");
  if (/奇幻|魔法|玄幻/.test(t)) return "奇幻";
  if (/懸疑|推理|兇案/.test(t)) return "懸疑";
  if (/愛情|戀|言情/.test(t)) return "言情";
  if (/科幻|太空|機器人/.test(t)) return "科幻";
  return "都市劇情";
}

function renderChatLog(project) {
  const log = $("chatLog");
  log.innerHTML = "";
  project.chatHistory.forEach((m) => {
    const row = document.createElement("div");
    row.className = `chat-msg ${m.role === "user" ? "user" : "ai"}`;
    row.innerHTML = `<strong>${m.role === "user" ? "你" : "AI 編輯"}：</strong> ${escapeHtml(m.content)}`;
    log.appendChild(row);
  });
  log.scrollTop = log.scrollHeight;
}

async function sendChat(project) {
  if (project.chatState?.busy) {
    setChatStatus(project, "狀態：AI 回覆中，請稍候...");
    return;
  }
  const input = $("chatInput");
  const msg = input.value.trim();
  if (!msg) return;
  await withProjectTask(project, "對話回覆", async () => {
    input.value = "";
    setChatBusy(project, true);
    setChatStatus(project, "狀態：已送出，AI 思考中...");
    pushOpLog(project, "送出對話訊息");
    project.chatHistory.push({ role: "user", content: msg });
    saveState();
    renderChatLog(project);

    try {
      const reply = await getCoachReply(project, msg);
      project.chatHistory.push({ role: "ai", content: reply });
      setChatStatus(project, "狀態：完成");
      pushOpLog(project, "AI 回覆完成");
      saveState();
      renderChatLog(project);
    } catch {
      project.chatHistory.push({ role: "ai", content: "目前連線異常，已切換本地建議模式。你可以稍後重試 API。" });
      setChatStatus(project, "狀態：連線失敗，已回退本地模式");
      pushOpLog(project, "AI 回覆失敗，回退本地模式");
      showToast("AI 連線失敗，已回退本地模式", "warn");
      saveState();
      renderChatLog(project);
    } finally {
      setChatBusy(project, false);
    }
  });
}

async function getCoachReply(project, userMsg) {
  const api = state.api || {};
  if (!api.apiKey || !api.baseUrl) {
    setChatStatus(project, "狀態：未設定 API，使用本地引導");
    return localCoachReply(userMsg);
  }
  const recent = project.chatHistory.slice(-6).map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`).join("\n");
  const prompt = `你是小說新手教練。請基於對話給出：1) 肯定一句 2) 下一個具體問題 3) 一個範例回答。請簡短。\n\n${recent}`;
  const text = await callLLMText(prompt, 0.5, false, 25000);
  if (!text) {
    setChatStatus(project, "狀態：API 無回應，已使用本地建議");
    return localCoachReply(userMsg);
  }
  return text;
}

function localCoachReply(userMsg) {
  if (userMsg.includes("奇幻")) {
    return "很棒，題材已明確。下一步：請決定世界最不能被破壞的3條規則。範例：魔法每天最多2次、代價是失去一段記憶。";
  }
  if (userMsg.includes("角色") || userMsg.includes("主角")) {
    return "方向很好。下一步：幫主角補一個會拖累他的弱點。範例：主角擅長推理，但在高壓下會短暫失語。";
  }
  return "收到你的想法。下一步：用一句話寫故事核心衝突。範例：失憶潛航員必須在七天內找回記憶，否則城市防線將崩潰。";
}

async function convertChatToPlanning(project) {
  const conversation = project.chatHistory.map((m) => `${m.role}: ${m.content}`).join("\n");
  const fallback = defaultPlanning();
  const lastUser = [...project.chatHistory].reverse().find((x) => x.role === "user");
  fallback.core_selling_points.logline = `概念草稿：${(lastUser?.content || "").slice(0, 60)}`;

  const api = state.api || {};
  if (!api.apiKey || !api.baseUrl) {
    const mergedLocal = mergeWithLocks(project, normalizePlanning(fallback));
    project.stages.PLANNING.currentText = JSON.stringify(mergedLocal);
    project.stage = "PLANNING";
    saveState();
    renderWorkspace();
    setActionStatus("未設定 API，已用本地規則生成 Planning 草稿。", "warn");
    return;
  }

  const prompt = `請把以下對話整理為小說 Planning JSON，鍵結構必須符合模板：${JSON.stringify(defaultPlanning())}\n\n對話:\n${conversation}`;
  const text = await callLLMText(prompt, 0.3, true);
  const parsed = safeJson(text);
  const merged = mergeWithLocks(project, normalizePlanning(parsed._error ? fallback : parsed));
  project.stages.PLANNING.currentText = JSON.stringify(merged);
  project.stage = "PLANNING";
  saveState();
  renderWorkspace();
}

function importTemplateFile(project, e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    $("advancedPaste").value = String(reader.result || "");
    pushOpLog(project, "匯入模板檔到貼上區");
    showToast("模板檔已載入貼上區", "ok");
  };
  reader.readAsText(file, "utf-8");
  e.target.value = "";
}

function applyAdvancedTemplate(project) {
  const raw = $("advancedPaste").value.trim();
  if (!raw) return alert("請先貼上模板內容");
  const parsed = safeJson(raw);
  if (parsed._error) return alert("模板 JSON 格式錯誤");
  const merged = mergeWithLocks(project, normalizePlanning(parsed));
  project.stages.PLANNING.currentText = JSON.stringify(merged);
  project.stage = "PLANNING";
  saveState();
  renderWorkspace();
  pushOpLog(project, "套用進階模板到 Planning");
  showToast("已套用模板到 PLANNING", "ok");
}

function renderScoresAndLocks(project, stageObj) {
  const scores = evaluateScores(project, stageObj);
  $("scoreCoverage").textContent = String(scores.coverage);
  $("scoreRisk").textContent = String(scores.risk);
  $("scoreHook").textContent = String(scores.hook);
  const readiness = getReadiness(project, stageObj, scores);
  const readyEl = $("readinessStatus");
  const readyReasons = $("readinessReasons");
  const modeHint = $("readinessModeHint");
  if (readyEl) {
    readyEl.textContent = readiness.ready ? "Ready" : "Not Ready";
    readyEl.classList.remove("ready", "not-ready");
    readyEl.classList.add(readiness.ready ? "ready" : "not-ready");
  }
  if (modeHint) {
    modeHint.textContent = `Mode: ${project.entryMode || "auto"}, Required Coverage: ${readiness.requiredCoverage}`;
  }
  if (readyReasons) {
    readyReasons.innerHTML = "";
    readiness.reasons.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = r;
      readyReasons.appendChild(li);
    });
  }
  renderReadinessActions(project, readiness);
  const riskDetails = $("riskDetails");
  if (riskDetails) {
    riskDetails.innerHTML = "";
    (scores.riskDetails || ["目前未檢出高風險衝突"]).forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      riskDetails.appendChild(li);
    });
  }
  renderReadinessActionLog(project);

  const lock = $("lockHardRules");
  lock.checked = !!project.locks["world_rules.hard_rules"];
  lock.addEventListener("change", () => {
    project.locks["world_rules.hard_rules"] = lock.checked;
    saveState();
    renderWorkspace();
  });
  renderAutoAnalysis(project);
}

function getReadiness(project, stageObj, scoresInput) {
  const scores = scoresInput || evaluateScores(project, stageObj);
  if (project.stage !== "PLANNING") {
    const reasons = [];
    if (scores.coverage < 70) reasons.push(`Coverage ${scores.coverage} < 70，資訊尚不完整。`);
    if (scores.risk > 40) reasons.push(`Consistency Risk ${scores.risk} > 40，仍有衝突需先解。`);
    if (scores.hook < 60) reasons.push(`Hook Strength ${scores.hook} < 60，商業鉤子偏弱。`);
    if (!reasons.length) reasons.push("已達建議門檻，可前進下一階段。");
    return {
      ready: scores.coverage >= 70 && scores.risk <= 40 && scores.hook >= 60,
      reasons,
      requiredCoverage: 70,
      autoFillItems: [],
      mustConfirmItems: [],
      unconfirmedItems: []
    };
  }
  const requiredCoverage = project.entryMode === "auto" ? 85 : 70;
  const planning = normalizePlanning(stageObj || {});
  const mustConfirm = getAuthorConfirmStatus(project, planning);
  const autoFillItems = getAutoFillItems(project, planning, scores);
  const reasons = [];
  if (scores.coverage < requiredCoverage) reasons.push(`Coverage ${scores.coverage} < ${requiredCoverage}，資訊尚不完整。`);
  if (scores.risk > 40) reasons.push(`Consistency Risk ${scores.risk} > 40，仍有衝突需先解。`);
  if (scores.hook < 60) reasons.push(`Hook Strength ${scores.hook} < 60，商業鉤子偏弱。`);
  if (mustConfirm.unconfirmed.length) reasons.push(`尚未作者確認：${mustConfirm.unconfirmed.map((x) => x.label).join("、")}。`);
  if (!reasons.length) reasons.push("已達建議門檻，可前進下一階段。");
  return {
    ready: scores.coverage >= requiredCoverage && scores.risk <= 40 && scores.hook >= 60 && mustConfirm.unconfirmed.length === 0,
    reasons,
    requiredCoverage,
    autoFillItems,
    mustConfirmItems: mustConfirm.items,
    unconfirmedItems: mustConfirm.unconfirmed
  };
}

function renderReadinessActions(project, readiness) {
  const aiList = $("readinessAIFillList");
  const authorList = $("readinessAuthorList");
  const fillAllBtn = $("readinessFillAllBtn");
  const openConfirmBtn = $("readinessOpenConfirmBtn");
  const recheckBtn = $("readinessRecheckBtn");
  if (!aiList || !authorList) return;
  if (project.stage !== "PLANNING") {
    aiList.innerHTML = "<li>僅 PLANNING 階段提供 AI 補齊動作。</li>";
    authorList.innerHTML = "<li>僅 PLANNING 階段需要作者必確認。</li>";
    if (fillAllBtn) fillAllBtn.onclick = null;
    if (openConfirmBtn) openConfirmBtn.onclick = null;
    if (recheckBtn) recheckBtn.onclick = () => renderWorkspace();
    return;
  }
  const planning = normalizePlanning(safeJson(project.stages.PLANNING.currentText || "{}"));
  syncAuthorConfirmSuggestions(project, planning);

  aiList.innerHTML = "";
  const aiItems = readiness.autoFillItems || [];
  if (!aiItems.length) {
    const li = document.createElement("li");
    li.textContent = "目前無 AI 可補缺口。";
    aiList.appendChild(li);
  } else {
    aiItems.forEach((item, idx) => {
      const li = document.createElement("li");
      li.className = "readiness-item";
      const txt = document.createElement("span");
      txt.textContent = item.title;
      const actions = document.createElement("span");
      actions.className = "readiness-actions";
      const aiBtn = document.createElement("button");
      aiBtn.className = "btn secondary mini";
      aiBtn.textContent = "AI補這一項";
      aiBtn.addEventListener("click", async () => {
        await withProjectTask(project, `單項補齊:${item.title}`, async () => {
          const planning = normalizePlanning(safeJson(project.stages.PLANNING.currentText || "{}"));
          pushReadinessLog(project, `單項 AI 補齊：${item.title}`);
          const next = await autoFillPlanningGaps(project, planning, [item]);
          project.stages.PLANNING.currentText = JSON.stringify(mergeWithLocks(project, next));
          saveState();
          renderWorkspace();
          showToast(`已補齊：${item.title}`, "ok");
        });
      });
      const jumpBtn = document.createElement("button");
      jumpBtn.className = "btn secondary mini";
      jumpBtn.textContent = "跳到欄位";
      jumpBtn.addEventListener("click", () => {
        project.phase = "STRATEGY";
        saveState();
        renderWorkspace();
        showToast("已切回策略層，請在 PLANNING 區修改", "warn");
      });
      actions.appendChild(aiBtn);
      actions.appendChild(jumpBtn);
      li.appendChild(txt);
      li.appendChild(actions);
      aiList.appendChild(li);
    });
  }

  authorList.innerHTML = "";
  const mustItems = readiness.mustConfirmItems || [];
  mustItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "readiness-item";
    const txt = document.createElement("span");
    txt.textContent = `${item.label}（${item.done ? "已確認" : "待確認"}）`;
    const draft = document.createElement("div");
    draft.className = "readiness-note";
    draft.textContent = `AI 建議：${project.authorDrafts?.[item.key] || "尚未產生，請先按「產生建議草案」。"}`;
    const input = document.createElement("textarea");
    input.className = "readiness-input";
    input.placeholder = "作者輸入區：可直接改寫後按「套用輸入」";
    input.value = project.authorInputs?.[item.key] || "";
    input.addEventListener("input", () => {
      project.authorInputs[item.key] = input.value;
      saveState();
    });
    const actions = document.createElement("span");
    actions.className = "readiness-actions";
    const draftBtn = document.createElement("button");
    draftBtn.className = "btn secondary mini";
    draftBtn.textContent = "產生建議草案";
    draftBtn.addEventListener("click", async () => {
      await withProjectTask(project, `作者草案:${item.key}`, async () => {
        await suggestAuthorField(project, item);
      });
      renderWorkspace();
    });
    const useBtn = document.createElement("button");
    useBtn.className = "btn secondary mini";
    useBtn.textContent = "代入建議";
    useBtn.addEventListener("click", () => {
      const suggestion = project.authorDrafts?.[item.key] || "";
      if (!suggestion) {
        showToast("請先產生建議草案", "warn");
        return;
      }
      input.value = suggestion;
      project.authorInputs[item.key] = suggestion;
      saveState();
    });
    const applyBtn = document.createElement("button");
    applyBtn.className = "btn secondary mini";
    applyBtn.textContent = "套用輸入";
    applyBtn.addEventListener("click", () => {
      applyAuthorInputToField(project, item, project.authorInputs?.[item.key] || "");
      renderWorkspace();
    });
    const confirmBtn = document.createElement("button");
    confirmBtn.className = "btn mini";
    confirmBtn.textContent = "我已確認";
    confirmBtn.addEventListener("click", () => {
      confirmAuthorField(project, item);
      renderWorkspace();
    });
    actions.appendChild(draftBtn);
    actions.appendChild(useBtn);
    actions.appendChild(applyBtn);
    actions.appendChild(confirmBtn);
    li.appendChild(txt);
    li.appendChild(draft);
    li.appendChild(input);
    li.appendChild(actions);
    const hint = document.createElement("div");
    hint.className = "readiness-note";
    hint.textContent = item.note;
    li.appendChild(hint);
    authorList.appendChild(li);
  });

  if (fillAllBtn) fillAllBtn.onclick = () => handleAutoFillGaps(project, fillAllBtn);
  if (openConfirmBtn) {
    openConfirmBtn.onclick = () => {
      pushReadinessLog(project, "開啟作者確認卡");
      project.phase = "STRATEGY";
      project.tasksCollapsed = false;
      saveState();
      renderWorkspace();
      showToast("請完成作者必確認項目", "warn");
    };
  }
  if (recheckBtn) recheckBtn.onclick = () => {
    pushReadinessLog(project, "手動重新檢查 Readiness");
    renderWorkspace();
  };
}

function renderAutoAnalysis(project) {
  const box = $("autoAnalysisBox");
  if (!box) return;
  if (project.stage !== "PLANNING") {
    box.textContent = "請先切回策略層（PLANNING）查看分析。";
    return;
  }
  const planning = normalizePlanning(safeJson(project.stages.PLANNING.currentText || "{}"));
  const scores = evaluateScores(project, planning);
  const readiness = getReadiness(project, planning, scores);
  const aiItems = readiness.autoFillItems || [];
  const authorItems = readiness.unconfirmedItems || [];
  const lines = [];
  lines.push(`Coverage=${scores.coverage}, Risk=${scores.risk}, Hook=${scores.hook}`);
  lines.push(`Readiness=${readiness.ready ? "Ready" : "Not Ready"}（門檻 Coverage>=${readiness.requiredCoverage}）`);
  lines.push("");
  lines.push("AI 二次補齊建議：");
  if (!aiItems.length) lines.push("- 目前無 AI 可補欄位");
  aiItems.forEach((x) => lines.push(`- ${x.title}`));
  lines.push("");
  lines.push("作者需確認項目：");
  if (!authorItems.length) lines.push("- 無");
  authorItems.forEach((x) => lines.push(`- ${x.label}`));
  lines.push("");
  lines.push("建議流程：先按「補齊至可進下一階段」→ 再完成作者必確認。");
  box.textContent = lines.join("\n");
}

function classifyIntakeText(raw) {
  const text = String(raw || "").trim();
  if (!text) return { level: "未輸入", score: 0, advice: "請先輸入一句故事想法或貼上設定片段。" };
  let score = 0;
  if (text.length >= 20) score += 1;
  if (text.length >= 120) score += 1;
  if (/[{}[\]":]/.test(text)) score += 2;
  if (/角色|主角|對手|盟友|world|世界|規則|結局|hook|章節/i.test(text)) score += 1;
  if (/inciting|climax|midpoint|platform|genre|pov|tense/i.test(text)) score += 1;
  if (score <= 1) return { level: "想法級", score, advice: "建議先生成策略初稿，再補齊關鍵缺口。" };
  if (score <= 3) return { level: "草稿級", score, advice: "已有部分設定，建議先做缺口補齊與作者確認。" };
  return { level: "完整級", score, advice: "資訊較完整，可直接做 Readiness 檢查與確認。" };
}

function renderIntakeLevel(project, text) {
  const el = $("intakeLevel");
  if (!el) return;
  const res = classifyIntakeText(text);
  el.textContent = `判定：${res.level}（${res.advice}）`;
  project.intakeLevel = res.level;
  saveState();
}

function pushReadinessLog(project, message) {
  if (!project) return;
  if (!Array.isArray(project.readinessLog)) project.readinessLog = [];
  project.readinessLog.unshift({
    at: new Date().toISOString(),
    message: String(message || "")
  });
  project.readinessLog = project.readinessLog.slice(0, 60);
  saveState();
}

function renderReadinessActionLog(project) {
  const list = $("readinessActionLog");
  if (!list) return;
  list.innerHTML = "";
  const logs = Array.isArray(project?.readinessLog) ? project.readinessLog : [];
  if (!logs.length) {
    const li = document.createElement("li");
    li.textContent = "尚無紀錄";
    list.appendChild(li);
    return;
  }
  logs.forEach((row) => {
    const li = document.createElement("li");
    li.textContent = `${new Date(row.at).toLocaleTimeString()} - ${row.message}`;
    list.appendChild(li);
  });
}

function syncAuthorConfirmSuggestions(project, planning) {
  let changed = false;
  NON_GUESSABLE_FIELDS.forEach((item) => {
    const current = getByPath(planning, item.key);
    const text = isMeaningfulValue(current)
      ? valueToSuggestionText(item.key, current)
      : defaultSuggestionForKey(item.key);
    if (!project.authorDrafts[item.key]) {
      project.authorDrafts[item.key] = text;
      changed = true;
    }
    if (!project.authorInputs[item.key]) {
      project.authorInputs[item.key] = text;
      changed = true;
    }
  });
  if (changed) saveState();
}

function autoPopulateNonGuessable(project, planning) {
  const p = normalizePlanning(planning);
  NON_GUESSABLE_FIELDS.forEach((item) => {
    const current = getByPath(p, item.key);
    if (!isMeaningfulValue(current)) {
      setByPath(p, item.key, suggestionTextToValue(item.key, defaultSuggestionForKey(item.key)));
    }
    project.authorConfirm[item.key] = false;
  });
  return p;
}

function defaultSuggestionForKey(key) {
  if (key.endsWith("ending_type")) return "苦甜結局";
  if (key.endsWith("taboo")) return "不主角降智\n不拖戲灌水\n不天降解法\n不洗白反派\n不破壞硬規則";
  if (key.endsWith("commercial_paywall_hooks")) return "第8章：主角身份反轉\n第16章：盟友背叛";
  if (key.endsWith("tone_keywords")) return "冷峻、壓迫、緊繃、克制、黑色幽默";
  if (key.endsWith("forbidden_tropes")) return "天降神力、全靠巧合、失憶洗白";
  return "";
}

function valueToSuggestionText(key, value) {
  if (key.endsWith("commercial_paywall_hooks")) {
    return (Array.isArray(value) ? value : [])
      .map((h) => `第${Number(h?.chapterNo || 1)}章：${String(h?.event || "").trim()}`)
      .filter((x) => !x.endsWith("："))
      .join("\n");
  }
  if (Array.isArray(value)) return value.map((x) => String(x || "").trim()).filter(Boolean).join("\n");
  return String(value || "").trim();
}

function suggestionTextToValue(key, text) {
  const t = String(text || "").trim();
  if (key.endsWith("taboo") || key.endsWith("tone_keywords")) {
    return t.split(/\n|,|，|;|；|\|/).map((x) => x.trim()).filter(Boolean);
  }
  if (key.endsWith("commercial_paywall_hooks")) {
    return t.split(/\n/).map((line) => line.trim()).filter(Boolean).map((line, idx) => {
      const m = line.match(/第?\s*(\d+)\s*章?\s*[:：-]?\s*(.+)/);
      if (m) return { chapterNo: Number(m[1]), event: m[2].trim() };
      return { chapterNo: idx + 1, event: line };
    });
  }
  return t;
}

function getAuthorConfirmStatus(project, planning) {
  const items = NON_GUESSABLE_FIELDS.map((f) => {
    const value = getByPath(planning, f.key);
    const filled = isFieldReadyForConfirm(f.key, value);
    const done = !!project.authorConfirm?.[f.key];
    return { ...f, short: f.key.split(".").at(-1), filled, done };
  });
  return { items, unconfirmed: items.filter((x) => !(x.done && x.filled)) };
}

function getAutoFillItems(project, planning, scores) {
  const gaps = buildGaps("PLANNING", planning).filter((g) => g !== "無明顯缺口");
  const items = [];
  gaps.forEach((g) => {
    items.push({ title: g, gap: g });
  });
  if (scores?.hook < 60) items.push({ title: "商業鉤子偏弱，補強章尾懸念", gap: "hook_low" });
  return items.filter((it) => !isNonGuessableGap(it.gap));
}

function isNonGuessableGap(gapText) {
  const g = String(gapText || "");
  return g.includes("ending_type")
    || g.includes("taboo")
    || g.includes("commercial_paywall_hooks")
    || g.includes("tone_keywords")
    || g.includes("forbidden_tropes");
}

function applyLocalGapFill(project, planning, item) {
  const p = normalizePlanning(planning);
  const gap = String(item?.gap || item?.title || "");
  if (gap.includes("market_format.genre")) p.market_format.genre = p.market_format.genre || "都市奇幻";
  if (gap.includes("market_format.platform")) p.market_format.platform = p.market_format.platform || "網路連載";
  if (gap.includes("logline")) p.core_selling_points.logline = p.core_selling_points.logline || "主角必須在時限內完成任務，否則付出重大代價。";
  if (gap.includes("world_rules.time_period")) p.world_rules.time_period = p.world_rules.time_period || "近未來 2090";
  if (gap.includes("world_rules.location")) p.world_rules.location = p.world_rules.location || "東亞沿海巨型港城";
  if (gap.includes("hard_rules")) {
    const existing = (p.world_rules.hard_rules || []).map((x) => String(x || "").trim()).filter(Boolean);
    if (existing.length < 3) {
      p.world_rules.hard_rules = ["能力使用有次數限制", "每次使用都要付代價", "不能違反核心世界邏輯", "關鍵能力不可連續使用", "違規會造成不可逆後果"];
    }
  }
  if (gap.includes("characters")) {
    p.characters = Array.isArray(p.characters) && p.characters.length >= 3 ? p.characters : defaultPlanning().characters;
  }
  if (gap.includes("inciting_incident")) p.plot_nodes.inciting_incident = p.plot_nodes.inciting_incident || "主角被捲入不可逆事件";
  if (gap.includes("climax")) p.plot_nodes.climax = p.plot_nodes.climax || "主角在巨大代價下做最終選擇";
  if (gap.includes("style_constraints.style_do")) p.style_constraints.style_do = p.style_constraints.style_do || "短句、強衝突、章尾留懸念";
  if (gap === "hook_low") {
    if (!Array.isArray(p.core_selling_points.hooks)) p.core_selling_points.hooks = ["", "", ""];
    p.core_selling_points.hooks = ["每章章尾留懸念", "主角祕密身份逐步揭露", "中段出現重大反轉"];
    p.plot_nodes.commercial_paywall_hooks = [{ chapterNo: 8, event: "揭露第一個真相" }, { chapterNo: 16, event: "盟友反轉立場" }];
  }
  return p;
}

async function suggestAuthorField(project, item) {
  const planning = normalizePlanning(safeJson(project.stages.PLANNING.currentText || "{}"));
  let suggestion = "";
  if ((state.api?.apiKey || "").trim()) {
    const prompt = `請針對欄位 ${item.key} 提供一段可直接採用的建議，需簡短具體。故事logline：${planning.core_selling_points.logline || "-"}`;
    suggestion = await callLLMText(prompt, 0.4, false, 18000);
  }
  if (!suggestion) {
    if (item.key.endsWith("taboo")) {
      suggestion = "不主角降智\n不拖戲灌水\n不天降解法\n不洗白反派\n不破壞硬規則";
    } else if (item.key.endsWith("tone_keywords")) {
      suggestion = "冷峻、壓迫、緊繃、克制、黑色幽默";
    } else if (item.key.endsWith("commercial_paywall_hooks")) {
      suggestion = "第8章：主角身份反轉\n第16章：盟友背叛";
    } else if (item.key.endsWith("ending_type")) {
      suggestion = "苦甜結局";
    } else if (item.key.endsWith("forbidden_tropes")) {
      suggestion = "天降神力、全靠巧合、失憶洗白";
    } else {
      suggestion = item.note;
    }
  }
  project.authorDrafts[item.key] = String(suggestion || "").trim();
  if (!project.authorInputs[item.key]) {
    project.authorInputs[item.key] = project.authorDrafts[item.key];
  }
  pushReadinessLog(project, `產生作者欄位草案：${item.label}`);
  saveState();
  showToast(`已產生草案：${item.label}（請先確認再套用）`, "ok");
}

function confirmAuthorField(project, item) {
  const planning = normalizePlanning(safeJson(project.stages.PLANNING.currentText || "{}"));
  const value = getByPath(planning, item.key);
  if (!isFieldReadyForConfirm(item.key, value)) {
    showToast(`尚未填寫：${item.label}`, "warn");
    return;
  }
  project.authorConfirm[item.key] = true;
  pushReadinessLog(project, `作者已確認：${item.label}`);
  saveState();
  showToast(`已確認：${item.label}`, "ok");
}

function applyAuthorInputToField(project, item, rawText) {
  const text = String(rawText || "").trim();
  if (!text) {
    showToast("請先輸入內容再套用", "warn");
    return;
  }
  const planning = normalizePlanning(safeJson(project.stages.PLANNING.currentText || "{}"));
  setByPath(planning, item.key, suggestionTextToValue(item.key, text));
  project.stages.PLANNING.currentText = JSON.stringify(planning);
  project.authorConfirm[item.key] = false;
  pushReadinessLog(project, `作者輸入已套用：${item.label}`);
  saveState();
  showToast(`已套用：${item.label}`, "ok");
}

function getByPath(obj, path) {
  return String(path || "").split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function setByPath(obj, path, value) {
  const keys = String(path || "").split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = keys[i];
    if (!cur[k] || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
}

function isMeaningfulValue(v) {
  if (Array.isArray(v)) return v.filter((x) => String((x && x.event) || x || "").trim()).length > 0;
  return String(v || "").trim().length > 0;
}

function isFieldReadyForConfirm(path, value) {
  if (path.endsWith("taboo")) {
    return Array.isArray(value) && value.filter((x) => String(x || "").trim()).length >= 5;
  }
  if (path.endsWith("tone_keywords")) {
    return Array.isArray(value) && value.filter((x) => String(x || "").trim()).length >= 5;
  }
  if (path.endsWith("commercial_paywall_hooks")) {
    return Array.isArray(value) && value.filter((x) => String(x?.event || "").trim()).length >= 2;
  }
  return isMeaningfulValue(value);
}

function stageFromPhase(phase, fallback = "PLANNING") {
  if (phase === "STRATEGY") return "PLANNING";
  if (phase === "PILOT") return "DRAFT";
  if (phase === "PRODUCTION") return "DRAFT";
  if (phase === "QA") return "QA";
  if (phase === "EXPORT") return "EXPORT";
  return fallback;
}

function evaluateScores(project, stageObj) {
  if (project.stage !== "PLANNING") {
    const txt = pickPlainText(stageObj || {});
    const lenScore = Math.min(100, Math.floor(txt.length / 12));
    return {
      coverage: lenScore,
      risk: Math.max(0, 70 - Math.floor(lenScore / 2)),
      hook: Math.min(100, Math.floor(lenScore * 0.8)),
      riskDetails: ["非 PLANNING 階段僅提供簡化風險評估。"]
    };
  }
  const p = normalizePlanning(stageObj || {});
  const required = [
    p.market_format.genre, p.market_format.platform, p.core_selling_points.logline,
    p.world_rules.time_period, p.world_rules.location, p.plot_nodes.inciting_incident,
    p.plot_nodes.climax, p.style_constraints.style_do
  ];
  const filled = required.filter((x) => String(x || "").trim()).length;
  const coverage = Math.round((filled / required.length) * 100);

  let risk = 20;
  const riskDetails = [];
  const hardRulesText = (p.world_rules.hard_rules || []).join(" ");
  if (hardRulesText.includes("不能復活") && String(p.plot_nodes.ending_type || "").includes("復活")) {
    risk += 35;
    riskDetails.push("衝突：硬規則含「不能復活」，但結局類型提到「復活」。");
  }
  if ((p.characters || []).length < 3) {
    risk += 20;
    riskDetails.push("風險：角色少於 3 人，對手/盟友支撐不足。");
  }
  if (!String(p.core_selling_points.logline || "").trim()) {
    risk += 25;
    riskDetails.push("風險：缺少 logline，主線定位不明。");
  }
  if (!String(p.plot_nodes.inciting_incident || "").trim()) {
    risk += 15;
    riskDetails.push("風險：缺少導火線事件，故事推進動機不足。");
  }
  risk = Math.min(100, risk);

  let hook = 30;
  hook += Math.min(30, (p.core_selling_points.hooks || []).filter(Boolean).length * 8);
  hook += String(p.plot_nodes.midpoint_reversal || "").trim() ? 20 : 0;
  hook += (p.plot_nodes.commercial_paywall_hooks || []).filter((x) => String(x?.event || "").trim()).length * 10;
  hook = Math.min(100, hook);
  if (!riskDetails.length) {
    riskDetails.push("目前未檢出明顯衝突，可進入下一階段。");
  }
  return { coverage, risk, hook, riskDetails };
}

function mergeWithLocks(project, nextPlanning) {
  const next = normalizePlanning(nextPlanning || {});
  if (!project.locks["world_rules.hard_rules"]) return next;
  const current = normalizePlanning(safeJson(project.stages.PLANNING.currentText || "{}"));
  const currentRules = (current.world_rules.hard_rules || []).map((x) => String(x || "").trim()).filter(Boolean);
  if (currentRules.length >= 3) {
    next.world_rules.hard_rules = [...currentRules];
  }
  return next;
}

function renderSummaryGapAndQuestions(project) {
  const stageText = project.stages[project.stage].currentText || "{}";
  const json = safeJson(stageText);
  const stageStore = project.stages[project.stage];
  stageStore.questionAnswers = stageStore.questionAnswers || {};
  stageStore.questionFeedback = stageStore.questionFeedback || {};
  stageStore.taskCursor = Number.isFinite(stageStore.taskCursor) ? stageStore.taskCursor : 0;
  stageStore.taskFlowStarted = !!stageStore.taskFlowStarted;

  const summaryEl = $("summaryBox");
  if (summaryEl) {
    summaryEl.textContent = buildHumanSummary(project.stage, json);
  }

  const scores = evaluateScores(project, json);
  const readiness = getReadiness(project, json, scores);
  const tasks = buildTaskList(project.stage, json, scores, readiness);
  const gapList = $("gapList");
  if (gapList) {
    gapList.innerHTML = "";
    tasks.map((t) => t.title).forEach((g) => {
      const li = document.createElement("li");
      li.textContent = g;
      gapList.appendChild(li);
    });
  }

  const qWrap = $("questionList");
  qWrap.innerHTML = "";
  if (!stageStore.taskFlowStarted) {
    const tip = document.createElement("div");
    tip.className = "q";
    tip.textContent = "按「補充資料」開始一題一題補齊資訊。";
    qWrap.appendChild(tip);
    return;
  }
  if (!tasks.length) {
    const ok = document.createElement("div");
    ok.className = "q";
    ok.textContent = "目前沒有必要任務，已達可接受狀態。";
    qWrap.appendChild(ok);
    return;
  }
  const currentIdx = stageStore.taskCursor % tasks.length;
  const task = tasks[currentIdx];
  {
    const q = document.createElement("div");
    q.className = "q";
    const key = `${project.stage}::${task.title}`;
    q.innerHTML = `<strong>Task：${escapeHtml(task.title)}</strong>
      <div class="q-meta-grid">
        <div class="q-meta-item"><strong>為何要問</strong>${escapeHtml(task.why)}</div>
        <div class="q-meta-item"><strong>不答風險</strong>${escapeHtml(task.risk)}</div>
        <div class="q-meta-item"><strong>建議格式</strong>${escapeHtml(task.format)}</div>
      </div>
      <div class="q-example"><strong>AI 建議回答</strong>${escapeHtml(task.example)}</div>`;

    const actions = document.createElement("div");
    actions.className = "q-actions";
    const useBtn = document.createElement("button");
    useBtn.className = "btn secondary";
    useBtn.textContent = "代入";
    const fbBtn = document.createElement("button");
    fbBtn.className = "btn secondary";
    fbBtn.textContent = "AI反饋";
    const submitBtn = document.createElement("button");
    submitBtn.className = "btn";
    submitBtn.textContent = "提交";

    const answer = document.createElement("textarea");
    answer.placeholder = "請在這裡直接作答（自動儲存）";
    answer.value = stageStore.questionAnswers[key] || "";
    answer.addEventListener("input", () => {
      stageStore.questionAnswers[key] = answer.value;
      saveState();
      if (summaryEl) {
        summaryEl.textContent = buildHumanSummary(project.stage, json);
      }
    });
    useBtn.addEventListener("click", () => {
      answer.value = task.example;
      answer.dispatchEvent(new Event("input"));
    });
    fbBtn.addEventListener("click", async () => {
      fbBtn.disabled = true;
      fbBtn.textContent = "反饋中...";
      await requestTaskFeedback(project, key, task, answer.value);
      fbBtn.disabled = false;
      fbBtn.textContent = "AI反饋";
    });
    submitBtn.addEventListener("click", () => {
      stageStore.questionAnswers[key] = answer.value;
      stageStore.taskCursor = (stageStore.taskCursor || 0) + 1;
      saveState();
      renderSummaryGapAndQuestions(project);
      showToast("已提交，進入下一題", "ok");
      pushOpLog(project, `提交補充任務：${task.title}`);
    });
    const feedback = document.createElement("div");
    feedback.className = "q-feedback";
    feedback.textContent = stageStore.questionFeedback[key] || "AI 反饋：尚未執行。請按「AI反饋」。";
    feedback.id = `feedback-${slug(key)}`;
    actions.appendChild(useBtn);
    actions.appendChild(fbBtn);
    actions.appendChild(submitBtn);
    q.appendChild(actions);
    q.appendChild(answer);
    q.appendChild(feedback);
    qWrap.appendChild(q);
  }
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
      project.stages[project.stage].questionFeedback = { ...(v.feedback || {}) };
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
  target.questionFeedback = target.questionFeedback || {};
  const next = (target.versions.at(-1)?.version || 0) + 1;
  target.versions.push({
    version: next,
    text: target.currentText,
    createdAt: new Date().toISOString(),
    answers: { ...target.questionAnswers },
    feedback: { ...target.questionFeedback }
  });
  saveState();
}

async function runQaDraft(project) {
  const qa = await buildQaReport(project);
  project.stages.QA.currentText = JSON.stringify(qa, null, 2);
  project.phase = "QA";
  saveVersion(project);
  saveState();
}

async function buildQaReport(project) {
  const draftObj = safeJson(project.stages.DRAFT.currentText || "{}");
  const draftText = pickPlainText(draftObj);
  const bible = safeJson(project.stages.BIBLE.currentText || "{}");
  const mustKeepRules = (bible?.world_rules?.hard_rules || [])
    .map((x) => String(x || "").trim())
    .filter(Boolean);

  const localQa = buildLocalQaReport(draftObj, mustKeepRules);
  if (!draftText.trim()) {
    pushDebugLog("qa.llm.skip", { reason: "empty_draft" }, "warn");
    return localQa;
  }
  if (!(state.api?.apiKey || "").trim()) {
    pushDebugLog("qa.llm.skip", { reason: "missing_api" }, "warn");
    return localQa;
  }

  const prompt = `你是小說 QA 編輯。請嚴格輸出 JSON（不要 markdown），格式：
{
  "scores": { "consistency": 0-100, "motivation": 0-100, "pacing": 0-100, "hook": 0-100 },
  "issues": [
    { "severity":"high|medium|low", "title":"", "evidence":"引用草稿片段", "suggestion":"可執行修改建議" }
  ],
  "rewrite_brief": "重寫指令，需可直接給模型使用",
  "qa_summary": "50字內摘要"
}
規則：
1) issues 至少 4 條，需包含：世界規則衝突、動機、重複、章尾鉤子。
2) 不可建議修改以下 hard_rules：${mustKeepRules.join("；") || "（無）"}。
3) evidence 必須引用草稿中的字句（可短摘錄）。

草稿：
${draftText.slice(0, 9000)}
`;

  const text = await callLLMText(prompt, 0.3, true, 60000);
  const parsed = parseJsonLoose(text);
  if (!parsed || typeof parsed !== "object") {
    pushDebugLog("qa.llm.fallback", { reason: "parse_failed" }, "warn");
    return localQa;
  }
  const normalized = normalizeQaReport(parsed, mustKeepRules, localQa);
  pushDebugLog("qa.llm.success", {
    issues: Array.isArray(normalized.issues) ? normalized.issues.length : 0,
    scores: normalized.scores
  });
  return normalized;
}

function buildLocalQaReport(draftObj, mustKeepRules) {
  return {
    source: "local_fallback",
    scores: {
      consistency: calcScore(draftObj, ["world", "rule", "角色"]),
      motivation: calcScore(draftObj, ["想要", "動機", "fear"]),
      pacing: calcScore(draftObj, ["衝突", "轉折", "章尾"]),
      hook: calcScore(draftObj, ["鉤子", "懸念", "下一章"])
    },
    issues: [
      "high | 世界規則一致性 | 請比對草稿是否違反 Bible hard_rules | 修正違規設定或補上限制代價。",
      "medium | 人物動機前置 | 檢查重大決策前是否有情緒/事件鋪墊 | 補一段動機轉折。",
      "medium | 段落重複 | 檢查描述是否重覆同一信息 | 合併重覆段落並提升信息密度。",
      "medium | 章尾鉤子 | 檢查章尾是否存在明確懸念/反轉 | 章尾追加下一章驅動問題。"
    ],
    must_keep_rules: mustKeepRules,
    rewrite_brief: "重寫時保留 hard_rules，不改世界底層規則，補強章尾鉤子與動機遞進。",
    qa_summary: "本地 QA：已產生基礎檢查建議，建議優先確認世界規則與章尾鉤子。"
  };
}

function normalizeQaReport(parsed, mustKeepRules, fallbackQa) {
  const safeScore = (v, d = 60) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return d;
    return Math.max(0, Math.min(100, Math.round(n)));
  };
  const scores = {
    consistency: safeScore(parsed?.scores?.consistency, fallbackQa.scores.consistency),
    motivation: safeScore(parsed?.scores?.motivation, fallbackQa.scores.motivation),
    pacing: safeScore(parsed?.scores?.pacing, fallbackQa.scores.pacing),
    hook: safeScore(parsed?.scores?.hook, fallbackQa.scores.hook)
  };
  let issues = Array.isArray(parsed?.issues) ? parsed.issues : [];
  issues = issues.map((it) => {
    if (typeof it === "string") return it.trim();
    const sev = String(it?.severity || "medium").trim();
    const title = String(it?.title || "未命名問題").trim();
    const evidence = String(it?.evidence || "（無明確引用）").trim();
    const suggestion = String(it?.suggestion || "請補強此處。").trim();
    return `${sev} | ${title} | 證據:${evidence} | 建議:${suggestion}`;
  }).filter(Boolean);
  if (issues.length < 4) {
    issues = fallbackQa.issues;
  }
  const rewriteBrief = String(parsed?.rewrite_brief || "").trim() || fallbackQa.rewrite_brief;
  const qaSummary = String(parsed?.qa_summary || "").trim() || fallbackQa.qa_summary;
  return {
    source: "llm",
    scores,
    issues,
    must_keep_rules: mustKeepRules.length ? mustKeepRules : (Array.isArray(parsed?.must_keep_rules) ? parsed.must_keep_rules : []),
    rewrite_brief: rewriteBrief,
    qa_summary: qaSummary
  };
}

function renderStageEditor(project, stageObj) {
  const editorForm = $("editorForm");
  editorForm.innerHTML = "";
  const stage = project.stage;

  if (stage === "PLANNING") {
    const planning = normalizePlanning(stageObj);
    editorForm.appendChild(makePlanningForm(project, planning, (nextObj) => {
      project.stages.PLANNING.currentText = JSON.stringify(nextObj);
      saveState();
      renderSummaryGapAndQuestions(project);
      renderScoresAndLocks(project, nextObj);
    }));
    return;
  }

  const wrap = document.createElement("div");
  const ta = document.createElement("textarea");
  ta.placeholder = "請輸入內容 / Please enter content（例 Example: 本章目標、衝突、章尾鉤子）";
  ta.value = pickPlainText(stageObj);
  ta.addEventListener("input", () => {
    const next = { content: ta.value.trim() };
    project.stages[stage].currentText = JSON.stringify(next);
    saveState();
    renderSummaryGapAndQuestions(project);
    renderScoresAndLocks(project, next);
  });
  wrap.appendChild(ta);
  editorForm.appendChild(wrap);
}

function makePlanningForm(project, planning, onChange) {
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
      const meta = getFieldMeta(title, k);
      label.textContent = meta.label;
      label.style.display = "block";
      label.style.marginBottom = "4px";
      const input = document.createElement("input");
      input.placeholder = meta.example;
      input.value = Array.isArray(obj[k]) ? obj[k].join(" | ") : String(obj[k] ?? "");
      if (title.startsWith("C ") && k === "hard_rules" && project.locks["world_rules.hard_rules"]) {
        input.disabled = true;
      }
      input.addEventListener("input", () => {
        obj[k] = input.value.includes("|")
          ? input.value.split("|").map((x) => x.trim()).filter(Boolean)
          : smartValue(input.value);
        const fieldPath = planningPathByGroupAndKey(title, k);
        if (fieldPath && project.authorConfirm[fieldPath]) {
          project.authorConfirm[fieldPath] = false;
        }
        onChange(planning);
      });
      row.appendChild(label);
      row.appendChild(input);
      row.appendChild(makeExampleText(meta.example));
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
      const meta = FIELD_META.characters[k] || { label: `${k} / ${k}`, example: "例 Example: -" };
      label.textContent = meta.label;
      label.style.display = "block";
      const input = document.createElement("input");
      input.placeholder = meta.example;
      input.value = String(c[k] ?? "");
      input.addEventListener("input", () => {
        c[k] = input.value;
        onChange(planning);
      });
      row.appendChild(label);
      row.appendChild(input);
      row.appendChild(makeExampleText(meta.example));
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
    const p = normalizePlanning(json);
    const gaps = [];
    if (!String(p.market_format.genre || "").trim()) gaps.push("缺少 market_format.genre（題材）");
    if (!String(p.market_format.platform || "").trim()) gaps.push("缺少 market_format.platform（平台）");
    if (!String(p.core_selling_points.logline || "").trim()) gaps.push("缺少 core_selling_points.logline（一句話賣點）");
    if (!String(p.world_rules.time_period || "").trim()) gaps.push("缺少 world_rules.time_period（時代）");
    if (!String(p.world_rules.location || "").trim()) gaps.push("缺少 world_rules.location（地點）");
    if (!Array.isArray(p.world_rules.hard_rules) || p.world_rules.hard_rules.filter((x) => String(x || "").trim()).length < 3) {
      gaps.push("hard_rules 少於 3 條有效規則");
    }
    if (!Array.isArray(p.characters) || p.characters.length < 3) gaps.push("characters 少於 3 人");
    if (!String(p.plot_nodes.inciting_incident || "").trim()) gaps.push("缺少 plot_nodes.inciting_incident（導火線）");
    if (!String(p.plot_nodes.climax || "").trim()) gaps.push("缺少 plot_nodes.climax（高潮）");
    if (!String(p.style_constraints.style_do || "").trim()) gaps.push("缺少 style_constraints.style_do（應做風格）");
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

function buildTaskList(stage, json, scores, readiness) {
  const tasks = [];
  if (stage === "PLANNING") {
    const details = scores?.riskDetails || [];
    details.forEach((d) => {
      if (d.includes("不能復活")) {
        tasks.push({
          title: "你要保留「不能復活」還是改結局？請二選一並說理由",
          why: "直接解除硬規則與結局的邏輯衝突",
          risk: d,
          format: "A保留硬規則/ B改結局 + 1句理由",
          example: "A 保留硬規則，改成『主角放下執念，不追求復活』，因為這更符合代價主題。"
        });
      }
      if (d.includes("角色少於 3 人")) {
        tasks.push({
          title: "補齊對手與盟友，並各給一個阻力/助力",
          why: "避免主線只有主角單線推進",
          risk: d,
          format: "角色名 + 目標 + 對主角影響",
          example: "對手遲航：目標封鎖引擎，阻力=切斷主角資源；盟友蘇羽：目標保護社區，助力=提供藏身點。"
        });
      }
      if (d.includes("缺少 logline")) {
        tasks.push({
          title: "寫 1 句 logline（主角+目標+時限/代價）",
          why: "logline 是整本書定位核心",
          risk: d,
          format: "主角必須在X時間內做Y，否則Z",
          example: "失憶潛航員必須在7天內找回核心記憶，否則整座港城防線將崩潰。"
        });
      }
      if (d.includes("導火線")) {
        tasks.push({
          title: "定義導火線事件，讓主線正式啟動",
          why: "沒有導火線故事難以進入主衝突",
          risk: d,
          format: "事件 + 主角被迫行動原因",
          example: "港口爆炸後，主角被誤認為嫌犯，必須自證清白並追查真兇。"
        });
      }
    });
    if (scores && scores.hook < 60) {
      tasks.push({
        title: "補一個章尾鉤子：讓讀者想追下一章",
        why: "提升 Hook Strength",
        risk: "Hook 分數偏低",
        format: "一句話懸念/反轉",
        example: "監控回放顯示：引爆者是主角未來版本。"
      });
    }
  }

  if (stage === "OUTLINE" && (!json.acts || json.acts.length < 3)) {
    tasks.push({
      title: "先把三幕各寫一句話",
      why: "三幕是後續章節拆解的骨架",
      risk: "Outline 結構不足",
      format: "第一幕/第二幕/第三幕 各一行",
      example: "第一幕引爆案；第二幕反轉真相；第三幕核心對決。"
    });
  }

  if (!tasks.length) {
    const gaps = buildGaps(stage, json).filter((g) => g !== "無明顯缺口");
    gaps.forEach((g) => {
      tasks.push({
        title: g,
        why: "補齊必要上下文",
        risk: "下一階段生成可能偏空泛",
        format: "2-5句，盡量可量化",
        example: buildQuestionExample(stage, g)
      });
    });
  }

  if (!tasks.length && readiness && !readiness.ready) {
    tasks.push({
      title: "補齊就緒門檻未達項目",
      why: "目前 Not Ready，需補齊最小必要資訊才能穩定進入下一階段",
      risk: readiness.reasons.join("；"),
      format: "優先補 Coverage 缺口欄位，每項 1-2 句具體描述",
      example: "先補題材、平台、logline、導火線與高潮，並確保 hard_rules 至少 3 條。"
    });
  }

  return tasks;
}

function renderStageGuide(project) {
  const wrap = $("stageGuide");
  if (!wrap) return;
  wrap.innerHTML = "";
  PHASES.forEach((phase) => {
    const box = document.createElement("div");
    box.className = `sg-item ${phase === project.phase ? "active" : ""}`;
    box.setAttribute("role", "button");
    box.setAttribute("tabindex", "0");
    box.innerHTML = `<strong>${phase}</strong><div>${escapeHtml(STAGE_GUIDE[phase] || "")}</div>`;
    const onSelect = () => {
      if (project.phase === phase) return;
      project.phase = phase;
      saveState();
      renderWorkspace();
    };
    box.addEventListener("click", onSelect);
    box.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect();
      }
    });
    wrap.appendChild(box);
  });
}

function clearChat(project) {
  project.chatHistory = [
    {
      role: "ai",
      content: "已清空對話。請重新用一句話描述你的故事點子。"
    }
  ];
  saveState();
  renderChatLog(project);
  setChatStatus(project, "狀態：對話已清空");
  pushOpLog(project, "清空對話");
  showToast("對話已清空", "warn");
}

function applyTaskAnswersToCurrent(project) {
  const stage = project.stage;
  const store = project.stages[stage];
  const answers = store?.questionAnswers || {};
  const values = Object.values(answers).map((v) => String(v || "").trim()).filter(Boolean);
  if (!values.length) {
    showToast("尚無任務回答可套用", "warn");
    return;
  }

  if (stage === "PLANNING") {
    const p = normalizePlanning(safeJson(project.stages.PLANNING.currentText || "{}"));
    const task1 = values[0] || "";
    const task2 = values[1] || "";
    const task3 = values[2] || "";

    if (!project.locks["world_rules.hard_rules"] && task1) {
      const rules = task1
        .split(/\n|。|;|；/)
        .map((x) => x.replace(/^\d+\)?\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 5);
      if (rules.length) p.world_rules.hard_rules = rules;
    }
    if (task2) {
      p.characters[0].weakness = task2;
      if (!p.characters[0].flaw) p.characters[0].flaw = task2.slice(0, 40);
    }
    if (task3) {
      p.core_selling_points.hooks[0] = task3;
      p.plot_nodes.commercial_paywall_hooks[0].event = task3;
    }
    project.stages.PLANNING.currentText = JSON.stringify(p);
  } else {
    const current = safeJson(project.stages[stage].currentText || "{}");
    const mergedText = `${pickPlainText(current)}\n\n[任務回答整合]\n${values.join("\n- ")}`;
    project.stages[stage].currentText = JSON.stringify({ content: mergedText.trim() });
  }
  saveState();
  renderWorkspace();
  pushOpLog(project, `套用任務回答到 ${stage}`);
  showToast(`已套用任務回答到 ${stage}`, "ok");
}

async function requestTaskFeedback(project, key, task, answer) {
  const stageStore = project.stages[project.stage];
  stageStore.questionFeedback = stageStore.questionFeedback || {};
  stageStore.questionFeedback[key] = "AI 反饋：分析中...";
  syncFeedbackElement(key, stageStore.questionFeedback[key]);

  const local = localTaskFeedback(answer);
  let llmExtra = "";
  if ((state.api?.apiKey || "").trim()) {
    const prompt = `你是小說編輯。請針對回答給三點回饋：可用度、太空泛處、補強建議。任務：${task.title}\n回答：${answer}`;
    const res = await callLLMText(prompt, 0.3);
    llmExtra = res ? `\nLLM 建議：${res.slice(0, 180)}` : "";
  }
  stageStore.questionFeedback[key] = `${local}${llmExtra}`;
  saveState();
  syncFeedbackElement(key, stageStore.questionFeedback[key]);
}

function localTaskFeedback(answer) {
  const text = String(answer || "").trim();
  if (!text) return "可用度：低。建議先完成最少 1 句具體描述。";
  if (text.length < 20) return "可用度：中低。內容太短，請補充限制條件或後果。";
  const hasNumber = /\d/.test(text);
  const hasCause = /因為|所以|因此|導致|後果/.test(text);
  if (hasNumber && hasCause) return "可用度：高。內容具體，已含量化與因果，可進入下一步。";
  return "可用度：中。建議加入一個數字限制與一個明確後果。";
}

function syncFeedbackElement(key, text) {
  const el = document.getElementById(`feedback-${slug(key)}`);
  if (el) el.textContent = text;
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

function defaultDebugConfig() {
  return {
    enabled: true,
    logs: []
  };
}

function hydrateState(input) {
  const next = input && typeof input === "object" ? input : {};
  const projects = Array.isArray(next.projects) ? next.projects : [];
  return {
    projects: projects.map((p) => {
      const project = {
        ...p,
        phase: PHASES.includes(p.phase) ? p.phase : "STRATEGY",
        entryMode: p.entryMode === "advanced" ? "advanced" : p.entryMode === "beginner" ? "beginner" : "auto",
        authorConfirm: p.authorConfirm && typeof p.authorConfirm === "object" ? p.authorConfirm : {},
        authorDrafts: p.authorDrafts && typeof p.authorDrafts === "object" ? p.authorDrafts : {},
        authorInputs: p.authorInputs && typeof p.authorInputs === "object" ? p.authorInputs : {},
        autoFillHints: typeof p.autoFillHints === "string" ? p.autoFillHints : "",
        intakeLevel: typeof p.intakeLevel === "string" ? p.intakeLevel : "未輸入",
        phaseEdit: p.phaseEdit && typeof p.phaseEdit === "object" ? p.phaseEdit : {},
        production: p.production && typeof p.production === "object" ? p.production : {},
        runtime: p.runtime && typeof p.runtime === "object" ? p.runtime : { busy: false, task: "", taskId: "", startedAt: "" },
        readinessLog: Array.isArray(p.readinessLog) ? p.readinessLog : [],
        chatHistory: Array.isArray(p.chatHistory) ? p.chatHistory : [],
        locks: p.locks && typeof p.locks === "object" ? p.locks : {},
        stages: normalizeStages(p.stages || {})
      };
      ensureProjectDefaults(project);
      return project;
    }),
    activeProjectId: next.activeProjectId || null,
    api: { ...defaultApiConfig(), ...(next.api || {}) },
    debug: { ...defaultDebugConfig(), ...(next.debug || {}) }
  };
}

function normalizeStages(stages) {
  const result = {};
  STAGES.forEach((s) => {
    const src = stages[s] || {};
    result[s] = {
      versions: Array.isArray(src.versions) ? src.versions : [],
      currentText: typeof src.currentText === "string" ? src.currentText : "{}",
      questionAnswers: src.questionAnswers && typeof src.questionAnswers === "object" ? src.questionAnswers : {},
      questionFeedback: src.questionFeedback && typeof src.questionFeedback === "object" ? src.questionFeedback : {},
      taskCursor: Number.isFinite(src.taskCursor) ? Number(src.taskCursor) : 0,
      taskFlowStarted: !!src.taskFlowStarted
    };
  });
  return result;
}

function ensureProjectDefaults(project) {
  if (!project.entryMode) project.entryMode = "auto";
  if (!PHASES.includes(project.phase)) project.phase = "STRATEGY";
  if (!Array.isArray(project.chatHistory)) {
    project.chatHistory = [];
  }
  if (!project.chatHistory.length) {
    project.chatHistory.push({
      role: "ai",
      content: "先用一句話說你的故事點子。我會一步步引導，並幫你整理成 Planning 模板。"
    });
  }
  if (!project.chatState || typeof project.chatState !== "object") {
    project.chatState = { busy: false, text: "狀態：待命" };
  }
  if (!Array.isArray(project.opLog)) {
    project.opLog = [];
  }
  if (!project.pilot || typeof project.pilot !== "object") {
    project.pilot = { text: "", qa: "" };
  }
  if (typeof project.tasksCollapsed !== "boolean") {
    project.tasksCollapsed = true;
  }
  if (!project.locks || typeof project.locks !== "object") {
    project.locks = {};
  }
  if (!Array.isArray(project.readinessLog)) {
    project.readinessLog = [];
  }
  if (!project.authorDrafts || typeof project.authorDrafts !== "object") {
    project.authorDrafts = {};
  }
  if (!project.authorInputs || typeof project.authorInputs !== "object") {
    project.authorInputs = {};
  }
  if (typeof project.autoFillHints !== "string") {
    project.autoFillHints = "";
  }
  if (typeof project.intakeLevel !== "string") {
    project.intakeLevel = "未輸入";
  }
  if (!project.phaseEdit || typeof project.phaseEdit !== "object") {
    project.phaseEdit = {};
  }
  PHASES.forEach((ph) => {
    if (typeof project.phaseEdit[ph] !== "boolean") {
      project.phaseEdit[ph] = ph === "STRATEGY";
    }
  });
  if (!project.production || typeof project.production !== "object") {
    project.production = {};
  }
  if (typeof project.production.chapterPlanConfirmed !== "boolean") {
    project.production.chapterPlanConfirmed = false;
  }
  if (typeof project.production.dissatisfaction !== "string") {
    project.production.dissatisfaction = "";
  }
  if (typeof project.production.strategyFeedback !== "string") {
    project.production.strategyFeedback = "";
  }
  if (typeof project.production.draftStatus !== "string") {
    project.production.draftStatus = "待命";
  }
  if (typeof project.production.draftErrorCode !== "string") {
    project.production.draftErrorCode = "";
  }
  if (!Number.isFinite(project.production.targetChapterNo)) {
    project.production.targetChapterNo = 1;
  }
  if (!project.runtime || typeof project.runtime !== "object") {
    project.runtime = { busy: false, task: "", taskId: "", startedAt: "" };
  }
  if (typeof project.runtime.busy !== "boolean") project.runtime.busy = false;
  if (typeof project.runtime.task !== "string") project.runtime.task = "";
  if (typeof project.runtime.taskId !== "string") project.runtime.taskId = "";
  if (typeof project.runtime.startedAt !== "string") project.runtime.startedAt = "";
  if (!project.authorConfirm || typeof project.authorConfirm !== "object") {
    project.authorConfirm = {};
  }
  NON_GUESSABLE_FIELDS.forEach((f) => {
    if (typeof project.authorConfirm[f.key] !== "boolean") {
      project.authorConfirm[f.key] = false;
    }
  });
  if (project.locks["world_rules.hard_rules"] === undefined) {
    project.locks["world_rules.hard_rules"] = true;
  }
  project.stages = normalizeStages(project.stages || {});
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

function getFieldMeta(groupTitle, key) {
  const map = groupTitle.startsWith("A ")
    ? FIELD_META.market_format
    : groupTitle.startsWith("B ")
      ? FIELD_META.core_selling_points
      : groupTitle.startsWith("C ")
        ? FIELD_META.world_rules
        : groupTitle.startsWith("E ")
          ? FIELD_META.plot_nodes
          : FIELD_META.style_constraints;
  return map[key] || { label: `${key} / ${key}`, example: "例 Example: -" };
}

function planningPathByGroupAndKey(groupTitle, key) {
  if (groupTitle.startsWith("B ")) return `core_selling_points.${key}`;
  if (groupTitle.startsWith("E ")) return `plot_nodes.${key}`;
  if (groupTitle.startsWith("F ")) return `style_constraints.${key}`;
  if (groupTitle.startsWith("A ")) return `market_format.${key}`;
  if (groupTitle.startsWith("C ")) return `world_rules.${key}`;
  return "";
}

function makeExampleText(text) {
  const s = document.createElement("small");
  s.style.display = "block";
  s.style.color = "#5c6f82";
  s.style.marginTop = "4px";
  s.textContent = text;
  return s;
}

function renderApiConfig() {
  $("apiBaseUrl").value = state.api?.baseUrl || "";
  $("apiModel").value = state.api?.model || "";
  $("apiKey").value = state.api?.apiKey || "";
  setApiStatus("尚未測試");
}

function ensureDebugState() {
  if (!state.debug || typeof state.debug !== "object") state.debug = defaultDebugConfig();
  if (!Array.isArray(state.debug.logs)) state.debug.logs = [];
  if (typeof state.debug.enabled !== "boolean") state.debug.enabled = true;
}

function renderDebugStatus() {
  ensureDebugState();
  const el = $("debugStatus");
  const btn = $("toggleDebugBtn");
  if (el) el.textContent = `Debug: ${state.debug.enabled ? "ON" : "OFF"}`;
  if (btn) btn.textContent = `診斷模式：${state.debug.enabled ? "ON" : "OFF"}`;
  renderDebugViewer();
}

function toggleDebugMode() {
  ensureDebugState();
  state.debug.enabled = !state.debug.enabled;
  saveState();
  renderDebugStatus();
  showToast(`診斷模式已${state.debug.enabled ? "開啟" : "關閉"}`, state.debug.enabled ? "ok" : "warn");
}

function recoverStaleBusyTasks() {
  const now = Date.now();
  const staleMs = 180000;
  (state.projects || []).forEach((p) => {
    ensureProjectDefaults(p);
    if (!p.runtime?.busy) return;
    const started = Date.parse(p.runtime.startedAt || "");
    if (!Number.isFinite(started)) {
      p.runtime.busy = false;
      p.runtime.task = "";
      p.runtime.taskId = "";
      p.runtime.startedAt = "";
      pushDebugLog("task.stale_reset", { reason: "invalid_startedAt", projectId: p.id }, "warn");
      return;
    }
    if (now - started > staleMs) {
      const oldTask = p.runtime.task || "";
      p.runtime.busy = false;
      p.runtime.task = "";
      p.runtime.taskId = "";
      p.runtime.startedAt = "";
      pushDebugLog("task.stale_reset", { projectId: p.id, oldTask, staleMs }, "warn");
    }
  });
  saveState();
}

function forceUnlockActiveProject() {
  const p = currentProject();
  if (!p) return;
  ensureProjectDefaults(p);
  const oldTask = p.runtime.task || "";
  p.runtime.busy = false;
  p.runtime.task = "";
  p.runtime.taskId = "";
  p.runtime.startedAt = "";
  saveState();
  setProjectBusyUI(p, false, "");
  pushDebugLog("task.force_unlock", { oldTask }, "warn");
  showToast("已強制解鎖目前專案", "warn");
}

function pushDebugLog(action, detail = {}, level = "info") {
  ensureDebugState();
  if (!state.debug.enabled) return;
  const project = currentProject();
  const safeDetail = sanitizeDebugDetail(detail);
  state.debug.logs.unshift({
    at: new Date().toISOString(),
    level,
    action,
    projectId: project?.id || "",
    phase: project?.phase || "",
    stage: project?.stage || "",
    detail: safeDetail
  });
  state.debug.logs = state.debug.logs.slice(0, 300);
  saveState();
  renderDebugViewer();
}

function sanitizeDebugDetail(detail) {
  const text = JSON.stringify(detail || {});
  return safeJson(
    text
      .replace(/"apiKey"\s*:\s*"[^"]*"/gi, "\"apiKey\":\"***\"")
      .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, "Bearer ***")
  );
}

function clearDebugLog() {
  ensureDebugState();
  state.debug.logs = [];
  saveState();
  pushDebugLog("debug.clear", { ok: true });
  showToast("診斷紀錄已清空", "ok");
}

function exportDebugPack() {
  ensureDebugState();
  const project = currentProject();
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "Novel Workbench Lite",
    activeProject: project ? { id: project.id, title: project.title, phase: project.phase, stage: project.stage } : null,
    debug: {
      enabled: state.debug.enabled,
      logs: state.debug.logs
    }
  };
  const name = `debug-pack-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  downloadText(name, JSON.stringify(payload, null, 2), "application/json");
  pushDebugLog("debug.export", { file: name, size: state.debug.logs.length });
  showToast("已匯出診斷包", "ok");
}

function renderDebugViewer() {
  ensureDebugState();
  const ta = $("debugViewer");
  const meta = $("debugMeta");
  if (!ta || !meta) return;
  const project = currentProject();
  const text = buildDebugViewerText(project);
  ta.value = text;
  meta.textContent = `Logs: ${state.debug.logs.length} | Project: ${project?.title || "-"} | Phase: ${project?.phase || "-"} | Stage: ${project?.stage || "-"}`;
}

function buildDebugViewerText(project) {
  const lines = [];
  lines.push(`# Debug Snapshot`);
  lines.push(`time: ${new Date().toISOString()}`);
  lines.push(`debug_enabled: ${state.debug?.enabled ? "true" : "false"}`);
  lines.push(`active_project: ${project?.title || "-"}`);
  lines.push(`active_phase: ${project?.phase || "-"}`);
  lines.push(`active_stage: ${project?.stage || "-"}`);
  lines.push("");
  lines.push(`## Recent Operation Log`);
  const op = Array.isArray(project?.opLog) ? project.opLog.slice(0, 30) : [];
  if (!op.length) {
    lines.push("- (empty)");
  } else {
    op.forEach((r) => {
      lines.push(`- ${r.at} | ${r.text}`);
    });
  }
  lines.push("");
  lines.push(`## Recent Readiness Log`);
  const rl = Array.isArray(project?.readinessLog) ? project.readinessLog.slice(0, 30) : [];
  if (!rl.length) {
    lines.push("- (empty)");
  } else {
    rl.forEach((r) => {
      lines.push(`- ${r.at} | ${r.message}`);
    });
  }
  lines.push("");
  lines.push(`## Debug Events`);
  const ev = Array.isArray(state.debug?.logs) ? state.debug.logs.slice(0, 120) : [];
  if (!ev.length) {
    lines.push("- (empty)");
  } else {
    ev.forEach((e) => {
      lines.push(`- ${e.at} | ${e.level} | ${e.action} | ${e.phase || "-"} / ${e.stage || "-"}`);
      lines.push(`  detail: ${JSON.stringify(e.detail || {})}`);
    });
  }
  return lines.join("\n");
}

async function copyDebugViewer() {
  const ta = $("debugViewer");
  if (!ta) return;
  const text = ta.value || "";
  if (!text.trim()) {
    showToast("目前沒有可複製的診斷內容", "warn");
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      ta.focus();
      ta.select();
      document.execCommand("copy");
      ta.setSelectionRange(0, 0);
    }
    pushDebugLog("debug.copy", { chars: text.length });
    showToast("診斷內容已複製", "ok");
  } catch (err) {
    pushDebugLog("debug.copy.error", { error: String(err?.message || err || "unknown") }, "err");
    showToast("複製失敗，請手動選取複製", "err");
  }
}

function saveApiConfig() {
  state.api = {
    baseUrl: $("apiBaseUrl").value.trim(),
    model: $("apiModel").value.trim(),
    apiKey: $("apiKey").value.trim()
  };
  saveState();
  setApiStatus("已儲存");
  pushDebugLog("api.save", {
    baseUrl: state.api.baseUrl,
    model: state.api.model,
    hasApiKey: !!state.api.apiKey
  });
  showToast("API 設定已儲存", "ok");
}

async function testApiConnection() {
  saveApiConfig();
  const { baseUrl, apiKey } = state.api;
  if (!baseUrl || !apiKey) {
    setApiStatus("請先填 Base URL 與 API Key");
    pushDebugLog("api.test", { ok: false, reason: "missing_base_or_key" }, "warn");
    showToast("請先填 Base URL 與 API Key", "warn");
    return;
  }
  setApiStatus("測試中...");
  try {
    const resp = await fetch(`${baseUrl.replace(/\/$/, "")}/models`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    setApiStatus(resp.ok ? "連線成功" : `連線失敗 (${resp.status})`);
    pushDebugLog("api.test", { ok: resp.ok, status: resp.status });
    showToast(resp.ok ? "API 連線成功" : `API 連線失敗 (${resp.status})`, resp.ok ? "ok" : "err");
  } catch (err) {
    setApiStatus("連線失敗（可能被公司網路或 CORS 限制）");
    pushDebugLog("api.test", { ok: false, error: String(err?.message || err || "unknown") }, "err");
    showToast("API 連線失敗（網路或 CORS）", "err");
  }
}

async function callLLMText(prompt, temperature = 0.5, forceJson = false, timeoutMs = 25000, returnMeta = false) {
  const api = state.api || {};
  if (!api.apiKey || !api.baseUrl) {
    pushDebugLog("llm.call.skip", { reason: "missing_api_config", forceJson });
    return returnMeta ? { content: "", errorCode: "network" } : "";
  }
  let timeout = null;
  const reqId = crypto.randomUUID();
  const startAt = Date.now();
  pushDebugLog("llm.call.start", {
    reqId,
    model: api.model || "deepseek-chat",
    forceJson,
    timeoutMs,
    promptLength: String(prompt || "").length,
    promptPreview: previewText(prompt, 280)
  });
  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), timeoutMs);
    const resp = await fetch(`${api.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api.apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: api.model || "deepseek-chat",
        temperature,
        ...(forceJson ? { response_format: { type: "json_object" } } : {}),
        messages: [
          {
            role: "system",
            content: "你是小說創作助手，回答需具體、可執行、簡潔。"
          },
          { role: "user", content: prompt }
        ]
      })
    });
    const raw = await resp.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = {};
    }
    if (!resp.ok) {
      const errorCode = [408, 504].includes(resp.status) ? "timeout" : "network";
      pushDebugLog("llm.call.fail", {
        reqId,
        status: resp.status,
        statusText: resp.statusText || "",
        ms: Date.now() - startAt,
        errorBodyPreview: previewText(
          raw
          || data?.error?.message
          || data?.message
          || "",
          600
        )
      }, "err");
      return returnMeta ? { content: "", errorCode, status: resp.status } : "";
    }
    const content = String(data?.choices?.[0]?.message?.content || "");
    pushDebugLog("llm.call.success", {
      reqId,
      ms: Date.now() - startAt,
      contentLength: content.length,
      responsePreview: previewText(content, 900)
    });
    return returnMeta ? { content, errorCode: "" } : content;
  } catch (err) {
    const msg = String(err?.message || err || "unknown");
    const errorCode = /aborted/i.test(msg) ? "timeout" : "network";
    pushDebugLog("llm.call.error", { reqId, ms: Date.now() - startAt, error: msg }, "err");
    return returnMeta ? { content: "", errorCode } : "";
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function callLLMWithMeta(prompt, temperature = 0.5, forceJson = false, timeoutMs = 25000) {
  const res = await callLLMText(prompt, temperature, forceJson, timeoutMs, true);
  if (!res || typeof res !== "object") return { content: "", errorCode: "network" };
  return {
    content: String(res.content || ""),
    errorCode: String(res.errorCode || "")
  };
}

function previewText(text, max = 500) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)} ...[truncated]`;
}

function setApiStatus(text) {
  const el = $("apiStatus");
  if (el) el.textContent = text;
}

function setChatStatus(project, text) {
  project.chatState = project.chatState || { busy: false, text: "狀態：待命" };
  project.chatState.text = text;
  const el = $("chatStatus");
  if (el) el.textContent = text;
}

function setChatBusy(project, busy) {
  project.chatState = project.chatState || { busy: false, text: "狀態：待命" };
  project.chatState.busy = busy;
  const sendBtn = $("chatSendBtn");
  const input = $("chatInput");
  if (sendBtn) sendBtn.disabled = busy;
  if (input) input.disabled = busy;
}

function setActionStatus(text, tone = "") {
  const el = $("actionStatus");
  if (!el) return;
  el.textContent = `操作訊息：${text}`;
  el.classList.remove("ok", "warn", "err");
  if (tone) el.classList.add(tone);
}

function setAutoStatus(text, tone = "") {
  const el = $("autoStatus");
  if (!el) return;
  el.textContent = text;
  el.classList.remove("ok", "warn", "err");
  if (tone) el.classList.add(tone);
}

function setProjectBusyUI(project, busy, task = "") {
  document.body.classList.toggle("is-busy", !!busy);
  const status = busy ? `狀態：執行中（${task || "任務"}），請稍候...` : (project?.chatState?.text || "狀態：待命");
  const autoStatus = busy ? `狀態：執行中（${task || "任務"}）` : ($("autoStatus")?.textContent || "狀態：待命");
  const nodes = document.querySelectorAll("button,input,textarea,select");
  nodes.forEach((node) => {
    const el = node;
    if (el.dataset.busyIgnore === "true") return;
    if (busy) {
      el.dataset.prevDisabled = el.disabled ? "1" : "0";
      el.disabled = true;
    } else if ("prevDisabled" in el.dataset) {
      el.disabled = el.dataset.prevDisabled === "1";
      delete el.dataset.prevDisabled;
    }
  });
  const chatStatus = $("chatStatus");
  if (chatStatus) chatStatus.textContent = status;
  const autoEl = $("autoStatus");
  if (autoEl) autoEl.textContent = autoStatus;
}

async function withProjectTask(project, taskName, runner) {
  if (!project) return null;
  ensureProjectDefaults(project);
  if (project.runtime?.busy) {
    showToast(`目前正在執行：${project.runtime.task || "任務"}，請稍候`, "warn");
    pushDebugLog("task.reject_busy", { running: project.runtime.task || "" }, "warn");
    return null;
  }
  project.runtime.busy = true;
  project.runtime.task = taskName;
  project.runtime.taskId = crypto.randomUUID();
  project.runtime.startedAt = new Date().toISOString();
  saveState();
  setProjectBusyUI(project, true, taskName);
  pushDebugLog("task.start", { taskName, taskId: project.runtime.taskId, startedAt: project.runtime.startedAt });
  try {
    return await runner();
  } catch (err) {
    pushDebugLog("task.error", { taskName, taskId: project.runtime.taskId, error: String(err?.message || err || "unknown") }, "err");
    throw err;
  } finally {
    project.runtime.busy = false;
    project.runtime.task = "";
    project.runtime.taskId = "";
    project.runtime.startedAt = "";
    saveState();
    setProjectBusyUI(project, false, "");
    pushDebugLog("task.end", { taskName });
  }
}

function pushOpLog(project, text) {
  if (!project) return;
  if (!Array.isArray(project.opLog)) project.opLog = [];
  project.opLog.unshift({
    at: new Date().toISOString(),
    text
  });
  project.opLog = project.opLog.slice(0, 80);
  saveState();
  renderOpLog(project);
}

function renderOpLog(project) {
  const list = $("opLog");
  if (!list) return;
  list.innerHTML = "";
  const rows = Array.isArray(project.opLog) ? project.opLog : [];
  if (!rows.length) {
    const li = document.createElement("li");
    li.textContent = "尚無操作記錄";
    list.appendChild(li);
    return;
  }
  rows.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = `${new Date(r.at).toLocaleTimeString()} - ${r.text}`;
    list.appendChild(li);
  });
}

let toastTimer = null;
function showToast(text, tone = "") {
  const el = $("toast");
  if (!el) return;
  el.textContent = text;
  el.classList.remove("hidden", "ok", "warn", "err");
  if (tone) el.classList.add(tone);
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.add("hidden");
    el.classList.remove("ok", "warn", "err");
  }, 3000);
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

function parseJsonLoose(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const m = String(text).match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
      return JSON.parse(m[0]);
    } catch {
      return null;
    }
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
