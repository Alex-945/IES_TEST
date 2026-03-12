# Automotive Self-Assessment Pre-Fill AI－整合規格書

## 一、專案目標

### 專案名稱

`Automotive_Self_Assessment_PreFill_AI`

### 專案摘要

建立一套內部 AI 工具，用於預填客戶 Self-Assessment / Self-Audit 問卷，讓工程師以 Review / 修改 / Confirm 的方式快速完成回覆。

### 核心目標

- 先判定 IEC responsible function
- 根據可追溯資料來源預填答案
- 當無直接內部證據時，提供可能負責單位與建議回答
- 視情況直接回寫客戶 Excel，或輸出批次 review 檔

### 使用範圍

- 僅供內部部門使用
- 先以 MVP 為第一階段
- 以 Excel 問卷場景為最優先

## 二、業務背景與問題定義

### 問卷輸入特性

- 客戶問卷主格式幾乎都是 Excel
- 不同客戶模板差異大
- 可能有多個 sheets
- 中英文混合
- 評分邏輯不同
- 欄位布局不一致

### 預期輸出內容

- IEC responsible function 或 PIC
- Self-assessment score
- 長文字 evidence description
- Internal practice description
- Document number 或 reference ID

### 系統要解決的核心問題

- 工程師不需要從零開始填問卷
- 不同工程師的回答要盡量一致
- 所有回答都需要可追溯證據
- 當資料不足時，也要提供可編修的建議答案

## 三、系統整體目標（Goal）

### 輸入

- 車廠 Self-Assessment / Self-Audit 問卷
- 支援格式：Excel / Word / PDF

### AI 輸出

- 預填回答
- 證據來源
- 信心度

### 最終使用方式

- 工程師進行 Review / 修改 / Confirm

## 四、系統核心流程

整體流程可拆成 4 個主要模組：

1. 問卷解析
2. 知識檢索
3. 回答生成
4. 人工審查

### 簡化流程圖

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

### 完整高階流程

```text
Input ingestion
→ Excel structure parsing
→ Question extraction and normalization
→ Responsible function prediction
→ Knowledge retrieval
→ Answer generation
→ Confidence scoring
→ Excel write-back or review export
→ Engineer review
```

## 五、系統架構定位

這套系統本質上是：

- 文件解析系統
- 企業知識檢索系統
- RAG 回答生成系統
- 人工審查工作流系統

它不是要完全取代工程師，而是提供「AI 預填 + 工程師把關」的工作模式。

## 六、整體系統架構圖

```text
┌────────────────────┐
│   客戶問卷檔案輸入   │
│ Excel / Word / PDF │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   問卷解析模組       │
│ Parser / Extractor │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   問題理解模組       │
│ Question Analyzer  │
└─────────┬──────────┘
          │
          ▼
┌──────────────────────────────────┐
│      知識檢索模組（RAG）          │
│ Vector Search + Metadata Filter │
└─────────┬────────────────────────┘
          │
          ▼
┌────────────────────┐
│   回答生成模組       │
│ Answer Generator   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   審查介面模組       │
│ Review UI          │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   輸出 / 匯出模組    │
│ Excel / Report     │
└────────────────────┘
```

## 七、系統設計風格

### Architecture Style

- Hybrid AI + rule-based pipeline

### 設計原因

- Excel 結構解析不能只靠 LLM
- 欄位 mapping、sheet 判斷、回寫位置判斷適合 rule-based
- 問題理解、負責單位推測、答案生成適合 AI
- 最穩定的做法是規則與 AI 混合

## 八、核心引擎

### 1. Parsing AI

用途：理解問卷結構，辨識真正的問題列，而非標題、備註或 metadata。

#### Key Tasks

- Detect sheets containing questions
- Identify question rows
- Map question / score / responsible function / answer / evidence columns
- Handle multilingual labels
- Handle irregular layouts

### 2. Retrieval Engine

用途：搜尋內部知識來源，找出最相關的答案與證據。

#### Key Tasks

- Search historical questionnaires first
- Search VDA 6.3 and IATF 16949 references
- Search evidence PPTs
- Rank by relevance and recency

### 3. Generation AI

用途：依據檢索結果生成結構化預填回答。

#### Key Tasks

- Recommend IEC responsible function
- Suggest self-assessment score
- Draft evidence-based answer text
- Add document number and source references
- Provide fallback suggestion if evidence is missing

### 4. Rule Engine

用途：提升可重現性與穩定性。

