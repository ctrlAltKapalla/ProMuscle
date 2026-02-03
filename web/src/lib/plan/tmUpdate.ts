import type { Plan, PlanAuditEntry, UserProfile } from "../domain/types";
import { roundToIncrement } from "../math/rounding";
import { generatePlan } from "./generatePlan";

const DEFAULT_ROUNDING_INCREMENT = 2.5;

export function computeNewTMFromSingle(
  singleWeightKg: number,
  rpe: 7 | 8 | 9,
  roundingIncrementKg: number = DEFAULT_ROUNDING_INCREMENT,
): number {
  // Einfache Variante (Spezifikation): new_TM = single_weight - 7.5 kg (RPE8-Annahme)
  // Wir passen für RPE 7 bzw. 9 leicht an.
  let candidate: number;

  if (rpe === 8) {
    candidate = singleWeightKg - 7.5;
  } else if (rpe === 7) {
    candidate = singleWeightKg - 10;
  } else {
    // rpe === 9
    candidate = singleWeightKg - 5;
  }

  return roundToIncrement(candidate, roundingIncrementKg);
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

