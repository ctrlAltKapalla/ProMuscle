import { useState } from "react";
import type { UserProfile } from "@/lib/domain/types";
import {
  type ValidationResult,
  validateUserProfile,
} from "@/lib/validation/userProfile";

interface Props {
  onSubmit: (profile: UserProfile, validation: ValidationResult) => void;
}

export function UserProfileForm({ onSubmit }: Props) {
  const [ageYears, setAgeYears] = useState<string>("35");
  const [bodyweightKg, setBodyweightKg] = useState<string>("85");
  const [trainingDaysPerWeek, setTrainingDaysPerWeek] =
    useState<"3" | "4">("3");
  const [tmKg, setTmKg] = useState<string>("80");
  const [target1RmKg, setTarget1RmKg] = useState<string>("100");

  const [validation, setValidation] = useState<ValidationResult | null>(
    null,
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const profile: UserProfile = {
      ageYears: Number(ageYears),
      bodyweightKg: Number(bodyweightKg),
      trainingDaysPerWeek: Number(
        trainingDaysPerWeek,
      ) as UserProfile["trainingDaysPerWeek"],
      tmKg: Number(tmKg),
      target1RmKg: Number(target1RmKg),
      roundingIncrementKg: 2.5,
      tmDefinition: "tm_is_90pct_1rm",
    };

    const result = validateUserProfile(profile);
    setValidation(result);

    if (result.isValid) {
      onSubmit(profile, result);
    }
  }

  const errorsByField = new Map<
    string,
    string[]
  >();
  const warningsByField = new Map<
    string,
    string[]
  >();

  if (validation) {
    for (const issue of validation.errors) {
      const arr = errorsByField.get(issue.field) ?? [];
      arr.push(issue.message);
      errorsByField.set(issue.field, arr);
    }
    for (const issue of validation.warnings) {
      const arr = warningsByField.get(issue.field) ?? [];
      arr.push(issue.message);
      warningsByField.set(issue.field, arr);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-6 shadow-md"
    >
      <h2 className="text-lg font-semibold text-zinc-900">
        Eingaben für deinen 12-Wochen Bankdrückplan
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Alter (Jahre)"
          value={ageYears}
          onChange={setAgeYears}
          errors={errorsByField.get("ageYears")}
          warnings={warningsByField.get("ageYears")}
        />

        <Field
          label="Körpergewicht (kg)"
          value={bodyweightKg}
          onChange={setBodyweightKg}
          errors={errorsByField.get("bodyweightKg")}
          warnings={warningsByField.get("bodyweightKg")}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-800">
            Trainingstage/Woche
          </label>
          <div className="inline-flex gap-2">
            {(["3", "4"] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setTrainingDaysPerWeek(val)}
                className={`flex-1 rounded-full border px-3 py-1 text-sm ${
                  trainingDaysPerWeek === val
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-zinc-300 bg-white text-zinc-800"
                }`}
              >
                {val} Tage
              </button>
            ))}
          </div>
        </div>

        <Field
          label="TM (Training Max, kg)"
          value={tmKg}
          onChange={setTmKg}
          errors={errorsByField.get("tmKg")}
          warnings={warningsByField.get("tmKg")}
        />

        <Field
          label="Ziel-1RM (kg)"
          value={target1RmKg}
          onChange={setTarget1RmKg}
          errors={errorsByField.get("target1RmKg")}
          warnings={warningsByField.get("targetDelta")}
        />
      </div>

      {validation && validation.warnings.length > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          <ul className="list-inside list-disc space-y-1">
            {validation.warnings.map((w, idx) => (
              <li key={idx}>{w.message}</li>
            ))}
          </ul>
        </div>
      )}

      {validation && validation.errors.length > 0 && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <ul className="list-inside list-disc space-y-1">
            {validation.errors.map((err, idx) => (
              <li key={idx}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
      >
        Plan erstellen
      </button>
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  errors?: string[];
  warnings?: string[];
}

function Field({
  label,
  value,
  onChange,
  errors,
  warnings,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-zinc-800">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {errors &&
        errors.map((err, idx) => (
          <p
            key={idx}
            className="text-xs text-red-600"
          >
            {err}
          </p>
        ))}
      {warnings &&
        warnings.map((w, idx) => (
          <p
            key={idx}
            className="text-xs text-amber-600"
          >
            {w}
          </p>
        ))}
    </div>
  );
}

