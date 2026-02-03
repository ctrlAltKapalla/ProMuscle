import type {
  PlanBlock,
  PlanIntentType,
  PlanPrescription,
  PlanSession,
  PlanWeek,
} from "../domain/types";

const RPE: PlanIntentType = "RPE";
const PCT: PlanIntentType = "PercentTM";

function pct(value: number): number {
  return value / 100;
}

function prescriptionRPE(
  sets: number,
  reps: number,
  rpe: number,
): PlanPrescription {
  return {
    sets,
    reps,
    intentType: RPE,
    targetValue: rpe,
  };
}

function prescriptionPct(
  sets: number,
  reps: number,
  percent: number,
): PlanPrescription {
  return {
    sets,
    reps,
    intentType: PCT,
    targetValue: pct(percent),
  };
}

function week(index: number, sessions: PlanSession[]): PlanWeek {
  return { weekIndex: index, sessions };
}

export const BASE_TEMPLATE: PlanBlock[] = [
  {
    blockIndex: 1,
    blockTitle: "Block 1 – Aufbau & Technik",
    blockSubtitle: "Volumen und Technik, kein Grind",
    weeks: [
      // Woche 1
      week(1, [
        {
          label: "A",
          description: "Heavy/Skill – Top Single + Backoffs",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionRPE(1, 1, 7.0),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(5, 4, 75),
            },
          ],
        },
        {
          label: "B",
          description: "Pause/Volumen",
          entries: [
            {
              exerciseName: "Pause Bench",
              prescription: prescriptionPct(4, 6, 70),
            },
          ],
        },
        {
          label: "C",
          description: "Speed + Variante",
          entries: [
            {
              exerciseName: "Speed Bench",
              prescription: prescriptionPct(8, 3, 62.5),
            },
            {
              exerciseName: "Close-Grip Bench",
              prescription: prescriptionPct(3, 8, 65),
            },
          ],
        },
      ]),
      // Woche 2
      week(2, [
        {
          label: "A",
          description: "Heavy/Skill – Top Single + Backoffs",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionRPE(1, 1, 7.5),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(6, 3, 80),
            },
          ],
        },
        {
          label: "B",
          description: "Pause/Volumen",
          entries: [
            {
              exerciseName: "Pause Bench",
              prescription: prescriptionPct(5, 5, 72.5),
            },
          ],
        },
        {
          label: "C",
          description: "Speed + Variante",
          entries: [
            {
              exerciseName: "Speed Bench",
              prescription: prescriptionPct(10, 2, 65),
            },
            {
              exerciseName: "Close-Grip Bench",
              prescription: prescriptionPct(4, 6, 70),
            },
          ],
        },
      ]),
      // Woche 3
      week(3, [
        {
          label: "A",
          description: "Heavy/Skill – Top Single + Backoffs",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionRPE(1, 1, 8.0),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(5, 3, 82.5),
            },
          ],
        },
        {
          label: "B",
          description: "Pause/Volumen",
          entries: [
            {
              exerciseName: "Pause Bench",
              prescription: prescriptionPct(4, 5, 75),
            },
          ],
        },
        {
          label: "C",
          description: "Volume / optional Speed",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(6, 4, 77.5),
            },
          ],
        },
      ]),
      // Woche 4 (Deload)
      week(4, [
        {
          label: "A",
          description: "Deload + Skill",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionRPE(1, 1, 8.0),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(3, 3, 72.5),
            },
          ],
        },
        {
          label: "B",
          description: "Deload Pause Bench",
          entries: [
            {
              exerciseName: "Pause Bench",
              prescription: prescriptionPct(3, 5, 67.5),
            },
          ],
        },
        {
          label: "C",
          description: "Very light / optional",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(6, 2, 60),
            },
          ],
        },
      ]),
    ],
  },
  {
    blockIndex: 2,
    blockTitle: "Block 2 – Kraftphase",
    blockSubtitle: "Intensität hoch, Volumen moderat",
    weeks: [
      // Woche 5
      week(5, [
        {
          label: "A",
          description: "Heavy/Skill – Top Single + Backoffs",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionRPE(1, 1, 7.5),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(5, 3, 85),
            },
          ],
        },
        {
          label: "B",
          description: "Pause/Volumen",
          entries: [
            {
              exerciseName: "Pause Bench",
              prescription: prescriptionPct(5, 4, 77.5),
            },
          ],
        },
        {
          label: "C",
          description: "Speed + Variante",
          entries: [
            {
              exerciseName: "Speed Bench",
              prescription: prescriptionPct(8, 2, 67.5),
            },
            {
              exerciseName: "Close-Grip Bench",
              prescription: prescriptionPct(4, 5, 75),
            },
          ],
        },
      ]),
      // Woche 6
      week(6, [
        {
          label: "A",
          description: "Heavy/Skill – Top Single + Backoffs",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionRPE(1, 1, 8.0),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(6, 2, 87.5),
            },
          ],
        },
        {
          label: "B",
          description: "Pause/Volumen",
          entries: [
            {
              exerciseName: "Pause Bench",
              prescription: prescriptionPct(4, 4, 80),
            },
          ],
        },
        {
          label: "C",
          description: "Bench-Volumen",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(5, 4, 80),
            },
          ],
        },
      ]),
      // Woche 7
      week(7, [
        {
          label: "A",
          description: "Heavy/Skill – Top Single + Backoffs",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionRPE(1, 1, 8.5),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(5, 2, 90),
            },
          ],
        },
        {
          label: "B",
          description: "Pause/Volumen (schwerer)",
          entries: [
            {
              exerciseName: "Pause Bench",
              prescription: prescriptionPct(4, 3, 82.5),
            },
          ],
        },
        {
          label: "C",
          description: "Speed Singles + Variante",
          entries: [
            {
              exerciseName: "Speed Bench",
              prescription: prescriptionPct(10, 1, 70),
            },
            {
              exerciseName: "Close-Grip Bench",
              prescription: prescriptionPct(3, 4, 80),
            },
          ],
        },
      ]),
      // Woche 8 (Deload + Re-Calibration)
      week(8, [
        {
          label: "A",
          description: "Deload + Re-Calibration",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionRPE(1, 1, 8.0),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(3, 2, 80),
            },
          ],
        },
        {
          label: "B",
          description: "Deload Pause Bench",
          entries: [
            {
              exerciseName: "Pause Bench",
              prescription: prescriptionPct(3, 4, 70),
            },
          ],
        },
        {
          label: "C",
          description: "Light Bench / frei",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(6, 2, 60),
            },
          ],
        },
      ]),
    ],
  },
  {
    blockIndex: 3,
    blockTitle: "Block 3 – Peaking & Test",
    blockSubtitle: "Spezifität hoch, Ermüdung runter, Test vorbereiten",
    weeks: [
      // Woche 9
      week(9, [
        {
          label: "A",
          description: "Heavy/Skill – Top Single + Backoffs",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionRPE(1, 1, 8.0),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(4, 2, 90),
            },
          ],
        },
        {
          label: "B",
          description: "Pause Bench (schwer)",
          entries: [
            {
              exerciseName: "Pause Bench",
              prescription: prescriptionPct(4, 3, 82.5),
            },
          ],
        },
        {
          label: "C",
          description: "Kontrolliertes Volumen",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(4, 4, 77.5),
            },
          ],
        },
      ]),
      // Woche 10
      week(10, [
        {
          label: "A",
          description: "Top Single + schwere Singles",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionRPE(1, 1, 8.5),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(5, 1, 90),
            },
          ],
        },
        {
          label: "B",
          description: "Pause Bench (schwer)",
          entries: [
            {
              exerciseName: "Pause Bench",
              prescription: prescriptionPct(3, 3, 85),
            },
          ],
        },
        {
          label: "C",
          description: "Speed Bench (leicht)",
          entries: [
            {
              exerciseName: "Speed Bench",
              prescription: prescriptionPct(6, 2, 60),
            },
          ],
        },
      ]),
      // Woche 11 (Taper)
      week(11, [
        {
          label: "A",
          description: "Taper – Top Single nah am Ziel",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionRPE(1, 1, 9.0),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(3, 1, 92.5),
            },
          ],
        },
        {
          label: "B",
          description: "Pause Bench (reduziert)",
          entries: [
            {
              exerciseName: "Pause Bench",
              prescription: prescriptionPct(3, 2, 80),
            },
          ],
        },
        {
          label: "C",
          description: "Very light / Technik",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(3, 3, 60),
            },
          ],
        },
      ]),
      // Woche 12 (Test)
      week(12, [
        {
          label: "A",
          description: "Sharpness",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(3, 2, 60),
            },
          ],
        },
        {
          label: "B",
          description: "Openers",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(1, 1, 85),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(1, 1, 90),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(1, 1, 92.5),
            },
          ],
        },
        {
          label: "C",
          description: "Testversuche",
          entries: [
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(1, 1, 95),
            },
            {
              exerciseName: "Bench Press",
              prescription: prescriptionPct(1, 1, 100),
            },
          ],
        },
      ]),
    ],
  },
];

