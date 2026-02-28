"use client";

export function GapPanel({ gaps }: { gaps: string[] }) {
  return (
    <div className="card">
      <h3 className="mb-2 text-sm font-semibold">Gap List</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {gaps.map((gap) => (
          <li key={gap}>{gap}</li>
        ))}
      </ul>
    </div>
  );
}