#### Key Tasks

- Excel column mapping heuristics
- Sheet classification
- Scoring field detection
- Output schema validation
- Confidence threshold routing

## 九、知識來源（AI 可用資料）

AI 不會自己知道公司內部怎麼做，必須依賴企業知識庫。

### 優先順序

#### Priority 1：歷史問卷

- Previously answered customer questionnaires

#### Priority 2：VDA 參考文件

- 先聚焦 VDA 6.3

#### Priority 3：IATF 16949 參考文件

- IATF 16949 PDF

#### Priority 4：Evidence PPT

- 可能含 responsible function、PIC、issue description、evidence images

### 其他建議來源

#### 品質文件

- CQI-14
- IATF 16949 程序文件
- Control Plan
- PFMEA
- APQP 流程
- NTF flow
- Safe Launch

#### SOP / 流程圖

- warranty process
- spare part flow
- NTF handling

#### 8D / lesson learned

- 可作為回答依據與知識沉澱來源

## 十、檔案管理建議

### Current State

- Scattered files

### 常見命名元素

- Customer name
- Audit 或 questionnaire name

### 建議命名規則

- `customer_name`
- `questionnaire_name`
- `year`
- `revision`
- `language`
- `site_if_applicable`

## 十一、輸入設計

### Supported Input Formats

- `xlsx`
- `xls`
- `docx`
- `pptx`
- `pdf`
- `txt`
- `png`
- `jpg`
- `jpeg`

### Primary Input

- Excel questionnaire

### Secondary Knowledge Formats

- PDF
- PPT
- Word
- Text
- Image

### Input Processing Requirements

#### Excel

- Support multiple sheets
- Support merged cells
- Support multilingual headers
- Support variable scoring columns
- Detect hidden or auxiliary sheets if needed

#### PDF

- Extract text
- Preserve section headings
- Support OCR for scanned PDF if required

#### PPT

- Extract slide text
- Capture slide title
- Link evidence images to surrounding text if possible

#### Word

- Extract headings, tables, and paragraphs

#### Image

- OCR text extraction
- Basic image metadata capture
- Associate image with neighboring textual evidence when possible

## 十二、問題處理邏輯

### Step 1：Parse

目標：理解 workbook 結構

- Identify candidate sheets with questionnaire content
- Detect header rows
- Detect question rows versus category rows
- Map relevant columns

### Step 2：Normalize

目標：標準化題目

- Clean merged or wrapped text
- Normalize mixed Chinese and English labels
- Extract requirement keywords
- Classify question type

### Step 3：Assign Owner

目標：先預測 IEC responsible function

- Match keywords against function-responsibility mapping
- Compare with historical answered questionnaires
- Infer likely owner from evidence PPT metadata

### Step 4：Retrieve

目標：找到最佳證據

#### Retrieval Priority

1. Historical questionnaires
2. Evidence PPT
3. VDA 6.3 PDF
4. IATF 16949 PDF

#### Actions

- Retrieve top relevant chunks
- Rank by similarity, source type, and document freshness
- Prefer direct past answers over generic standard text

### Step 5：Generate

目標：生成 answer package

- Draft responsible function
- Draft score suggestion
- Draft long-form answer
- Add evidence summary
- Add citations and document number
- Set confidence

### Step 6：Fallback

目標：證據不足時仍輸出可用結果

- Suggest likely responsible function
- Generate recommended response using VDA 6.3 or IATF 16949 principles
- Flag the gap clearly
- Mark confidence as low

## 十三、AI 回答邏輯

AI 不應只輸出答案，而應輸出結構化結果。

### 標準回答結構

1. `responsible_function`
2. `score`
3. `answer_text`
4. `evidence`
5. `source_reference`
6. `confidence`

### 範例

```text
Direct Answer:
Yes. Inventec manages warranty-related issues through a formal NTF handling process.

Evidence:
Procedure: AME-QP-045
Section: NTF Handling Flow
Owner: CQE + MP Team

Confidence:
High
```

### 回答政策

- Do not fabricate internal facts
- Prefer internal historical evidence over generic standard interpretation
- Always include source references if an answer is pre-filled
- Separate factual evidence from AI suggestion
- If direct evidence is missing, explicitly mark as suggestion

## 十四、沒有資料時的 AI 行為

若 AI 找不到足夠直接證據，應產出 fallback 結構，而不是亂編。

### Fallback Structure

