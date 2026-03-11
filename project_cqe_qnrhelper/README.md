# Automotive Self-Assessment Pre-Fill AI

MVP backend skeleton for parsing automotive customer Excel questionnaires and producing review-ready structured output.

## Current scope

- Python project skeleton
- Initial Excel workbook parser
- Heuristic sheet detection
- Heuristic question row extraction
- Hidden sheet detection
- Basic category row detection
- Merged cell value recovery
- JSON-ready structured records for downstream retrieval and generation

## Quick start

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -e .[dev]
qnrhelper parse path\to\questionnaire.xlsx
```

## Project structure

```text
src/automotive_prefill_ai/
  cli.py
  models/
  parsing/
  retrieval/
  generation/
  export/
  config/
```
