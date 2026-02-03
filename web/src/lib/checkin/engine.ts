import type {
  CheckinInput,
  CheckinResult,
  Plan,
  PlanAuditEntry,
  PlanEntry,
} from "../domain/types";
import { roundToIncrement } from "../math/rounding";

const ADJUST_STEP = 2.5;

export function evaluateCheckin(input: CheckinInput): CheckinResult {
  const isGreen =
    input.completedUnits === "all" &&
    input.technique === "clean" &&
    input.painScore <= 3;

  const isRed =
    input.completedUnits === "two_or_more_missed" ||
    input.technique === "major_deviations" ||
    input.painScore >= 6;

  let nextWeekAdjustmentKg = 0;
  let modifySingles = false;
  let miniDeload = false;
  let painWarning: string | undefined;
  let message: string;

  if (isGreen) {
    nextWeekAdjustmentKg = ADJUST_STEP;
    message =
      "Grüne Woche: +2.5 kg für alle %TM-Sätze der nächsten Woche. Singles können leicht angehoben werden.";
  } else if (isRed) {
    nextWeekAdjustmentKg = -ADJUST_STEP;
    modifySingles = true;
    miniDeload = true;
    message =
      "Rote Woche: -2.5 kg für alle %TM-Sätze der nächsten Woche. Schwere Singles werden reduziert oder gestrichen.";

    if (input.painScore >= 6) {
      painWarning =
        "Schmerz >= 6: Keine schweren Singles, Volumen reduzieren und ggf. medizinisch abklären.";
    }
  } else {
    nextWeekAdjustmentKg = 0;
    message =
      "Gelbe Woche: Lasten bleiben gleich. Fokus auf Technik, Pausen und Erholung.";
  }

  return {
    nextWeekAdjustmentKg,
    modifySingles,
    miniDeload,
    painWarning,
    message,
  };
}

export function applyWeeklyAdjustment(
  plan: Plan,
  weekIndex: number,
  adjustmentKg: number,
): Plan {
  if (adjustmentKg === 0) return plan;

  const updatedBlocks = plan.blocks.map((block) => ({
    ...block,
    weeks: block.weeks.map((week) => {
      if (week.weekIndex !== weekIndex) return week;

      return {
        ...week,
        sessions: week.sessions.map((session) => ({
          ...session,
          entries: session.entries.map((entry) =>
            adjustEntry(entry, adjustmentKg, plan.meta.roundingIncrementKg),
          ),
        })),
      };
    }),
  }));

  const auditEntry: PlanAuditEntry = {
    type: "weekly_adjustment",
    weekIndex,
    deltaKg: adjustmentKg,
    timestamp: new Date().toISOString(),
    reason: "weekly_checkin",
  };

  return {
    ...plan,
    blocks: updatedBlocks,
    auditTrail: [...(plan.auditTrail ?? []), auditEntry],
  };
}

function adjustEntry(
  entry: PlanEntry,
  adjustmentKg: number,
  roundingIncrementKg: number,
): PlanEntry {
  if (entry.prescription.intentType !== "PercentTM") {
    return entry;
  }

  const current = entry.computedWeightKg ?? 0;
  const adjusted = roundToIncrement(
    current + adjustmentKg,
    roundingIncrementKg,
  );

  return {
    ...entry,
    computedWeightKg: adjusted,
  };
}

