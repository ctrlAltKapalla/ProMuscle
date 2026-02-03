// Zentrale Domänentypen für den Bankdrück-Plan-Generator
// Abgeleitet aus docs/concept/*

export type TrainingDaysPerWeek = 3 | 4;

export interface UserProfile {
  /** Alter in Jahren, 14–90 */
  ageYears: number;
  /** Körpergewicht in kg, 35–250 */
  bodyweightKg: number;
  /** Trainingstage pro Woche (3 oder 4) */
  trainingDaysPerWeek: TrainingDaysPerWeek;
  /** Training Max in kg (typischerweise ~90 % des realistischen 1RM) */
  tmKg: number;
  /** Ziel-1RM in kg (>= TM) */
  target1RmKg: number;

  /** Rundungsinkrement für Gewichte, Standard 2.5 kg */
  roundingIncrementKg?: number;

  /** Definition, wie TM interpretiert wird */
  tmDefinition?:
    | "tm_is_90pct_1rm"
    | "tm_equals_estimated_1rm"
    | "custom_factor";

  /** Optionales Start-Datum für den Plan (ISO-String) */
  startDate?: string;

  // Erweiterungen v1.1+
  equipment?: "bench_only" | "safeties" | "spotter";
  painFlags?: {
    shoulder?: boolean;
    elbow?: boolean;
    wrist?: boolean;
  };
  /** Früheres Best-1RM, relevant für Machbarkeits-Heuristik (Retraining) */
  previousBest1RmKg?: number;
}

export type PlanIntentType = "RPE" | "PercentTM";

export interface PlanPrescription {
  sets: number;
  reps: number;
  /** RPE oder Prozent von TM, je nach intentType */
  intentType: PlanIntentType;
  /** Zielwert: z. B. 8 für RPE 8 oder 0.75 für 75 % TM */
  targetValue: number;
}

export interface PlanEntry {
  /** Z. B. Bench Press / Pause Bench / Close-Grip Bench / Speed Bench */
  exerciseName: string;
  prescription: PlanPrescription;
  /** Berechnetes Gewicht in kg (gerundet) */
  computedWeightKg?: number;
  /** Zusätzliche Hinweise für den Athleten */
  notes?: string;
}

export type SessionLabel = "A" | "B" | "C" | "D";

export interface PlanSession {
  label: SessionLabel;
  /** Kurzbeschreibung wie Heavy/Skill, Pause/Volumen, Speed/Variante, Recovery */
  description: string;
  entries: PlanEntry[];
}

export interface PlanWeek {
  /** 1..12 */
  weekIndex: number;
  sessions: PlanSession[];
}

export interface PlanBlock {
  blockIndex: 1 | 2 | 3;
  blockTitle: string;
  blockSubtitle?: string;
  weeks: PlanWeek[];
}

export interface PlanMeta {
  title: string;
  standDate: string;
  tmKg: number;
  target1RmKg: number;
  roundingIncrementKg: number;
}

export interface PlanAuditEntry {
  type: "weekly_adjustment" | "tm_update";
  weekIndex?: number;
  deltaKg?: number;
  oldTmKg?: number;
  newTmKg?: number;
  reason?: string;
  method?: string;
  timestamp: string;
}

export interface Plan {
  meta: PlanMeta;
  blocks: PlanBlock[];
  auditTrail?: PlanAuditEntry[];
}

export type FeasibilityClassification =
  | "Likely"
  | "Possible"
  | "Unlikely"
  | "AlreadyReachable";

export interface FeasibilityResult {
  classification: FeasibilityClassification;
  estimatedCurrent1RmKg: number;
  requiredGainKg: number;
  gainLowKg: number;
  gainHighKg: number;
  message: string;
}

export type CompletedUnits =
  | "all"
  | "one_missed"
  | "two_or_more_missed";

export type TechniqueQuality =
  | "clean"
  | "minor_deviations"
  | "major_deviations";

export interface CheckinInput {
  completedUnits: CompletedUnits;
  technique: TechniqueQuality;
  painScore: number; // 0–10
  painRegion?: "shoulder" | "elbow" | "wrist";
}

export interface CheckinResult {
  /** Globale Gewichtsverschiebung für die nächste Woche in kg (+2.5/0/-2.5) */
  nextWeekAdjustmentKg: number;
  /** Ob Singles modifiziert/entschärft werden sollen */
  modifySingles: boolean;
  /** Ob eine Mini-Deload-Woche empfohlen wird */
  miniDeload: boolean;
  /** Ob eine Schmerz-Warnung angezeigt werden soll */
  painWarning?: string;
  /** Menschlich lesbarer Kurz-Feedback-Text */
  message: string;
}

