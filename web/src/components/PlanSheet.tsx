import type { Plan } from "@/lib/domain/types";

interface Props {
  plan: Plan;
  feasibilityMessage?: string;
}

export function PlanSheet({ plan, feasibilityMessage }: Props) {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 py-4 sm:py-8">
      <div className="mx-2 w-full max-w-5xl rounded-lg bg-white p-4 shadow-lg sm:mx-4 sm:rounded-xl sm:p-8">
        <header className="mb-6 flex flex-col justify-between gap-2 border-b border-zinc-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">
              12-Wochen Bankdrückplan
            </h1>
            <p className="text-xs text-zinc-500">
              Plan-Generator v1 – deterministisch, template-basiert
            </p>
          </div>
          <div className="text-right text-xs text-zinc-600">
            <div>Stand: {plan.meta.standDate}</div>
            <div>TM: {plan.meta.tmKg} kg</div>
            <div>Ziel-1RM: {plan.meta.target1RmKg} kg</div>
          </div>
        </header>

        {feasibilityMessage && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            {feasibilityMessage}
          </div>
        )}

        <div className="space-y-8">
          {plan.blocks.map((block) => (
            <section key={block.blockIndex}>
              <h2 className="text-lg font-semibold text-zinc-900">
                {block.blockTitle}
              </h2>
              {block.blockSubtitle && (
                <p className="mb-2 text-sm text-zinc-600">
                  {block.blockSubtitle}
                </p>
              )}

              <div className="mt-3 overflow-x-auto rounded-md border border-zinc-200">
                <table className="min-w-[1100px] border-collapse text-xs leading-snug">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="border-b border-r border-zinc-200 px-3 py-2 text-left font-semibold text-zinc-700">
                        Woche
                      </th>
                      <th className="border-b border-r border-zinc-200 px-3 py-2 text-left font-semibold text-zinc-700">
                        Einheit A
                      </th>
                      <th className="border-b border-r border-zinc-200 px-3 py-2 text-left font-semibold text-zinc-700">
                        Einheit B
                      </th>
                      <th className="border-b border-zinc-200 px-3 py-2 text-left font-semibold text-zinc-700">
                        Einheit C / D
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.weeks.map((week) => {
                      const sessionA = week.sessions.find(
                        (s) => s.label === "A",
                      );
                      const sessionB = week.sessions.find(
                        (s) => s.label === "B",
                      );
                      const sessionC = week.sessions.find(
                        (s) => s.label === "C",
                      );
                      const sessionD = week.sessions.find(
                        (s) => s.label === "D",
                      );

                      return (
                        <tr key={week.weekIndex} className="align-top">
                          <td className="border-r border-zinc-200 bg-blue-50 px-3 py-2 font-semibold text-zinc-800">
                            Woche {week.weekIndex}
                          </td>
                          <td className="border-r border-zinc-200 px-3 py-2">
                            {sessionA && <SessionCell session={sessionA} />}
                          </td>
                          <td className="border-r border-zinc-200 px-3 py-2">
                            {sessionB && <SessionCell session={sessionB} />}
                          </td>
                          <td className="px-3 py-2">
                            {sessionC && <SessionCell session={sessionC} />}
                            {sessionD && (
                              <div className="mt-2 border-t border-dashed border-zinc-200 pt-1">
                                <SessionCell session={sessionD} />
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-6 border-t border-zinc-200 pt-3 text-[11px] text-zinc-500">
          <p>
            Rundung: alle Gewichte auf {plan.meta.roundingIncrementKg} kg
            gerundet. Backoffs basieren immer auf %TM, nicht auf der
            Tagesform-Single.
          </p>
        </footer>
      </div>
    </div>
  );
}

import type { PlanSession as SessionType } from "@/lib/domain/types";

function SessionCell({ session }: { session: SessionType }) {
  return (
    <div className="space-y-1">
      <p className="whitespace-nowrap text-[11px] font-semibold text-zinc-800">
        {session.description}
      </p>
      <ul className="list-inside list-disc space-y-0.5">
        {session.entries.map((entry, idx) => (
          <li key={idx} className="whitespace-nowrap text-[11px] text-zinc-700">
            {formatEntry(entry)}
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { PlanEntry } from "@/lib/domain/types";

function formatEntry(entry: PlanEntry): string {
  const { prescription, computedWeightKg } = entry;
  const base = `${entry.exerciseName} ${prescription.sets}×${prescription.reps}`;

  if (prescription.intentType === "PercentTM") {
    const percent = (prescription.targetValue * 100).toFixed(1).replace(
      /\.0$/,
      "",
    );
    const weightText =
      computedWeightKg != null ? `: ${computedWeightKg.toFixed(1)} kg` : "";
    return `${base} @${percent}%TM${weightText}`;
  }

  const rpeText = prescription.targetValue.toFixed(1).replace(/\.0$/, "");
  const weightText =
    computedWeightKg != null ? `: Start ${computedWeightKg.toFixed(1)} kg` : "";
  const notes = entry.notes ? ` (${entry.notes})` : "";

  return `${base} @RPE ${rpeText}${weightText}${notes}`;
}

