/* 檔案：main.js (V7.0 DeepSeek AI API版) */

window.onload = function() {
    initTable();
    initDictTable();
    renderPhraseButtons();
    initOtherListeners();
};

function initOtherListeners() {
    const visType = document.getElementById('vis-type');
    const visOther = document.getElementById('vis-type-other');
    if(visType && visOther) {
        visType.addEventListener('change', function() {
            visOther.style.display = (this.value === 'Other') ? 'block' : 'none';
        });
    }

    const actCat = document.getElementById('act-cat');
    const actOther = document.getElementById('act-cat-other');
    if(actCat && actOther) {
        actCat.addEventListener('change', function() {
            actOther.style.display = (this.value === 'Other') ? 'block' : 'none';
        });
    }
}

function renderPhraseButtons() {
    const container = document.getElementById('issue-phrases');
    if(typeof quickPhrases !== 'undefined' && quickPhrases.length > 0) {
        const phraseBtns = quickPhrases.map(p => `<button class="phrase-btn" onclick="insertPhrase('${p}')">+ ${p}</button>`).join('');
        container.innerHTML = phraseBtns;
    }
}

function insertPhrase(text) {
    const textarea = document.getElementById('iss-concl');
    if(textarea.value) textarea.value += ", ";
    textarea.value += text;
}

function switchTab(type) {
    document.querySelectorAll('.tab, .form-section').forEach(e => e.classList.remove('active'));
    document.getElementById('tab-' + type).classList.add('active');
    document.getElementById(type + '-sec').classList.add('active');
}

// ==========================================
// ★ API 金鑰管理
// ==========================================
function openApiModal() {
    const savedKey = localStorage.getItem('deepseek_key');
    if(savedKey) document.getElementById('api-key-input').value = savedKey;
    document.getElementById('api-modal').style.display = 'flex';
}
function closeApiModal() { document.getElementById('api-modal').style.display = 'none'; }
function saveApiKey() {
    const key = document.getElementById('api-key-input').value.trim();
    if(key) {
        localStorage.setItem('deepseek_key', key);
        alert("金鑰已儲存！");
        closeApiModal();
    } else {
        alert("金鑰不可為空。");
    }
}
function getApiKey() {
    const key = localStorage.getItem('deepseek_key');
    if(!key) {
        alert("未設定 API Key！請點擊右上角「⚙️ API 設定」輸入金鑰。");
        return null;
    }
    return key;
}

