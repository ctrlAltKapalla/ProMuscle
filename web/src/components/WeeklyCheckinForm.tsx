import { useState } from "react";
import type { CheckinInput } from "@/lib/domain/types";
import { evaluateCheckin } from "@/lib/checkin/engine";

interface Props {
  onResult: (adjustmentKg: number, message: string) => void;
}

export function WeeklyCheckinForm({ onResult }: Props) {
  const [completedUnits, setCompletedUnits] =
    useState<CheckinInput["completedUnits"]>("all");
  const [technique, setTechnique] =
    useState<CheckinInput["technique"]>("clean");
  const [painScore, setPainScore] = useState<number>(0);
  const [lastMessage, setLastMessage] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CheckinInput = {
      completedUnits,
      technique,
      painScore,
    };
    const result = evaluateCheckin(input);
    setLastMessage(
      result.painWarning
        ? `${result.message} ${result.painWarning}`
        : result.message,
    );
    onResult(result.nextWeekAdjustmentKg, result.message);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-4 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-zinc-900">
        Wochen-Check-in (Auto-Regulation)
      </h3>

      <div className="space-y-2 text-xs text-zinc-800">
        <div>
          <p className="mb-1 font-medium">1) Einheiten abgeschlossen?</p>
          <div className="flex gap-2">
            {[
              { value: "all", label: "alle" },
              { value: "one_missed", label: "1 verpasst" },
              { value: "two_or_more_missed", label: "2+ verpasst" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setCompletedUnits(
                    opt.value as CheckinInput["completedUnits"],
                  )
                }
                className={`flex-1 rounded-full border px-2 py-1 ${
                  completedUnits === opt.value
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-zinc-300 bg-white text-zinc-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 font-medium">2) Reps/Technik</p>
          <div className="flex gap-2">
            {[
              { value: "clean", label: "alles sauber" },
              {
                value: "minor_deviations",
                label: "leichte Abweichungen",
              },
              {
                value: "major_deviations",
                label: "deutlich",
              },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setTechnique(opt.value as CheckinInput["technique"])
                }
                className={`flex-1 rounded-full border px-2 py-1 ${
                  technique === opt.value
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-zinc-300 bg-white text-zinc-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 font-medium">
            3) Schmerz (0–10)
          </p>
          <input
            type="range"
            min={0}
            max={10}
            value={painScore}
            onChange={(e) => setPainScore(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-right text-[11px] text-zinc-600">
            {painScore}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800"
      >
        Check-in auswerten
      </button>

      {lastMessage && (
        <p className="text-[11px] text-zinc-700">{lastMessage}</p>
      )}
    </form>
  );
}

