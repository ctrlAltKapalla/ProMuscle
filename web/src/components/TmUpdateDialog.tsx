import { useState } from "react";
import { RpeInfoModal } from "@/components/RpeInfoModal";
import { computeNewTMFromSingle } from "@/lib/plan/tmUpdate";

interface Props {
  currentTmKg: number | null;
  onNewTm: (newTmKg: number) => void;
}

export function TmUpdateDialog({ currentTmKg, onNewTm }: Props) {
  const [singleWeight, setSingleWeight] = useState<string>("");
  const [rpe, setRpe] = useState<7 | 8 | 9>(8);
  const [suggestedTm, setSuggestedTm] = useState<number | null>(
    null,
  );

  function handleCompute() {
    const weight = Number(singleWeight);
    if (!weight || weight <= 0) return;
    const newTm = computeNewTMFromSingle(weight, rpe);
    setSuggestedTm(newTm);
  }

  function handleApply() {
    if (suggestedTm) {
      onNewTm(suggestedTm);
    }
  }

  return (
    <div className="space-y-2 rounded-xl bg-white p-4 text-xs shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900">
        TM-Update (z. B. nach Woche 4/8)
      </h3>
      <p className="text-[11px] text-zinc-600">
        Basierend auf deinem besten Single + RPE wird ein neues,
        konservatives TM geschätzt.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-zinc-800">
            Bestes Single-Gewicht (kg)
          </label>
          <input
            type="number"
            value={singleWeight}
            onChange={(e) => setSingleWeight(e.target.value)}
            className="rounded-md border border-zinc-300 px-2 py-1 text-[11px] text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <label className="text-[11px] font-medium text-zinc-800">
              RPE (7–9)
            </label>
            <RpeInfoModal
              showLabel={false}
              buttonClassName="h-5 w-5 text-[10px]"
            />
          </div>
          <select
            value={rpe}
            onChange={(e) =>
              setRpe(Number(e.target.value) as 7 | 8 | 9)
            }
            className="rounded-md border border-zinc-300 px-2 py-1 text-[11px] text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCompute}
        className="w-full rounded-full bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-zinc-800"
      >
        Neues TM vorschlagen
      </button>

      <div className="text-[11px] text-zinc-700">
        <p>Aktuelles TM: {currentTmKg ?? "–"} kg</p>
        {suggestedTm && (
          <p className="mt-1 font-medium text-blue-700">
            Vorschlag neues TM: {suggestedTm} kg
          </p>
        )}
      </div>

      {suggestedTm && (
        <button
          type="button"
          onClick={handleApply}
          className="mt-1 w-full rounded-full border border-blue-600 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
        >
          Vorschlag übernehmen
        </button>
      )}
    </div>
  );
}

