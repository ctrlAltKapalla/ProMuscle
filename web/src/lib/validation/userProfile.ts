import type { UserProfile } from "../domain/types";

export interface ValidationIssue {
  field: keyof UserProfile | "targetDelta";
  message: string;
  type: "error" | "warning";
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

function pushIssue(
  list: ValidationIssue[],
  field: ValidationIssue["field"],
  message: string,
  type: ValidationIssue["type"],
) {
  list.push({ field, message, type });
}

export function validateUserProfile(
  raw: Partial<UserProfile>,
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const ageYears = raw.ageYears;
  const bodyweightKg = raw.bodyweightKg;
  const trainingDaysPerWeek = raw.trainingDaysPerWeek;
  const tmKg = raw.tmKg;
  const target1RmKg = raw.target1RmKg;

  // Alter
  if (ageYears == null || Number.isNaN(ageYears)) {
    pushIssue(errors, "ageYears", "Alter ist erforderlich.", "error");
  } else if (ageYears < 14 || ageYears > 90) {
    pushIssue(
      errors,
      "ageYears",
      "Alter muss zwischen 14 und 90 liegen.",
      "error",
    );
  }

  // Körpergewicht
  if (bodyweightKg == null || Number.isNaN(bodyweightKg)) {
    pushIssue(
      errors,
      "bodyweightKg",
      "Körpergewicht ist erforderlich.",
      "error",
    );
  } else if (bodyweightKg < 35 || bodyweightKg > 250) {
    pushIssue(
      errors,
      "bodyweightKg",
      "Gewicht muss zwischen 35 und 250 kg liegen.",
      "error",
    );
  }

  // Trainingstage/Woche
  if (trainingDaysPerWeek !== 3 && trainingDaysPerWeek !== 4) {
    pushIssue(
      errors,
      "trainingDaysPerWeek",
      "Trainingstage/Woche muss 3 oder 4 sein.",
      "error",
    );
  }

  // TM
  if (tmKg == null || Number.isNaN(tmKg)) {
    pushIssue(errors, "tmKg", "TM (Training Max) ist erforderlich.", "error");
  } else {
    if (tmKg < 20 || tmKg > 250) {
      pushIssue(
        errors,
        "tmKg",
        "TM unplausibel. Bitte kg-Wert prüfen (20–250 kg).",
        "error",
      );
    }

    // Vielfaches von 0.5 (praktische Eingabe)
    const halfSteps = tmKg / 0.5;
    if (Math.abs(halfSteps - Math.round(halfSteps)) > 1e-6) {
      pushIssue(
        warnings,
        "tmKg",
        "TM sollte in 0,5-kg-Schritten angegeben werden. Die App rundet intern auf das Trainingsinkrement.",
        "warning",
      );
    }
  }

  // Zielgewicht
  if (target1RmKg == null || Number.isNaN(target1RmKg)) {
    pushIssue(
      errors,
      "target1RmKg",
      "Ziel-1RM ist erforderlich.",
      "error",
    );
  } else {
    if (tmKg != null && !Number.isNaN(tmKg) && target1RmKg < tmKg) {
      pushIssue(
        errors,
        "target1RmKg",
        "Ziel-1RM muss mindestens so hoch wie TM sein.",
        "error",
      );
    }
    if (target1RmKg > 250) {
      pushIssue(
        errors,
        "target1RmKg",
        "Ziel-1RM über 250 kg wird in v1 nicht unterstützt.",
        "error",
      );
    }

    // Aggressivitäts-Warnung
    if (tmKg != null && !Number.isNaN(tmKg)) {
      const estimatedCurrent1Rm = tmKg / 0.9;
      const delta = target1RmKg - estimatedCurrent1Rm;
      if (delta > 20) {
        pushIssue(
          warnings,
          "targetDelta",
          "Ziel sehr aggressiv. Empfehlung: Zwischenziel oder längerer Zeitraum.",
          "warning",
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

