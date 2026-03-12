from __future__ import annotations

import argparse
import json
from pathlib import Path

from automotive_prefill_ai.parsing.excel_parser import ExcelQuestionnaireParser


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="qnrhelper")
    subparsers = parser.add_subparsers(dest="command", required=True)

    parse_parser = subparsers.add_parser("parse", help="Parse questionnaire workbook")
    parse_parser.add_argument("workbook", type=Path, help="Path to xlsx/xlsm workbook")
    parse_parser.add_argument(
        "--pretty",
        action="store_true",
        help="Pretty-print JSON output",
    )

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "parse":
        result = ExcelQuestionnaireParser().parse(args.workbook)
        indent = 2 if args.pretty else None
        print(json.dumps(result.model_dump(mode="json"), ensure_ascii=False, indent=indent))


if __name__ == "__main__":
    main()
