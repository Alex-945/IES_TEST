from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class ParsedCell(BaseModel):
    row: int
    column: int
    coordinate: str
    value: str


class ParsedQuestionRecord(BaseModel):
    sheet_name: str
    row_number: int
    question_id: str | None = None
    original_question: str
    normalized_question: str
    row_type: Literal["question", "category"] = "question"
    candidate_score: str | None = None
    candidate_answer: str | None = None
    candidate_owner: str | None = None
    confidence: Literal["high", "medium", "low"] = "low"
    source_cells: list[ParsedCell] = Field(default_factory=list)


class ParsedSheet(BaseModel):
    sheet_name: str
    is_candidate_sheet: bool
    is_hidden: bool = False
    header_row: int | None = None
    detected_columns: dict[str, int] = Field(default_factory=dict)
    row_count: int
    question_count: int
    category_count: int = 0
    notes: list[str] = Field(default_factory=list)
    questions: list[ParsedQuestionRecord] = Field(default_factory=list)


class ParseResult(BaseModel):
    workbook_name: str
    total_sheets: int
    candidate_sheet_count: int
    question_count: int
    sheets: list[ParsedSheet]
