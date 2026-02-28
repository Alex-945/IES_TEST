# Novel Workbench Lite (No Node.js)

這是純前端版本，不需安裝 Node.js。直接用瀏覽器打開即可使用。

## 1) 試跑

1. 進入資料夾：`d:\IES_TEST\project_naval_generator`
2. 直接雙擊 `index.html`（或右鍵用 Chrome/Edge 開啟）

## 2) 使用方式

- 左側建立專案（Project）
- 上方可切換流程階段：
  - `PLANNING -> BIBLE -> OUTLINE -> CHAPTER_PLAN -> DRAFT -> QA -> EXPORT`
- 工作區可直接編輯 JSON，按「儲存版本」會進入該階段版本歷史
- 「產生 QA 建議」會根據 `DRAFT/BIBLE` 給出結構化 QA 草稿

## 3) 資料保存

- 平常自動存於瀏覽器 `localStorage`
- 可按「匯出專案 JSON」備份
- 可按「匯入專案 JSON」還原

## 4) 落地到同層 data 資料夾

可行流程（Chrome/Edge）：

1. 點「選擇 data 資料夾」
2. 手動選擇你專案同層的資料夾（建議選 `project_naval_generator`）
3. 再按「匯出專案 JSON」
4. 檔案會寫入：`<你選的資料夾>/data/exports/*.json`

> 由於瀏覽器安全限制，第一次一定要手動授權資料夾，不能在程式內硬編路徑。

## 5) 檔案

- `index.html`: 入口與畫面
- `styles.css`: 樣式
- `app.js`: 狀態機、版本歷史、QA 提示、匯入匯出

## 6) 注意

- 這是公司環境可跑的「免安裝」版本，不含 Next.js/Prisma/SQLite/LLM API。
- 若之後你可安裝 Node.js，我可以再切回完整全端版。