1. `possible_responsible_function`
2. `suggested_answer`
3. `standard_basis`
4. `gap_note`
5. `confidence`

### 範例

```text
No direct internal reference found.

Suggested response:
Inventec evaluates customer requirements through APQP review
and implements necessary process updates before SOP.

Action recommended:
Confirm with AQE or Quality system owner.
```

## 十五、輸出設計

### Preferred Output Mode

- `write_back_to_customer_excel`
- 條件：答案儲存格可被可靠辨識時

### Fallback Output Mode

- `review_excel_batch_output`
- 條件：layout 過於複雜、merged cells 太多、sheet 保護或位置不明確

### Output Record Fields

- `sheet_name`
- `row_identifier`
- `question_id`
- `original_question`
- `normalized_question`
- `iec_responsible_function`
- `pic_if_available`
- `suggested_score`
- `pre_filled_answer`
- `evidence_summary`
- `document_number`
- `source_references`
- `confidence_level`
- `status`
- `gap_note`
- `review_comment`

### Confidence Levels

- `high`
- `medium`
- `low`

### Status Values

- `auto_filled`
- `suggested_only`
- `needs_review`
- `insufficient_evidence`

## 十六、UI / Review Workflow

### 工程師需要看到的欄位

- Question
- AI answer
- Evidence
- Confidence

### Review Screen / Sheet 欄位

- `original_question`
- `suggested_responsible_function`
- `suggested_score`
- `pre_filled_answer`
- `source_references`
- `confidence`
- `gap_note`

### 工程師可執行動作

- `approve`
- `edit`
- `reject`
- `reassign_responsible_function`
- `adjust_score`
- `replace_evidence`

### Review Priority

- Low confidence items first
- Items without direct historical evidence first
- Items with ambiguous responsible function first

## 十七、Excel 回寫策略

### 原則

- 僅在 answer columns 可被高信心 mapping 時，才嘗試 direct write-back
- 不覆寫未知儲存格
- 儘量保留原始格式
- 寫回時建立複本，不直接改原始檔
- 若 workbook 過於 irregular，則改輸出 review workbook

### Fallback Review Workbook Columns

- `source_workbook`
- `sheet_name`
- `row_number`
- `question_id`
- `question_text`
- `responsible_function`
- `score`
- `answer_text`
- `evidence_summary`
- `document_number`
- `source_reference`
- `confidence`
- `status`
- `review_comment`

## 十八、知識庫設計

### Collections

#### `historical_questionnaires`

- `customer_name`
- `questionnaire_name`
- `year`
- `revision`
- `language`
- `sheet_name`
- `question_id`
- `responsible_function`
- `document_number`

#### `vda63_reference`

- `document_title`
- `section`
- `subsection`
- `page`
- `language`
- `version`

#### `iatf16949_reference`

- `document_title`
- `clause`
- `subclause`
- `page`
- `language`
- `version`

#### `evidence_ppt`

- `file_name`
- `slide_number`
- `customer_name_if_any`
- `question_topic`
- `responsible_function`
- `pic`
- `document_number_if_any`

#### `responsibility_mapping`

- `keyword`
- `responsible_function`
- `backup_function`
- `notes`

### Indexing Strategy

#### Chunking

- Historical questionnaires：by question-answer record
- PDFs：by section or subsection
- PPT：by slide
- Word：by heading and paragraph group

#### Search Modes

- semantic search
- keyword search
- metadata filter

## 十九、技術架構建議

### MVP Backend

- Python
- FastAPI

### Document Processing

- `openpyxl`
- `pandas`
- `python-docx`
- `python-pptx`
- `pymupdf` 或 `pdfplumber`
- OCR engine（optional）

### Retrieval

- FAISS 或 Chroma for MVP
- Embedding model

### LLM Usage

- Parsing prompt
- Question normalization prompt
- Responsible function prediction prompt
- Answer generation prompt

### Frontend

- Streamlit for fast internal MVP
- 或簡單 Web UI

### Storage

- Local file storage for MVP
- SQLite 或 PostgreSQL 作 metadata store

## 二十、最簡單可行版本（MVP）

### MVP Included

- Upload one customer Excel questionnaire
- Parse multi-sheet workbook
- Extract questions
- Predict responsible function
- Retrieve from historical questionnaires, VDA 6.3 PDFs, IATF 16949 PDFs, evidence PPTs
- Generate pre-filled review output
- Include source references and confidence

### MVP Excluded

