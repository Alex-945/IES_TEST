#!/usr/bin/env python3
"""
Zero-dependency local web app (Python stdlib only).
Run: python3 lite_app/server.py
Open: http://127.0.0.1:8787
"""
from __future__ import annotations

import html
import json
import os
import sqlite3
from datetime import datetime
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "lite_workbench.db")
HOST = "127.0.0.1"
PORT = 8787


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                planning_json TEXT DEFAULT '{}',
                draft_text TEXT DEFAULT '',
                created_at TEXT NOT NULL
            )
            """
        )


def page_layout(title: str, body: str) -> bytes:
    return f"""<!doctype html>
<html><head>
<meta charset='utf-8'/>
<title>{html.escape(title)}</title>
<style>
body{{font-family:Arial,sans-serif;max-width:900px;margin:24px auto;padding:0 16px;}}
.card{{border:1px solid #ddd;border-radius:10px;padding:12px;margin-bottom:12px;}}
input,textarea{{width:100%;padding:8px;margin:6px 0;box-sizing:border-box;}}
button{{padding:8px 12px;cursor:pointer;}}
a{{text-decoration:none;color:#2563eb;}}
pre{{white-space:pre-wrap;background:#f7f7f7;padding:8px;border-radius:8px;}}
.small{{font-size:12px;color:#666;}}
</style>
</head><body>
<h1>Novel Workbench Lite（零額外套件）</h1>
<p class='small'>資料儲存在：{html.escape(DB_PATH)}</p>
{body}
</body></html>""".encode("utf-8")


class Handler(BaseHTTPRequestHandler):
    def _send_html(self, title: str, body: str, status=HTTPStatus.OK):
        out = page_layout(title, body)
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(out)))
        self.end_headers()
        self.wfile.write(out)

    def _redirect(self, location: str):
        self.send_response(HTTPStatus.SEE_OTHER)
        self.send_header("Location", location)
        self.end_headers()

    def do_GET(self):
        p = urlparse(self.path)
        if p.path == "/":
            with db() as conn:
                rows = conn.execute("SELECT id,title,description,created_at FROM projects ORDER BY id DESC").fetchall()
            cards = "".join(
                f"<div class='card'><b>{html.escape(r['title'])}</b><br/>{html.escape(r['description'] or '')}<br/>"
                f"<a href='/project?id={r['id']}'>開啟</a> ｜ <a href='/export?id={r['id']}'>導出TXT</a> ｜ <a href='/backup?id={r['id']}'>備份JSON</a></div>"
                for r in rows
            ) or "<p>目前沒有專案。</p>"
            body = f"""
<div class='card'>
<form method='post' action='/create'>
<h3>建立專案</h3>
<input name='title' placeholder='專案名稱' required/>
<textarea name='description' placeholder='描述'></textarea>
<button type='submit'>建立</button>
</form>
</div>
<div class='card'>
<form method='post' action='/import'>
<h3>從本地貼上 JSON 備份匯入</h3>
<textarea name='payload' rows='8' placeholder='貼上 backup JSON'></textarea>
<button type='submit'>匯入</button>
</form>
</div>
{cards}
"""
            return self._send_html("Projects", body)

        if p.path == "/project":
            pid = int(parse_qs(p.query).get("id", ["0"])[0])
            with db() as conn:
                row = conn.execute("SELECT * FROM projects WHERE id=?", (pid,)).fetchone()
            if not row:
                return self._send_html("Not found", "<p>專案不存在</p>", HTTPStatus.NOT_FOUND)
            body = f"""
<p><a href='/'>← 返回列表</a></p>
<div class='card'>
<form method='post' action='/save?id={pid}'>
<h3>{html.escape(row['title'])}</h3>
<p>策劃 JSON</p>
<textarea name='planning_json' rows='12'>{html.escape(row['planning_json'] or '{}')}</textarea>
<p>正文草稿</p>
<textarea name='draft_text' rows='12'>{html.escape(row['draft_text'] or '')}</textarea>
<button type='submit'>保存</button>
</form>
</div>
<div class='card'><a href='/export?id={pid}'>下載 TXT</a> ｜ <a href='/backup?id={pid}'>下載 JSON 備份</a></div>
"""
            return self._send_html("Project", body)

        if p.path == "/export":
            pid = int(parse_qs(p.query).get("id", ["0"])[0])
            with db() as conn:
                row = conn.execute("SELECT title,draft_text FROM projects WHERE id=?", (pid,)).fetchone()
            if not row:
                self.send_error(404)
                return
            content = (row["draft_text"] or "").encode("utf-8")
            filename = f"project-{pid}.txt"
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Disposition", f"attachment; filename={filename}")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        if p.path == "/backup":
            pid = int(parse_qs(p.query).get("id", ["0"])[0])
            with db() as conn:
                row = conn.execute("SELECT * FROM projects WHERE id=?", (pid,)).fetchone()
            if not row:
                self.send_error(404)
                return
            payload = dict(row)
            out = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Disposition", f"attachment; filename=project-{pid}-backup.json")
            self.send_header("Content-Length", str(len(out)))
            self.end_headers()
            self.wfile.write(out)
            return

        self.send_error(404)

    def do_POST(self):
        p = urlparse(self.path)
        size = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(size).decode("utf-8")
        form = {k: v[0] for k, v in parse_qs(raw).items()}

        if p.path == "/create":
            title = (form.get("title") or "未命名專案").strip()
            desc = (form.get("description") or "").strip()
            with db() as conn:
                conn.execute(
                    "INSERT INTO projects(title,description,created_at) VALUES(?,?,?)",
                    (title, desc, datetime.utcnow().isoformat()),
                )
            return self._redirect("/")

        if p.path == "/save":
            pid = int(parse_qs(p.query).get("id", ["0"])[0])
            planning = form.get("planning_json", "{}")
            draft = form.get("draft_text", "")
            with db() as conn:
                conn.execute("UPDATE projects SET planning_json=?, draft_text=? WHERE id=?", (planning, draft, pid))
            return self._redirect(f"/project?id={pid}")

        if p.path == "/import":
            text = form.get("payload", "").strip()
            try:
                data = json.loads(text)
                title = str(data.get("title") or "匯入專案")
                desc = str(data.get("description") or "")
                planning = json.dumps(data.get("planning_json") if isinstance(data.get("planning_json"), (dict, list)) else data.get("planning_json", {}), ensure_ascii=False)
                draft = str(data.get("draft_text") or "")
            except Exception:
                return self._send_html("Import Error", "<p>JSON 格式錯誤，請返回重試。</p>")
            with db() as conn:
                conn.execute(
                    "INSERT INTO projects(title,description,planning_json,draft_text,created_at) VALUES(?,?,?,?,?)",
                    (title, desc, planning, draft, datetime.utcnow().isoformat()),
                )
            return self._redirect("/")

        self.send_error(404)


if __name__ == "__main__":
    init_db()
    print(f"Serving on http://{HOST}:{PORT}")
    HTTPServer((HOST, PORT), Handler).serve_forever()
