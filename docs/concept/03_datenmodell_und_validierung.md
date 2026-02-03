# Datenmodell & Validierung

## Input-Schema (UserProfile)
Pflichtfelder:
- `age_years` (int)
- `bodyweight_kg` (float)
- `training_days_per_week` (enum: 3 | 4)
- `tm_kg` (float)
- `target_1rm_kg` (float)

Empfohlene Defaults (intern):
- `rounding_increment_kg` = 2.5
- `tm_definition` = "tm_is_90pct_1rm" (siehe unten)
- `start_date` optional (für “Stand”-Datum; sonst aktuelles Datum)

Optional (v1.1):
- `equipment` (enum): "bench_only" | "safeties" | "spotter"
- `pain_flags` (shoulder/elbow/wrist) boolean
- `previous_best_1rm_kg` (wenn vorhanden erhöht das die Ziel-Machbarkeitsprognose)

## TM-Definition (wichtig für Konsistenz)
Damit die App reproduzierbar ist, wird in v1 festgelegt:
- **TM entspricht 90% eines realistischen 1RM** (konservativ).
- Daraus folgt für Prognosen: `estimated_current_1rm = tm_kg / 0.90`.

Wenn du später mehr Flexibilität willst:
- `tm_definition` als enum:
  - `tm_is_90pct_1rm` (Default)
  - `tm_equals_estimated_1rm`
  - `custom_factor` (mit `tm_factor`)

## Validierungsregeln
### Alter
- min 14, max 90
- Fehlermeldung: “Alter muss zwischen 14 und 90 liegen.”

### Körpergewicht
- min 35 kg, max 250 kg
- Fehlermeldung: “Gewicht muss zwischen 35 und 250 kg liegen.”

### Trainingstage/Woche
- nur 3 oder 4
- Hinweistext: “3 Tage Standard; 4 Tage fügt einen leichten Technik-Tag hinzu.”

### TM
- min 20 kg, max 250 kg
- Muss Vielfaches von 0,5 sein (praktisch); die App rundet intern aber auf `rounding_increment_kg`
- Fehlermeldung: “TM unplausibel. Bitte kg-Wert prüfen.”

### Zielgewicht
- min TM, max 250 kg
- Warnung (nicht blockierend) falls `target_1rm_kg > estimated_current_1rm + 20` (sehr aggressiv)

## Output-Datenmodell (Plan)
### Plan
- `meta`: title, stand_date, tm_kg, target_1rm_kg, rounding_increment
- `blocks[]`: 3 Blöcke
  - block_title, block_subtitle, weeks[]
- `weeks[]`:
  - week_index (1..12)
  - sessions[] (A,B,C,(D))
- `session`:
  - label (A/B/C/D)
  - description (Heavy/Skill, Pause/Volumen, Speed/Variante, Recovery)
  - entries[] (list of exercises)
- `entry`:
  - exercise_name (Bench Press / Pause Bench / Close-Grip Bench / Speed Bench / optional accessory label)
  - prescription: sets, reps, intent (RPE|PercentTM), target_value, computed_weight_kg
  - notes (e.g. “+/-2,5 kg je nach RPE”)

## Persistenz (v1)
- LocalStorage: `userProfile`, `currentPlan`, optional `checkins[]`, optional `tmUpdates[]`
