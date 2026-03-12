import { workflowProgress } from "@/lib/workflow";

export function WorkflowDashboard({ state }: { state: string }) {
  const progress = workflowProgress(state);
  const meters = [
    ["衝突完整度", Math.min(100, progress + 5)],
    ["世界規則完整度", Math.min(100, progress)],
    ["角色弧完整度", Math.min(100, progress - 5)],
    ["商業鉤子密度", Math.min(100, progress + 10)]
  ] as const;
  return (
    <div className="card space-y-2">
      <p>目前狀態：<b>{state}</b>（{progress}%）</p>
      {meters.map(([name, v]) => <p key={name}>{name}: {Math.max(v,0)}%</p>)}
    </div>
  );
}
