"use client";

export function VersionHistory({
  title,
  items,
  onPick
}: {
  title: string;
  items: Array<{ version: number; createdAt: string }>;
  onPick?: (version: number) => void;
}) {
  return (
    <div className="card">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <div className="space-y-2 text-sm">
        {items.length === 0 && <div className="text-slate-500">©|µLª©¥»</div>}
        {items.map((item) => (
          <button
            key={item.version}
            className="w-full rounded border border-slate-200 p-2 text-left hover:bg-slate-50"
            onClick={() => onPick?.(item.version)}
          >
            <div>v{item.version}</div>
            <div className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
