import { RTS_RPE_LEVELS, RTS_REP_RANGE, RTS_RPE_TABLE } from "@/lib/rpe/rtstable";

export function RpeTable() {
  return (
    <div className="mt-3 rounded-md border border-zinc-200 bg-white/60 p-3">
      <div className="mb-2 text-xs font-semibold text-zinc-700">
        RTS RPE‑Tabelle (%1RM)
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[720px] border-collapse text-[11px]">
          <thead>
            <tr>
              <th className="border-b border-r border-zinc-200 px-2 py-1 text-left">
                RPE \\ Reps
              </th>
              {RTS_REP_RANGE.map((rep) => (
                <th
                  key={rep}
                  className="border-b border-r border-zinc-200 px-2 py-1 text-center"
                >
                  {rep}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RTS_RPE_LEVELS.map((rpe) => (
              <tr key={rpe}>
                <td className="border-r border-zinc-200 bg-blue-50 px-2 py-1 font-semibold">
                  {rpe}
                </td>
                {RTS_REP_RANGE.map((rep) => {
                  const pct = RTS_RPE_TABLE[rep][String(rpe)];
                  const text = pct != null ? `${(pct * 100).toFixed(1)}%` : "–";
                  return (
                    <td
                      key={`${rpe}-${rep}`}
                      className="border-r border-zinc-200 px-2 py-1 text-center text-zinc-700"
                    >
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[10px] text-zinc-500">
        Quelle: RTS RPE Chart (via rpecalculator.com). Werte sind Richtwerte und
        variieren individuell.
      </p>
    </div>
  );
}
