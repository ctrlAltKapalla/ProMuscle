import type { Plan, PlanAuditEntry, UserProfile } from "../domain/types";
import { roundToIncrement } from "../math/rounding";
import { generatePlan } from "./generatePlan";

const DEFAULT_ROUNDING_INCREMENT = 2.5;

export function computeNewTMFromSingle(
  singleWeightKg: number,
  rpe: 7 | 8 | 9,
  roundingIncrementKg: number = DEFAULT_ROUNDING_INCREMENT,
): number {
  // Präzisere Variante: e1RM aus Single + RPE (RIR) schätzen, dann TM = 0.90 * e1RM
  // RPE → angenommene Reps in Reserve (RIR): 7→3, 8→2, 9→1
  // Epley: 1RM ≈ weight * (1 + reps/30), reps = 1 + RIR
  const rir = rpe === 7 ? 3 : rpe === 8 ? 2 : 1;
  const reps = 1 + rir;
  const estimated1rm = singleWeightKg * (1 + reps / 30);
  const candidate = estimated1rm * 0.9;
  const capped = Math.min(candidate, singleWeightKg);

  return roundToIncrement(capped, roundingIncrementKg);
}

export function recalculatePlanWithNewTM(args: {
  oldPlan: Plan;
  newTmKg: number;
  profile: UserProfile;
  week: number;
  method?: string;
}): Plan {
  const { oldPlan, newTmKg, profile, week, method } = args;

  const updatedProfile: UserProfile = {
    ...profile,
    tmKg: newTmKg,
  };

  const newPlan = generatePlan(updatedProfile);

  const auditEntry: PlanAuditEntry = {
    type: "tm_update",
    weekIndex: week,
    oldTmKg: oldPlan.meta.tmKg,
    newTmKg,
    method: method ?? "single_based_estimate",
    timestamp: new Date().toISOString(),
  };

  return {
    ...newPlan,
    auditTrail: [...(newPlan.auditTrail ?? []), auditEntry],
  };
}

