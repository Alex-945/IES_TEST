# Automotive Self-Assessment Pre-Fill AI－MVP 開發規格書

## 一、專案定位

### Project Name

`Automotive_Self_Assessment_PreFill_AI`

### Project Goal

建立一套內部 AI 工具，用於預填客戶 Self-Assessment Excel 問卷，供工程師審查與修正。

### Primary Objectives

- 優先判定 IEC 負責單位或 responsible function
- 根據可追溯資料來源預填答案
- 當無直接內部證據時，提供可能負責單位與建議回答

### Scope

- 使用者：僅限內部部門
- 階段：先做 MVP
- 優先輸出：若可行則直接回寫客戶 Excel，否則輸出批次審查檔供工程師 review

## 二、商業情境與輸入特性

### 問卷主格式

- 主要格式為 Excel
- 佔比接近 100%

### 問卷變異性

- 客戶模板不同
- 可能包含多個 sheets
- 中英文混合
- 評分方式不同
- 欄位布局不同

### 預期回答內容

- IEC responsible function 或 PIC（內部使用）
- Self-assessment score
- 長文字 evidence description
- Internal practice description
- Document number 或 reference ID

## 三、知識來源優先順序

### Priority 1：歷史問卷

- Previously answered customer questionnaires

### Priority 2：VDA 參考文件

- VDA 系列 PDF
- 初期聚焦 VDA 6.3

### Priority 3：IATF 16949 參考文件

- IATF 16949 PDF

### Priority 4：Evidence PPT

- 內容可能包含 responsible function、PIC、issue description、evidence images

## 四、檔案管理現況與建議

### Current State

- 現況為 scattered files

### Common Naming Elements

- Customer name
- Audit 或 questionnaire name

### Future Naming Rule 建議

- `customer_name`
- `questionnaire_name`
- `year`
- `revision`
- `language`
- `site_if_applicable`

## 五、系統架構風格

### Architecture Style

- Hybrid AI + rule-based pipeline

### High-Level Flow

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

## 六、核心引擎設計

### 1. Parsing AI

用途：理解問卷結構，辨識真正的問題列，而不是標題、備註或 metadata。

#### Key Tasks

- Detect sheets containing questions
- Identify question rows
- Map columns such as question, score, responsible function, answer, evidence
- Handle multilingual labels
- Handle irregular layouts

### 2. Retrieval Engine

用途：搜尋內部知識來源，找出最可能對應的答案與證據。

#### Key Tasks

- Historical questionnaires first
- Search VDA 6.3 and IATF 16949 references
- Search evidence PPTs
- Rank by relevance and recency

### 3. Generation AI

用途：依據檢索到的證據生成結構化預填內容。

#### Key Tasks

- Recommend IEC responsible function
- Suggest self-assessment score
- Draft evidence-based answer text
- Add document number and source references
- Provide fallback suggestion if evidence is missing

### 4. Rule Engine

用途：處理高穩定性、可規則化的任務，提高整體可靠度。

#### Key Tasks

- Excel column mapping heuristics
- Sheet classification
- Scoring field detection
- Output schema validation
- Confidence threshold routing

## 七、輸入設計

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
- Support scanned PDF via OCR if required

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

## 八、輸出設計

### Preferred Output Mode

- `write_back_to_customer_excel`
- 條件：當目標答案儲存格可以被可靠辨識時使用

### Fallback Output Mode

- `review_excel_batch_output`
- 條件：若版面太複雜、含 merged cells、protected sheets 或答案位置不明確時使用

### Output Record Per Question

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

## 九、功能需求

### Priority Order

1. Determine responsible function
2. Find answer and pre-fill with source references
3. If no direct evidence, propose possible responsible function and suggestion based on VDA or IATF guidance

### Must-Have Features

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

### Nice-to-Have Features

- Direct write-back to original Excel
- Question type classification
- Language normalization between Chinese and English
- Version-aware document selection
- Responsible function learning from prior reviews

## 十、問題處理流程

### Step 1：Parse

目標：理解 workbook 結構

#### Actions

- Identify candidate sheets with questionnaire content
- Detect header rows
- Detect question rows versus category rows
- Map relevant columns

### Step 2：Normalize

目標：將問題標準化以供後續檢索

#### Actions

- Clean merged or wrapped text
- Translate or normalize mixed Chinese and English labels if needed
- Extract requirement keywords
- Classify question type

### Step 3：Assign Owner

目標：先預測 IEC responsible function

#### Actions

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

目標：生成完整 answer package

#### Actions

- Draft responsible function
- Draft score suggestion
- Draft long-form answer
- Add evidence summary
- Add citations and document number
- Set confidence

### Step 6：Fallback

目標：在證據不足時仍提供有價值輸出

#### Actions

- Suggest likely responsible function
- Generate recommended response using VDA 6.3 or IATF 16949 principles
- Flag the gap clearly
- Mark confidence as low

## 十一、回答生成政策

### General Rules

- Do not fabricate internal facts
- Prefer internal historical evidence over generic standard interpretation
- Always include source references if an answer is pre-filled
- Separate factual evidence from AI suggestion
- If direct evidence is missing, explicitly mark as suggestion

### Standard Answer Structure

- `responsible_function`
- `score`
- `answer_text`
- `evidence`
- `source_reference`
- `confidence`

