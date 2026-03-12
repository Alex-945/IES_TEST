# AI 問卷自動填答系統企劃

## 一、系統目標（Goal）

### 輸入
- 車廠 Self-Assessment / Self-Audit 問卷（Excel / Word / PDF）

### AI 輸出
- 預填回答
- 證據來源
- 信心度

### 使用方式
- 工程師只需要進行 Review / 修改 / Confirm

## 二、系統核心流程

整體流程其實只有 4 個模組：

1. 問卷解析
2. 知識檢索
3. 回答生成
4. 人工審查

### 流程圖

```text
客戶問卷
      ↓
AI 解析問題
      ↓
搜尋公司資料
      ↓
生成預填回答
      ↓
工程師 Review
      ↓
提交客戶
```

## 三、知識來源（AI 可用資料）

AI 不會自己知道公司內部怎麼做，必須提供企業知識庫。

### 建議資料來源

#### 1. 品質文件
例如：
- CQI-14
- IATF 16949 程序文件
- Control Plan
- PFMEA
- APQP 流程
- NTF flow
- Safe Launch

#### 2. 過去問卷
例如：
- GM self assessment
- VW Formel Q
- Volvo audit
- BYD / NIO supplier questionnaire

#### 3. SOP / 流程圖
例如：
- warranty process
- spare part flow
- NTF handling

#### 4. 8D / lesson learned
- 這些資料其實很有價值，可作為回答與經驗回饋依據。

## 四、AI 回答邏輯（很重要）

AI 不應該只輸出答案，而應該輸出 3 段結構：

### 1. 直接回答

例如：

> Yes. Inventec manages warranty issues through a formal NTF handling process defined in procedure AME-QP-045.

### 2. 依據文件

例如：

```text
Evidence:
Procedure: AME-QP-045
Section: NTF Handling Flow
Owner: CQE + MP Team
```

### 3. 信心等級

例如：

```text
Confidence: High / Medium / Low
```

- 若為 `Low`，工程師必須仔細審查。

## 五、沒有資料時的 AI 行為

如果 AI 找不到資料，應該生成以下結構：

```text
No direct internal reference found.

Suggested response:
Inventec evaluates customer requirements through APQP review
and implements necessary process updates before SOP.

Action recommended:
Confirm with AQE or Quality system owner.
```

這樣工程師就不需要從零開始撰寫。

## 六、UI 介面設計（非常重要）

工程師其實只需要看到以下欄位：

- Question
- AI answer
- Evidence
- Confidence

### 範例

| Question | AI answer | Evidence | Confidence |
|---|---|---|---|
| Do you have NTF process? | Yes, defined in AME-QP-045 | Procedure QP045 | High |

### 工程師操作

- Approve
- Edit
- Reject

## 七、最簡單可行版本（MVP）

如果要先做第一版，建議技術架構如下：

### 技術架構
- Python
- OpenAI API
- Vector database
- Excel reader

### 工具
- LangChain
- FAISS
- OpenAI
- Streamlit

### MVP 功能
1. 讀取問卷 Excel
2. 解析問題
3. 搜尋公司資料
4. 生成回答
5. 顯示結果

## 八、這個工具的價值（非常高）

對車用供應商而言，這個工具有 4 個核心價值：

### 1. 回答速度
- 原本：1 份問卷需要 3～5 天
- AI 導入後：可縮短至約 30 分鐘

### 2. 回答一致性
- 避免不同工程師寫出不同版本。

### 3. 知識沉澱
- 所有回答都會進入 Supplier Knowledge Base。

### 4. 新人可快速回答
- 不需要具備 5 年 CQE 經驗才有辦法撰寫。

## 九、車用產業特別重要的一點

AI 不能亂編，必須加入 Citation system。

### Citation 建議欄位
- Source document
- Section
- Paragraph

否則在車廠 audit 場景中，風險非常高。

## 十、專業建議

如果由 CQE Leader 角度規劃，建議分三階段推進：

### Phase 1
- AI 填寫問卷

### Phase 2
- AI 生成 Audit evidence package

例如：
- Procedure
- Control plan
- Records

### Phase 3
- AI 自動生成 OEM questionnaire library

### 長期目標
- 未來新問卷可做到 80% 自動回答。

## 十一、我可以幫你做的事情

如果要往下落地，我可以直接幫你設計完整系統藍圖，包括：

- AI 系統架構圖
- 知識庫結構
- Prompt 設計
- Excel 問卷解析
- 第一版 Python 程式

甚至可以做到：

```text
工程師上傳 Excel → AI 直接填好
```
