import { roundToIncrement } from "./rounding";

/**
 * Berechnet %TM in kg und rundet auf das gegebene Inkrement.
 * Prozentwerte werden als Dezimalzahlen erwartet (0.75 statt 75).
 */
export function percentOfTM(
  tmKg: number,
  percent: number,
  incrementKg: number,
): number {
  const raw = tmKg * percent;
  return roundToIncrement(raw, incrementKg);
}

