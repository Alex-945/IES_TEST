-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'PLANNING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "PlanningSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "json" JSON NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "PlanningSnapshot_projectId_version_key" ON "PlanningSnapshot"("projectId", "version");
CREATE INDEX "PlanningSnapshot_projectId_idx" ON "PlanningSnapshot"("projectId");

CREATE TABLE "BibleVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "json" JSON NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "BibleVersion_projectId_version_key" ON "BibleVersion"("projectId", "version");
CREATE INDEX "BibleVersion_projectId_idx" ON "BibleVersion"("projectId");

CREATE TABLE "OutlineVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "json" JSON NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "OutlineVersion_projectId_version_key" ON "OutlineVersion"("projectId", "version");
CREATE INDEX "OutlineVersion_projectId_idx" ON "OutlineVersion"("projectId");

CREATE TABLE "ChapterPlanVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "json" JSON NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ChapterPlanVersion_projectId_version_key" ON "ChapterPlanVersion"("projectId", "version");
CREATE INDEX "ChapterPlanVersion_projectId_idx" ON "ChapterPlanVersion"("projectId");

CREATE TABLE "ChapterDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "chapterNo" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "params" JSON,
    "promptHash" TEXT,
    "refs" JSON,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ChapterDraft_projectId_chapterNo_version_key" ON "ChapterDraft"("projectId", "chapterNo", "version");
CREATE INDEX "ChapterDraft_projectId_chapterNo_idx" ON "ChapterDraft"("projectId", "chapterNo");

CREATE TABLE "ChapterSummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "chapterNo" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ChapterSummary_projectId_chapterNo_version_key" ON "ChapterSummary"("projectId", "chapterNo", "version");
CREATE INDEX "ChapterSummary_projectId_chapterNo_idx" ON "ChapterSummary"("projectId", "chapterNo");

CREATE TABLE "QAReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "chapterNo" INTEGER NOT NULL,
    "draftVersion" INTEGER,
    "json" JSON NOT NULL,
    "scores" JSON,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "QAReport_projectId_chapterNo_idx" ON "QAReport"("projectId", "chapterNo");

CREATE TABLE "ExperimentRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rounds" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ExperimentRun_projectId_idx" ON "ExperimentRun"("projectId");

CREATE TABLE "ExperimentResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runId" TEXT NOT NULL,
    "chapterNo" INTEGER NOT NULL,
    "variantName" TEXT NOT NULL,
    "draftText" TEXT NOT NULL,
    "qaJson" JSON,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("runId") REFERENCES "ExperimentRun" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ExperimentResult_runId_idx" ON "ExperimentResult"("runId");

CREATE TABLE "ExportRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ExportRecord_projectId_idx" ON "ExportRecord"("projectId");

CREATE TABLE "GenerationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "promptHash" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "params" JSON,
    "refs" JSON,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "GenerationLog_projectId_task_idx" ON "GenerationLog"("projectId", "task");
