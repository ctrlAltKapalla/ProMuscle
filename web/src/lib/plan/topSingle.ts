import { roundToIncrement } from "../math/rounding";

/**
 * Konservative Faktoren für Startgewichte der Top Single pro RPE.
 * Siehe docs/concept/05_berechnung_und_rundung.md
 */
const RPE_START_FACTORS: Record<number, number> = {
  7.0: 0.92,
  7.5: 0.94,
  8.0: 0.96,
  8.5: 0.98,
  9.0: 1.0,
};

export function getTopSingleStartWeight(
  tmKg: number,
  rpe: number,
  incrementKg: number,
): number {
  const factor =
    RPE_START_FACTORS[rpe] ??
    (() => {
      // Fallback: lineare Interpolation zwischen 7.0 und 9.0
      if (rpe <= 7) return RPE_START_FACTORS[7.0];
      if (rpe >= 9) return RPE_START_FACTORS[9.0];
      const t = (rpe - 7) / (9 - 7);
      return RPE_START_FACTORS[7.0] +
        t * (RPE_START_FACTORS[9.0] - RPE_START_FACTORS[7.0]);
    })();

  const raw = tmKg * factor;
  return roundToIncrement(raw, incrementKg);
}

