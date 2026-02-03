# Berechnung & Rundung

## 1) Rundungsstandard (Plates)
- Default `increment = 2.5 kg`
- Funktion: `round_to_increment(x, inc)` = nächstes Vielfaches von `inc` nach **nearest**.
  - Ties (z. B. genau zwischen zwei Stufen) → **down** (konservativ)

Beispiele (inc=2.5):
- 56.0 → 55.0 (Abstand 1.0) vs 57.5 (Abstand 1.5) → 55.0
- 71.3 → 72.5
- 72.5 → 72.5

## 2) Umrechnung %TM → kg
`weight_kg = round_to_increment(TM * percent, increment)`

Konventionen:
- Prozentwerte werden als Dezimalzahlen gespeichert (0.75 statt 75).
- Die Anzeige zeigt “@75%TM: 60 kg”.

## 3) Einheit A: RPE + kg (Top Single)
Da RPE nicht “berechnet” werden kann, zeigt die App:
- Ziel-RPE (z. B. 8)
- Startgewichtsvorschlag (kg)
- Schrittregel: “+/-2.5 kg bis Ziel-RPE getroffen”

### Startgewichtsvorschlag (konservativ)
Für v1:
- RPE 7.0 → `start = round(TM * 0.92)`
- RPE 7.5 → `start = round(TM * 0.94)`
- RPE 8.0 → `start = round(TM * 0.96)`
- RPE 8.5 → `start = round(TM * 0.98)`
- RPE 9.0 → `start = round(TM * 1.00)` (nur wenn Technik stabil)

Alle Starts: rundung auf increment.

### Anzeige-Text (wichtig, damit Nutzer es korrekt ausführt)
Beispiel:
- “Top Single 1×1 @RPE 8 — Start: 77.5 kg (±2.5 kg nach Gefühl)”

## 4) Backoffs nach Single (deterministisch)
Backoff-Gewichte kommen **immer** aus %TM (nicht aus Single).
Vorteil:
- Plan bleibt stabil und testbar.
- Single dient als “Skill/Readiness”, nicht als tägliche Neubewertung des ganzen Plans.

## 5) Optional: Wöchentliche Last-Offsets (über Check-in)
Zusätzlicher Faktor `week_adjustment_kg` (global für alle %TM-Lasten):
- Standard 0
- Bei guter Woche +2.5
- Bei schlechter Woche -2.5
- Diese Offsets werden dokumentiert (“Audit Trail”).

## 6) Fehler- und Sicherheitsregeln
- Keine Last wird über `target_1rm_kg` erzwungen (außer Testlogik in Woche 12).
- Woche 12 Test: Gewichte werden als Vorschlag angezeigt; Nutzer entscheidet final.
- Bei Schmerzflag (siehe Check-in) werden schwere Singles deaktiviert und durch Technik-Session ersetzt.

## 7) Determinismus
Für Reproduzierbarkeit:
- Alle Rundungen deterministisch.
- Keine Zufallswerte, keine “KI”-Schätzungen im Kernplan.
