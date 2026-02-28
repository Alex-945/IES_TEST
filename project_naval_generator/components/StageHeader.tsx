"use client";

import Link from "next/link";
import { STAGES, Stage, stageRoutes } from "@/lib/types";

export function StageHeader({ projectId, stage }: { projectId: string; stage: Stage }) {
  return (
    <div className="card mb-4">
      <div className="text-sm text-slate-500">Workflow</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <Link
            key={s}
            href={`/projects/${projectId}/${stageRoutes[s]}`}
            className={`rounded-full px-3 py-1 text-xs ${
              s === stage ? "bg-ink text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>
    </div>
  );
}
