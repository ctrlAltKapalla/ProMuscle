import { classifyFeasibility } from "./feasibility";
import type { UserProfile } from "../domain/types";

describe("classifyFeasibility", () => {
  it("klassifiziert Beispiel aus Spezifikation als Unlikely", () => {
    const profile: UserProfile = {
      ageYears: 41,
      bodyweightKg: 85,
      trainingDaysPerWeek: 3,
      tmKg: 80,
      target1RmKg: 100,
      roundingIncrementKg: 2.5,
      tmDefinition: "tm_is_90pct_1rm",
    };

    const result = classifyFeasibility(profile);

    expect(result.classification).toBe("Unlikely");
  });
});

