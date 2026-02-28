"use client";

import { useState } from "react";

export default function ExportPage({ params }: { params: { id: string } }) {
  const [type, setType] = useState("markdown_full");
  const [resp, setResp] = useState<any>(null);

  async function runExport() {
    const res = await fetch(`/api/projects/${params.id}/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "匯出失敗");
    setResp(data);
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <h3 className="font-semibold">導出 Markdown / TXT</h3>
        <select className="rounded border px-2 py-1" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="markdown_full">Markdown 整本</option>
          <option value="markdown_split">Markdown 分章</option>
          <option value="txt_full">TXT 整本</option>
          <option value="txt_split">TXT 分章</option>
        </select>
        <button className="btn" onClick={runExport}>導出到 ./data/exports</button>
      </div>
      <div className="card">
        <h3 className="font-semibold">導出結果</h3>
        <pre className="mt-2 whitespace-pre-wrap text-xs">{resp ? JSON.stringify(resp, null, 2) : "尚未導出"}</pre>
      </div>
    </div>
  );
}
