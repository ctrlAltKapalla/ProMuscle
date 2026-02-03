import { roundToIncrement } from "./rounding";

describe("roundToIncrement", () => {
  it("rundet gemäß Spec (inc=2.5)", () => {
    expect(roundToIncrement(56.0, 2.5)).toBe(55.0);
    expect(roundToIncrement(57.4, 2.5)).toBe(57.5);
    expect(roundToIncrement(57.5, 2.5)).toBe(57.5);
  });
});

