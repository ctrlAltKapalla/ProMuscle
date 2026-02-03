import type { FeasibilityResult, UserProfile } from "../domain/types";

const AGE_FACTORS = [
  { maxAge: 35, factor: 1.0 },
  { maxAge: 45, factor: 0.9 },
  { maxAge: 55, factor: 0.8 },
  { maxAge: Infinity, factor: 0.7 },
];

export function estimateCurrent1Rm(tmKg: number): number {
  return tmKg / 0.9;
}

export function estimateGains(
  e1rm: number,
  ageYears: number,
  daysPerWeek: 3 | 4,
) {
  const ageFactor =
    AGE_FACTORS.find((entry) => ageYears <= entry.maxAge)?.factor ?? 0.7;

  const daysBonus = daysPerWeek === 4 ? 1.0 : 0.0;

  let gainLow = e1rm * 0.03 * ageFactor + daysBonus;
  let gainHigh = e1rm * 0.06 * ageFactor + 2 * daysBonus;

  if (gainLow < 2.5) gainLow = 2.5;
  if (gainHigh > 12.5) gainHigh = 12.5;

  return { gainLow, gainHigh };
}

export function classifyFeasibility(
  profile: UserProfile,
): FeasibilityResult {
  const e1rm = estimateCurrent1Rm(profile.tmKg);
  const { gainLow, gainHigh } = estimateGains(
    e1rm,
    profile.ageYears,
    profile.trainingDaysPerWeek,
  );

  const requiredGain = profile.target1RmKg - e1rm;

  let classification: FeasibilityResult["classification"];

  if (requiredGain <= 0) {
    classification = "AlreadyReachable";
  } else if (requiredGain <= gainLow) {
    classification = "Likely";
  } else if (requiredGain <= gainHigh) {
    classification = "Possible";
  } else {
    classification = "Unlikely";
  }

  const message = buildMessage(
    profile.tmKg,
    e1rm,
    profile.target1RmKg,
    requiredGain,
    gainLow,
    gainHigh,
    classification,
  );

  return {
    classification,
    estimatedCurrent1RmKg: e1rm,
    requiredGainKg: requiredGain,
    gainLowKg: gainLow,
    gainHighKg: gainHigh,
    message,
  };
}

function buildMessage(
  tmKg: number,
  e1rm: number,
  target: number,
  requiredGain: number,
  gainLow: number,
  gainHigh: number,
  classification: FeasibilityResult["classification"],
): string {
  const e1rmRounded = e1rm.toFixed(1);
  const requiredRounded = requiredGain.toFixed(1);
  const lowRounded = gainLow.toFixed(1);
  const highRounded = gainHigh.toFixed(1);

  if (classification === "AlreadyReachable") {
    return `Mit TM ${tmKg} kg schätzen wir dein aktuelles 1RM auf ~${e1rmRounded} kg. Dein Ziel liegt darunter oder in Reichweite – ein Testlauf ist vermutlich jetzt schon möglich.`;
  }

  const base = `Mit TM ${tmKg} kg schätzen wir dein 1RM auf ~${e1rmRounded} kg. Für ${target} kg brauchst du +${requiredRounded} kg. Für 12 Wochen erwarten wir konservativ +${lowRounded} bis +${highRounded} kg.`;

  if (classification === "Likely") {
    return `${base} Bewertung: Likely – Ziel in 12 Wochen realistisch, sofern Training/Regeneration passen.`;
  }

  if (classification === "Possible") {
    return `${base} Bewertung: Possible – ambitioniert, aber machbar. Empfehlung: Fortschritt eng tracken und bei Bedarf Ziel leicht anpassen.`;
  }

  return `${base} Bewertung: Unlikely – Ziel sehr ambitioniert. Empfehlung: längerer Zeitraum (z. B. 16+ Wochen) oder Zwischenziel.`;
}