### Fallback Answer Structure

- `possible_responsible_function`
- `suggested_answer`
- `standard_basis`
- `gap_note`
- `confidence`

## 十二、知識庫設計

### Collections

#### 1. `historical_questionnaires`

Metadata fields：

- `customer_name`
- `questionnaire_name`
- `year`
- `revision`
- `language`
- `sheet_name`
- `question_id`
- `responsible_function`
- `document_number`

#### 2. `vda63_reference`

Metadata fields：

- `document_title`
- `section`
- `subsection`
- `page`
- `language`
- `version`

#### 3. `iatf16949_reference`

Metadata fields：

- `document_title`
- `clause`
- `subclause`
- `page`
- `language`
- `version`

#### 4. `evidence_ppt`

Metadata fields：

- `file_name`
- `slide_number`
- `customer_name_if_any`
- `question_topic`
- `responsible_function`
- `pic`
- `document_number_if_any`

#### 5. `responsibility_mapping`

Metadata fields：

- `keyword`
- `responsible_function`
- `backup_function`
- `notes`

### Indexing Strategy

#### Chunking

- Historical questionnaires：By question-answer record
- PDFs：By section or subsection
- PPT：By slide
- Word：By heading and paragraph group

#### Search Modes

- semantic search
- keyword search
- metadata filter

## 十三、Review Workflow

### Review Required

- 工程師 review 為必要流程

### Review Actions

- `approve`
- `edit`
- `reject`
- `reassign_responsible_function`
- `adjust_score`
- `replace_evidence`

### Review Fields

- `original_question`
- `suggested_responsible_function`
- `suggested_score`
- `pre_filled_answer`
- `source_references`
- `confidence`
- `gap_note`

### Review Priority Rules

- Low confidence items first
- Items without direct historical evidence first
- Items with ambiguous responsible function first

## 十四、Excel 回寫策略

### Mode

- `conditional`

### Rules

- Attempt direct write-back only when answer columns are confidently mapped
- Do not overwrite unknown cells
- Preserve original workbook formatting when possible
- Create a copied output file instead of modifying source in place
- If workbook is too irregular, export review workbook instead

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

## 十五、建議技術堆疊

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

- FAISS 或 Chroma（MVP）
- Embedding model

### LLM Usage

- Parsing prompt
- Question normalization prompt
- Responsible function prediction prompt
- Answer generation prompt

### Frontend Options

- Streamlit for fast internal MVP
- Simple web UI if needed

### Storage

- Local file storage for MVP
- Metadata store in SQLite 或 PostgreSQL

## 十六、非功能需求

### Accuracy

優先級：高

- Traceable source citations
- No unsupported claims
- Engineer review before final use

### Security

優先級：高

- Internal-use only
- Access control for uploaded files
- No external sharing of customer data

### Usability

優先級：高

- Batch processing
- Excel-centered workflow
- Minimal manual formatting effort

### Maintainability

優先級：中

- Configurable column mapping rules
- Extensible knowledge source indexing
- Versionable prompts

## 十七、MVP 定義

### Included

- Upload one customer Excel questionnaire
- Parse multi-sheet workbook
- Extract questions
- Predict responsible function
- Retrieve from historical questionnaires, VDA 6.3 PDFs, IATF 16949 PDFs, evidence PPTs
- Generate pre-filled review output
- Include source references and confidence

### Excluded for Initial MVP

- Perfect write-back for every customer workbook
- Full support for all image-only evidence
- Automatic final submission without engineer review
- Enterprise-wide multi-department workflow

## 十八、未來擴充方向

- Learn from engineer edits to improve future responsible function prediction
- Template memory by customer
- Better OCR for image-heavy evidence
- Bilingual answer style control
- Dashboard for unresolved gaps
- Version comparison between old and new questionnaires

## 十九、Codex 開發任務拆解

### T01：Create project skeleton

Deliverable：

- Python backend with modular folders for ingestion, parsing, retrieval, generation, and export

### T02：Build Excel parser

Deliverable：

- Module that scans workbook and extracts candidate question rows across multiple sheets

### T03：Build document ingestion pipeline

Deliverable：

- Load and chunk PDF, PPT, Word, TXT, and image OCR outputs into a searchable knowledge store

### T04：Build retrieval layer

Deliverable：

- Semantic plus metadata retrieval over indexed knowledge sources

### T05：Build answer generation pipeline

Deliverable：

- Structured output per question with responsible function, score, answer, evidence, citations, and confidence

### T06：Build review Excel exporter

Deliverable：

- Batch review workbook with structured columns for engineer validation

### T07：Build conditional write-back engine

Deliverable：

- Safe write-back to customer Excel only when answer columns are confidently identified

### T08：Add configuration files

Deliverable：

- Configurable mappings for column keywords, responsible functions, document priorities, and prompts

## 二十、Sample Output Schema

### Question Record

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

## 二十一、建議文件關聯

這份文件可搭配以下檔案一起使用：

- `project_cqe_qnrhelper/AI_問卷自動填答系統企劃.md`
- `project_cqe_qnrhelper/系統架構圖說明.md`

建議用途：

- 本文件：作為 MVP 需求與開發規格
- 系統架構圖說明：作為架構提案與設計說明
- 企劃文件：作為簡報、提案或管理層溝通版本