// ==========================================
// ★ DeepSeek 基礎呼叫函式
// ==========================================
async function callDeepSeek(systemPrompt, userText) {
    const apiKey = getApiKey();
    if(!apiKey) return null;

    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {role: 'system', content: systemPrompt},
                    {role: 'user', content: userText}
                ],
                temperature: 0.1 // 低隨機性，確保格式精準
            })
        });

        if(!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || `HTTP error ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        alert(`API 連線失敗：${error.message}\n請檢查網路或 API Key 是否正確。`);
        return null;
    }
}

// ==========================================
// ★ 需求 1: 結構化 JSON 擷取 (語意拆解)
// ==========================================
async function runAiParsing() {
    const rawText = document.getElementById('ai-raw-text').value.trim();
    if(!rawText) { alert("請先輸入內容再執行解析！"); return; }

    const systemPrompt = `你是一個專業的車用電子 CQE。請將使用者的描述提取為嚴格的 JSON 格式。若未提及請填入空字串 ""。
必須嚴格遵守此 JSON 結構，不要輸出其他文字：
{
  "category": "issue" 或是 "visit",
  "issue_data": { "site": "IPT/IME/ITE/TAO/TRDC/WW", "ind": "VLRR/0KM/FR/IQC/Internal", "found": "發現者", "cust": "客戶", "prod": "產品", "proj": "專案", "sym": "失效現象", "qty": "數量數字", "date": "MM/DD", "liab": "Under FA/PID/VID/CID/NTF", "concl": "結論與後續處置" },
  "visit_data": { "site": "IPT/IME/...", "type": "Customer Visit/CQE Visit/Audit/Meeting", "who": "發起者", "date": "YYYY/MM/DD", "desc": "目的說明", "res": "結果待辦" }
}`;

    document.getElementById('loader').style.display = 'flex';
    document.getElementById('loader-msg').innerText = 'AI 語意拆解中...';

    const aiResponse = await callDeepSeek(systemPrompt, rawText);
    document.getElementById('loader').style.display = 'none';

    if(!aiResponse) return;

    try {
        // 清理 Markdown 標籤以安全解析 JSON
        const jsonString = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(jsonString);

        fillFormFromJson(parsed);
        checkMissingInfo(parsed.category);

    } catch (e) {
        alert("JSON 解析失敗，可能內容過於發散無法結構化。回傳原文：\n" + aiResponse);
    }
}

function fillFormFromJson(data) {
    if (data.category === "issue" || data.category === "Issue") {
        switchTab('issue');
        const d = data.issue_data;
        if(d.site) document.getElementById('iss-site').value = d.site.toUpperCase();
        if(d.ind) document.getElementById('iss-ind').value = d.ind;
        document.getElementById('iss-found').value = d.found || "";
        document.getElementById('iss-cust').value = d.cust || "";
        document.getElementById('iss-prod').value = d.prod || "";
        document.getElementById('iss-proj').value = d.proj || "";
        document.getElementById('iss-sym').value = d.sym || "";
        document.getElementById('iss-qty').value = d.qty || "";
        document.getElementById('iss-date').value = d.date || "";
        if(d.liab) document.getElementById('iss-liab').value = d.liab;
        document.getElementById('iss-concl').value = d.concl || "";
    } 
    else if (data.category === "visit" || data.category === "Visit") {
        switchTab('visit');
        const v = data.visit_data;
        if(v.site) document.getElementById('vis-site').value = v.site.toUpperCase();
        if(v.type) document.getElementById('vis-type').value = v.type;
        document.getElementById('vis-who').value = v.who || "";
        document.getElementById('vis-date').value = v.date || "";
        document.getElementById('vis-desc').value = v.desc || "";
        document.getElementById('vis-res').value = v.res || "";
    }
}

function checkMissingInfo(category) {
    // 清除舊紅框
    document.querySelectorAll('.missing-info').forEach(e => e.classList.remove('missing-info'));
    let hasMissing = false;

    if(category === "issue") {
        const reqFields = document.querySelectorAll('.req-issue');
        reqFields.forEach(f => {
            if(!f.value.trim()) { f.classList.add('missing-info'); hasMissing = true; }
        });
    } else if (category === "visit") {
        const reqFields = document.querySelectorAll('.req-visit');
        reqFields.forEach(f => {
            if(!f.value.trim()) { f.classList.add('missing-info'); hasMissing = true; }
        });
    }

    if(hasMissing) {
        alert("AI 已填入資料，但有部分資訊 (紅色外框) 缺失，請手動補齊！");
    } else {
        alert("AI 結構化擷取成功！資訊完整。");
    }
}

// ==========================================
// ★ 需求 2 & 3: 專業翻譯與標準格式封裝
// ==========================================
async function generateReport() {
    const tab = document.querySelector('.tab.active').id;
    let cn = "", en = "";
    
    // 準備字典字串餵給 AI 作為 System Context
    const dictContext = typeof dictionary !== 'undefined' ? 
        dictionary.map(d => `${d.cn} -> ${d.en}`).join(", ") : "";

    const transSystemPrompt = `你是一個專業的車用電子 CQE。請將以下中文段落翻譯成道地且專業的工程英文。
必須遵守以下專有字典：
[ ${dictContext} ]
要求：
1. 只輸出翻譯後的英文結果，不要有任何多餘解釋。
2. 語句要簡潔連貫，符合歐系車廠 (Kostal, Volvo) 的工程習慣。`;

    if (tab === 'tab-issue') {
        const d = {
            site: document.getElementById('iss-site').value,
            ind: document.getElementById('iss-ind').value,
            found: document.getElementById('iss-found').value,
            cust: document.getElementById('iss-cust').value,
            prod: document.getElementById('iss-prod').value,
            proj: document.getElementById('iss-proj').value,
            sym: document.getElementById('iss-sym').value,
            qty: document.getElementById('iss-qty').value,
            date: document.getElementById('iss-date').value,
            liab: document.getElementById('iss-liab').value,
            concl: document.getElementById('iss-concl').value
        };
        
        // 中文標準格式 (寫死)
        cn = `[${d.site}][${d.ind}]: ${d.found} 報告 ${d.cust} 之 ${d.prod}(${d.proj}) 發生 ${d.sym} *${d.qty} 於 ${d.date}；目前判定為 ${d.liab}，結論：${d.concl}。`;
        
        // 呼叫 AI 翻譯「失效現象」與「結論」
        document.getElementById('loader').style.display = 'flex';
        document.getElementById('loader-msg').innerText = 'AI 專業翻譯中...';
        
        const enSym = await callDeepSeek(transSystemPrompt, d.sym);
        const enConcl = await callDeepSeek(transSystemPrompt, d.concl);
        document.getElementById('loader').style.display = 'none';

        if(!enSym || !enConcl) return; // 失敗則中斷

        // 英文標準格式封裝 (保證格式一致)
        en = `[${d.site}][${d.ind}]: ${d.found} reported ${d.cust} ${d.prod}(${d.proj}) ${enSym} *${d.qty} on ${d.date}; Status: ${d.liab}, Conclusion: ${enConcl}`;
    
    } else if (tab === 'tab-visit') {
        let typeVal = document.getElementById('vis-type').value;
        if(typeVal === 'Other') typeVal = document.getElementById('vis-type-other').value;

        const v = {
            site: document.getElementById('vis-site').value,
            type: typeVal,
            who: document.getElementById('vis-who').value,
            date: document.getElementById('vis-date').value,
            desc: document.getElementById('vis-desc').value,
            res: document.getElementById('vis-res').value
        };

        const inputDate = new Date(v.date);
        const today = new Date();
        today.setHours(0,0,0,0);
        const isFuture = inputDate >= today;

        let verbPast = "visited"; let verbFuture = "plans to visit";
        if (v.type === 'Audit' || v.type.includes('稽核')) { verbPast = "conducted"; verbFuture = "scheduled to conduct"; } 
        else if (v.type === 'Meeting' || v.type.includes('會議')) { verbPast = "held"; verbFuture = "plans to hold"; }

        if (isFuture) {
            cn = `[${v.site}]: ${v.who} 預計於 ${v.date} 進行 ${v.desc} (${v.type})；${v.res}`;
        } else {
            cn = `[${v.site}]: ${v.who} 於 ${v.date} 進行 ${v.desc} (${v.type})；${v.res}`;
        }

        document.getElementById('loader').style.display = 'flex';
        document.getElementById('loader-msg').innerText = 'AI 專業翻譯中...';
        const enDesc = await callDeepSeek(transSystemPrompt, v.desc);
        const enRes = await callDeepSeek(transSystemPrompt, v.res);
        document.getElementById('loader').style.display = 'none';

        if(!enDesc || !enRes) return;

        if (isFuture) {
            en = `[${v.site}]: ${v.who} ${verbFuture} ${enDesc} ${v.type} on ${v.date} ; ${enRes}`;
        } else {
            en = `[${v.site}]: ${v.who} ${verbPast} ${enDesc} ${v.type} on ${v.date} ; ${enRes}`;
        }

    } else if (tab === 'tab-activity') {
        let catVal = document.getElementById('act-cat').value;
        if(catVal === 'Other') catVal = document.getElementById('act-cat-other').value;

        const a = {
            site: document.getElementById('act-site').value,
            cat: catVal,
            name: document.getElementById('act-name').value,
            stat: document.getElementById('act-stat').value,
            cp: document.getElementById('act-cp').value,
            help: document.getElementById('act-help').value
        };

        let helpCN = a.help ? `；需協助: ${a.help}` : "";
        cn = `[${a.site}]: ${a.cat} 專案 (${a.name}) 目前處於 ${a.stat}；預計結案 (CP): ${a.cp}${helpCN}。`;

        document.getElementById('loader').style.display = 'flex';
        document.getElementById('loader-msg').innerText = 'AI 專業翻譯中...';
        const enStat = await callDeepSeek(transSystemPrompt, a.stat);
        let enHelp = "";
        if(a.help) enHelp = await callDeepSeek(transSystemPrompt, a.help);
        document.getElementById('loader').style.display = 'none';
        
        let helpEN = enHelp ? ` ; Help needed: ${enHelp}` : "";
        en = `[${a.site}]: ${a.cat} Project (${a.name}) is under ${enStat} ; Target Completion (CP): ${a.cp}${helpEN}`;
    }

    document.getElementById('out-cn').innerText = cn;
    document.getElementById('out-en').innerText = en;
}

// ==========================================
// ★ 其他輔助邏輯 (維持與 V6 相同)
// ==========================================
function initTable() {
    const body = document.getElementById('table-body');
    if(typeof projectTable !== 'undefined') {
        body.innerHTML = projectTable.map(item => `<tr><td>${item.c}</td><td>${item.d}</td><td>${item.p}</td><td><button class="use-btn" onclick="useProject('${item.c}','${item.p}','${item.d}')">帶入</button></td></tr>`).join('');
    }
}
function initDictTable() {
    const body = document.getElementById('mode-body');
    if(typeof dictionary !== 'undefined') {
        body.innerHTML = dictionary.map(item => `<tr><td>${item.cn}</td><td>${item.en}</td><td><span style="font-size:0.8em;background:#27ae60;padding:2px;color:white;">${item.type}</span></td><td></td></tr>`).join('');
    }
}
function useProject(cust, proj, prod) {
    document.getElementById('iss-cust').value = cust;
    document.getElementById('iss-proj').value = proj;
    document.getElementById('iss-prod').value = prod;
    switchTab('issue');
}
function copyResult() {
    navigator.clipboard.writeText(document.getElementById('out-cn').innerText + "\n" + document.getElementById('out-en').innerText);
    alert("Summary 已複製！");
}