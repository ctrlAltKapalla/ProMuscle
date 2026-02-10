"use client";

import { useState } from "react";
import { RpeTable } from "@/components/RpeTable";

type Props = {
  showLabel?: boolean;
  labelText?: string;
  buttonClassName?: string;
};

export function RpeInfoModal({
  showLabel = false,
  labelText = "RPE-Info",
  buttonClassName = "",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 bg-white/70 text-[10px] font-semibold text-zinc-600 shadow-sm transition hover:border-zinc-400 hover:text-zinc-700 ${buttonClassName}`}
        aria-label="RPE-Info öffnen"
      >
        ?
      </button>
      {showLabel && (
        <span className="text-xs text-zinc-500">{labelText}</span>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-3xl rounded-xl border border-zinc-200 bg-white p-4 shadow-xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-sm text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-700"
              aria-label="Modal schließen"
            >
              ×
            </button>
            <div className="pr-8">
              <RpeTable />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-700"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