- Perfect write-back for every customer workbook
- Full support for all image-only evidence
- Automatic final submission without engineer review
- Enterprise-wide multi-department workflow

### MVP 最小流程

```text
Excel 問卷上傳
→ 擷取問題
→ 搜尋企業文件
→ 生成回答
→ 顯示審查畫面
→ 匯出 review Excel
```

## 二十一、功能需求

### Must Have

- Excel questionnaire structure parsing
- Question extraction
- Responsible function recommendation
- Historical questionnaire retrieval
- VDA 6.3 retrieval support
- IATF 16949 retrieval support
- Evidence PPT retrieval support
- Source citation output
- Confidence scoring
- Batch engineer review workflow

### Nice to Have

- Direct write-back to original Excel
- Question type classification
- Language normalization between Chinese and English
- Version-aware document selection
- Responsible function learning from prior reviews

## 二十二、非功能需求

### Accuracy

- Traceable source citations
- No unsupported claims
- Engineer review before final use

### Security

- Internal-use only
- Access control for uploaded files
- No external sharing of customer data

### Usability

- Batch processing
- Excel-centered workflow
- Minimal manual formatting effort

### Maintainability

- Configurable column mapping rules
- Extensible knowledge source indexing
- Versionable prompts

## 二十三、這個工具的價值

### 1. 回答速度

- 原本：1 份問卷可能需要 3～5 天
- AI 導入後：有機會縮短至約 30 分鐘

### 2. 回答一致性

- 降低不同工程師版本不一致問題

### 3. 知識沉澱

- 回答結果可持續累積為 Supplier Knowledge Base

### 4. 新人可快速上手

- 不需要 5 年 CQE 經驗才能完成初稿

## 二十四、車用品質場景特別重要的要求

AI 不能亂編，必須有 Citation System。

### Citation 建議欄位

- Source document
- Section
- Paragraph

### 核心原則

- 先找證據，再生成答案
- 每一題都要可追溯
- 無資料時不可假設為內部事實
- 工程師保有最終決定權

## 二十五、三階段推進建議

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
- 讓未來新問卷可達到 80% 自動回答

## 二十六、未來擴充方向

- Learn from engineer edits to improve future responsible function prediction
- Template memory by customer
- Better OCR for image-heavy evidence
- Bilingual answer style control
- Dashboard for unresolved gaps
- Version comparison between old and new questionnaires

## 二十七、Codex 開發任務拆解

### T01：Create project skeleton

- Python backend with modular folders for ingestion, parsing, retrieval, generation, and export

### T02：Build Excel parser

- Module that scans workbook and extracts candidate question rows across multiple sheets

### T03：Build document ingestion pipeline

- Load and chunk PDF, PPT, Word, TXT, and image OCR outputs into a searchable knowledge store

### T04：Build retrieval layer

- Semantic plus metadata retrieval over indexed knowledge sources

### T05：Build answer generation pipeline

- Structured output per question with responsible function, score, answer, evidence, citations, and confidence

### T06：Build review Excel exporter

- Batch review workbook with structured columns for engineer validation

### T07：Build conditional write-back engine

- Safe write-back to customer Excel only when answer columns are confidently identified

### T08：Add configuration files

- Configurable mappings for column keywords, responsible functions, document priorities, and prompts

## 二十八、Sample Output Schema

```json
{
  "sheet_name": "string",
  "row_number": "integer",
  "question_id": "string",
  "original_question": "string",
  "normalized_question": "string",
  "iec_responsible_function": "string",
  "pic": "string_or_null",
  "suggested_score": "string_or_number",
  "pre_filled_answer": "string",
  "evidence_summary": "string",
  "document_number": "string_or_null",
  "source_references": [
    {
      "source_type": "historical_questionnaire|vda63|iatf16949|evidence_ppt|other",
      "file_name": "string",
      "location": "sheet_or_page_or_slide",
      "excerpt": "string"
    }
  ],
  "confidence_level": "high|medium|low",
  "status": "auto_filled|suggested_only|needs_review|insufficient_evidence",
  "gap_note": "string_or_null",
  "review_comment": "string_or_null"
}
```

## 二十九、總結

這是一套最適合從車廠 Self-Assessment / Supplier Audit Questionnaire 場景切入的 AI 問卷自動填答系統。

第一階段不追求完全自動提交，而是追求：

- 高可追溯性
- 高可審查性
- 高可落地性

先做好 MVP，再逐步擴充到：

- direct write-back
- audit evidence package
- OEM questionnaire library
