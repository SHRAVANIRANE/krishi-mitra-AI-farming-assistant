export default function FarmSummary({ summary }) {
  if (!summary) {
    return null;
  }

  const total = Number(summary.total_fields || 0);
  const healthy = Math.max(total - Number(summary.diseased_fields || 0), 0);
  const diseased = Number(summary.diseased_fields || 0);
  const healthyPct = Number(summary.healthy_percentage || 0);

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white shadow-lg">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Overall Farm Health</h3>
          <p className="mt-2 text-4xl font-bold leading-none">{healthyPct}%</p>
          <p className="mt-2 text-sm text-emerald-100">
            Based on {total} total scan{total === 1 ? "" : "s"}
          </p>
        </div>

        <div className="min-w-[180px] rounded-xl bg-white/15 p-4 backdrop-blur">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-emerald-100">Healthy</span>
            <span className="font-semibold">{healthy}</span>
          </div>
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full bg-white"
              style={{ width: `${Math.max(0, Math.min(100, healthyPct))}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-emerald-100">Need Attention</span>
            <span className="font-semibold">{diseased}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
