import { getTopSingleStartWeight } from "./topSingle";

describe("getTopSingleStartWeight", () => {
  it("liefert erwartete Startgewichte für TM=80", () => {
    const tm = 80;
    const inc = 2.5;

    expect(getTopSingleStartWeight(tm, 7, inc)).toBe(72.5);
    expect(getTopSingleStartWeight(tm, 8, inc)).toBe(77.5);
    expect(getTopSingleStartWeight(tm, 9, inc)).toBe(80.0);
  });
});

