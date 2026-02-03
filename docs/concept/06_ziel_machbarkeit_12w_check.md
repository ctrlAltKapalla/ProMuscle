# Ziel-Machbarkeit in 12 Wochen (Heuristik)

## Ziel
Der Nutzer gibt `TM` und `Zielgewicht` (Ziel-1RM) an. Die App soll bewerten, ob das Ziel in 12 Wochen **wahrscheinlich**, **möglich** oder **unwahrscheinlich** ist, basierend auf:
- Alter
- Trainingstage/Woche
- TM (als Proxy für aktuelles Kraftniveau)

Wichtig:
- Das ist **keine Garantie**, sondern eine **konservative Plausibilitätsprüfung**.
- Es bleibt deterministisch und erklärbar.

---

## 1) Aktuelles 1RM schätzen
Standardannahme v1:
- `TM = 0.90 * aktuelles_realistisches 1RM`
- Also: `estimated_current_1rm = TM / 0.90`

Beispiel:
- TM 80 → e1RM ≈ 88.9 kg

---

## 2) Erwarteten 12-Wochen-Zuwachs schätzen (Range)
Wir schätzen einen realistischen Zuwachsbereich abhängig von Alter und Trainingstagen.

### Age Factor
- <= 35: 1.00
- 36–45: 0.90
- 46–55: 0.80
- > 55: 0.70

### Days Bonus
- 3 Tage: +0 kg
- 4 Tage: +1.0 kg (Bonus, weil zusätzlicher Techniktag)

### Baseline Gain (Prozent vom e1RM)
Konservative Spannen:
- `gain_low = e1RM * 0.03 * age_factor + days_bonus`
- `gain_high = e1RM * 0.06 * age_factor + 2*days_bonus`

Caps:
- `gain_low` min 2.5 kg
- `gain_high` max 12.5 kg (ohne Retraining-Input)

Optional v1.1:
- wenn `previous_best_1rm_kg >= target_1rm_kg`: Retraining-Bonus +2.5–7.5 kg auf `gain_high`.

---

## 3) Klassifikation
- `required_gain = target_1rm - e1RM`

Dann:
- **Likely:** `required_gain <= gain_low`
- **Possible:** `gain_low < required_gain <= gain_high`
- **Unlikely:** `required_gain > gain_high`

Sonderfall:
- `required_gain <= 0` → “Ziel vermutlich bereits erreichbar; Test empfohlen.”

---

## 4) UI-Ausgabe (explainable)
Die App zeigt:
- geschätztes aktuelles 1RM (aus TM)
- benötigte Steigerung (kg)
- erwartete Spanne (kg)
- Klassifikation + Empfehlung

Beispieltext:
- “Mit TM 80 kg schätzen wir dein 1RM auf ~89 kg. Für 100 kg brauchst du +11 kg. Für 12 Wochen erwarten wir konservativ +2.5 bis +5.5 kg. Bewertung: Unlikely → Empfehlung: 16 Wochen oder Zwischenziel 95 kg.”

---

## 5) Grenzen (klar kommunizieren)
- Keine Berücksichtigung von Schlaf, Ernährung, Technik, Trainingsalter
- Deshalb Label: “Plausibilitätscheck (konservativ)”
