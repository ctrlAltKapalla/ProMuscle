import { percentOfTM } from "./percent";

describe("percentOfTM", () => {
  it("berechnet %TM korrekt (TM=80, inc=2.5)", () => {
    expect(percentOfTM(80, 0.75, 2.5)).toBe(60.0);
    expect(percentOfTM(80, 0.7, 2.5)).toBe(55.0);
    expect(percentOfTM(80, 0.725, 2.5)).toBe(57.5);
    expect(percentOfTM(80, 0.825, 2.5)).toBe(65.0);
    expect(percentOfTM(80, 0.875, 2.5)).toBe(70.0);
    expect(percentOfTM(80, 0.9, 2.5)).toBe(72.5);
  });
});

