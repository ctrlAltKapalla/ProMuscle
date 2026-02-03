import {
  type Plan,
  type PlanBlock,
  type PlanEntry,
  type PlanSession,
  type PlanWeek,
  type UserProfile,
} from "../domain/types";
import { percentOfTM } from "../math/percent";
import { getTopSingleStartWeight } from "./topSingle";
import { BASE_TEMPLATE } from "./template";

const DEFAULT_ROUNDING_INCREMENT = 2.5;

function cloneBlocks(blocks: PlanBlock[]): PlanBlock[] {
  return blocks.map((block) => ({
    ...block,
    weeks: block.weeks.map((week) => ({
      ...week,
      sessions: week.sessions.map((session) => ({
        ...session,
        entries: session.entries.map((entry) => ({ ...entry })),
      })),
    })),
  }));
}

function computeEntryWeight(
  entry: PlanEntry,
  profile: UserProfile,
  roundingIncrementKg: number,
): PlanEntry {
  const { tmKg } = profile;

  if (entry.prescription.intentType === "PercentTM") {
    const weight = percentOfTM(
      tmKg,
      entry.prescription.targetValue,
      roundingIncrementKg,
    );
    return {
      ...entry,
      computedWeightKg: weight,
    };
  }

  if (entry.prescription.intentType === "RPE") {
    const rpe = entry.prescription.targetValue;
    const startWeight = getTopSingleStartWeight(
      tmKg,
      rpe,
      roundingIncrementKg,
    );

    const notesParts: string[] = [];
    notesParts.push(
      `Start: ${startWeight.toFixed(1)} kg (±${roundingIncrementKg} kg nach Gefühl)`,
    );

    return {
      ...entry,
      computedWeightKg: startWeight,
      notes: entry.notes
        ? `${entry.notes} ${notesParts.join(" ")}`
        : notesParts.join(" "),
    };
  }

  return entry;
}

function computeSession(
  session: PlanSession,
  profile: UserProfile,
  roundingIncrementKg: number,
): PlanSession {
  return {
    ...session,
    entries: session.entries.map((entry) =>
      computeEntryWeight(entry, profile, roundingIncrementKg),
    ),
  };
}

function computeWeek(
  week: PlanWeek,
  profile: UserProfile,
  roundingIncrementKg: number,
  trainingDaysPerWeek: 3 | 4,
): PlanWeek {
  const baseSessions = week.sessions;

  const sessions: PlanSession[] = baseSessions.map((session) =>
    computeSession(session, profile, roundingIncrementKg),
  );

  // Optionaler Technik-Tag D bei 4 Tagen/Woche
  if (trainingDaysPerWeek === 4) {
    const recoverySession: PlanSession = {
      label: "D",
      description: "Recovery/Technik Bench",
      entries: [
        {
          exerciseName: "Bench Press",
          prescription: {
            sets: 6,
            reps: 3,
            intentType: "RPE",
            targetValue: 6,
          },
          notes: "Ziel: Bewegungsqualität, nicht ermüden",
        },
      ],
    };

    sessions.push(
      computeSession(recoverySession, profile, roundingIncrementKg),
    );
  }

  return {
    ...week,
    sessions,
  };
}

function computeBlocks(
  blocks: PlanBlock[],
  profile: UserProfile,
  roundingIncrementKg: number,
): PlanBlock[] {
  const trainingDays = profile.trainingDaysPerWeek;

  return blocks.map((block) => ({
    ...block,
    weeks: block.weeks.map((week) =>
      computeWeek(week, profile, roundingIncrementKg, trainingDays),
    ),
  }));
}

export function generatePlan(profile: UserProfile): Plan {
  const roundingIncrementKg =
    profile.roundingIncrementKg ?? DEFAULT_ROUNDING_INCREMENT;

  const blocks = cloneBlocks(BASE_TEMPLATE);
  const computedBlocks = computeBlocks(
    blocks,
    profile,
    roundingIncrementKg,
  );

  const today = new Date();

  const meta = {
    title: "12-Wochen Bankdrückplan",
    standDate: today.toISOString().slice(0, 10),
    tmKg: profile.tmKg,
    target1RmKg: profile.target1RmKg,
    roundingIncrementKg,
  };

  const plan: Plan = {
    meta,
    blocks: computedBlocks,
    auditTrail: [],
  };

  return plan;
}

