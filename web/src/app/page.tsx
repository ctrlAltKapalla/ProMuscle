"use client";

import { useState } from "react";
import type { Plan, UserProfile } from "@/lib/domain/types";
import { generatePlan } from "@/lib/plan/generatePlan";
import { classifyFeasibility } from "@/lib/heuristics/feasibility";
import { applyWeeklyAdjustment } from "@/lib/checkin/engine";
import { recalculatePlanWithNewTM } from "@/lib/plan/tmUpdate";
import { UserProfileForm } from "@/components/UserProfileForm";
import { PlanSheet } from "@/components/PlanSheet";
import { WeeklyCheckinForm } from "@/components/WeeklyCheckinForm";
import { TmUpdateDialog } from "@/components/TmUpdateDialog";
import { RpeTable } from "@/components/RpeTable";

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [feasibilityText, setFeasibilityText] = useState<string>("");
  const [lastAdjustmentInfo, setLastAdjustmentInfo] = useState<
    string | null
  >(null);

  function handleProfileSubmit(newProfile: UserProfile) {
    const newPlan = generatePlan(newProfile);
    const feasibility = classifyFeasibility(newProfile);

    setProfile(newProfile);
    setPlan(newPlan);
    setFeasibilityText(feasibility.message);
    setLastAdjustmentInfo(null);
  }

  function handleCheckinResult(adjustmentKg: number, message: string) {
    if (!plan || !profile) return;
    // Für v1 wenden wir die Anpassung immer auf die letzte Woche an,
    // in einer echten App würdest du hier die aktuelle Woche wählen lassen.
    const allWeeks = plan.blocks.flatMap((b) => b.weeks);
    const maxWeekIndex = Math.max(...allWeeks.map((w) => w.weekIndex));
    const updatedPlan = applyWeeklyAdjustment(
      plan,
      maxWeekIndex,
      adjustmentKg,
    );
    setPlan(updatedPlan);
    setLastAdjustmentInfo(
      `${message} Anpassung wurde auf Woche ${maxWeekIndex} angewendet.`,
    );
  }

  function handleNewTm(newTmKg: number) {
    if (!plan || !profile) return;
    const allWeeks = plan.blocks.flatMap((b) => b.weeks);
    const maxWeekIndex = Math.max(...allWeeks.map((w) => w.weekIndex));
    const updatedPlan = recalculatePlanWithNewTM({
      oldPlan: plan,
      newTmKg,
      profile,
      week: maxWeekIndex,
    });
    setPlan(updatedPlan);
    setLastAdjustmentInfo(
      `TM wurde auf ${newTmKg} kg aktualisiert. Plan ab Woche ${maxWeekIndex} neu berechnet.`,
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full max-w-md shrink-0">
            <UserProfileForm
              onSubmit={(p) => handleProfileSubmit(p)}
            />

            <div className="mt-4 space-y-3">
              <WeeklyCheckinForm onResult={handleCheckinResult} />
              <TmUpdateDialog
                currentTmKg={plan?.meta.tmKg ?? null}
                onNewTm={handleNewTm}
              />
              <RpeTable />
              {lastAdjustmentInfo && (
                <p className="text-[11px] text-zinc-600">
                  {lastAdjustmentInfo}
                </p>
              )}
            </div>
          </div>

          <div className="flex-1">
            {plan ? (
              <PlanSheet
                plan={plan}
                feasibilityMessage={feasibilityText}
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white/60 p-8 text-sm text-zinc-500">
                Gib deine Daten links ein und klicke auf „Plan erstellen“, um
                deinen 12-Wochen Bankdrückplan zu generieren.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
