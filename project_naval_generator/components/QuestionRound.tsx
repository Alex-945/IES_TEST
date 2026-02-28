"use client";

export function QuestionRound({
  items
}: {
  items: Array<{ id: number; question: string; why: string; risk: string; format: string }>;
}) {
  return (
    <div className="card">
      <h3 className="mb-2 text-sm font-semibold">編輯式追問（最多3題）</h3>
      <div className="space-y-3 text-sm">
        {items.map((q) => (
          <div key={q.id} className="rounded border border-slate-200 p-3">
            <div className="font-medium">Q{q.id}. {q.question}</div>
            <div className="mt-1 text-slate-600">為何要問：{q.why}</div>
            <div className="text-slate-600">不答風險：{q.risk}</div>
            <div className="text-slate-600">建議格式：{q.format}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
