"use client";

import { useState } from "react";

export default function ExperimentsPage({ params }: { params: { id: string } }) {
  const [times, setTimes] = useState(2);
  const [result, setResult] = useState<any>(null);

  async function run() {
    const res = await fetch(`/api/projects/${params.id}/experiments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ times })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "試點失敗");
    setResult(data);
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="font-semibold">批量試點（前3章）</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm">每章生成次數</span>
          <input className="w-20 rounded border px-2 py-1" type="number" value={times} onChange={(e) => setTimes(Number(e.target.value))} />
          <button className="btn" onClick={run}>開始批量試點</button>
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold">比較結果（兩版本）</h3>
        <pre className="mt-2 whitespace-pre-wrap text-xs">{result ? JSON.stringify(result, null, 2) : "尚未執行"}</pre>
      </div>
    </div>
  );
}
