// Rundungsfunktionen für Trainingsgewichte
// Siehe docs/concept/05_berechnung_und_rundung.md

/**
 * Rundet einen Wert auf das nächste Vielfache von `increment`.
 * - Standard: nearest
 * - Ties (genau in der Mitte) → abwärts (konservativ)
 */
export function roundToIncrement(value: number, increment: number): number {
  if (increment <= 0) {
    throw new Error("increment must be > 0");
  }

  const quotient = value / increment;
  const floor = Math.floor(quotient);
  const ceil = Math.ceil(quotient);

  const floorValue = floor * increment;
  const ceilValue = ceil * increment;

  const distToFloor = Math.abs(value - floorValue);
  const distToCeil = Math.abs(value - ceilValue);

  if (distToFloor < distToCeil) {
    return floorValue;
  }

  if (distToCeil < distToFloor) {
    return ceilValue;
  }

  // Tie → down (konservativ)
  return floorValue;
}

