# Weekly Check-in & Auto-Regulation

## Ziel
Der Wochen-Check-in ist eine **kurze** Abfrage, die:
- Überlastung früh erkennt
- Progression steuert
- die Plan-Engine deterministisch hält

20–30 Sekunden.

---

## Minimaler Check-in (v1)
1) **Einheiten abgeschlossen?**
   - “alle”
   - “1 verpasst”
   - “2+ verpasst”

2) **Reps/Technik**
   - “alles sauber”
   - “leichte Abweichungen”
   - “deutlich”

3) **Schmerz (0–10)**
   - optional Region (Schulter/Elle/Handgelenk)

---

## Entscheidungslogik (deterministisch)
Output: `next_week_adjustment_kg` + optional `mode_change`.

### A) Grüne Woche
- alle Einheiten
- alles sauber
- Schmerz <= 3

Aktion:
- adjustment = +2.5 kg (für alle %TM-Sätze nächste Woche)
- Single-Startvorschlag +2.5 kg

### B) Gelbe Woche
- 1 Einheit verpasst ODER leichte Abweichungen ODER Schmerz 4–5

Aktion:
- adjustment = 0 kg
- Hinweis: Technik priorisieren, Pausen verlängern

### C) Rote Woche
- 2+ Einheiten verpasst ODER deutlich ODER Schmerz >= 6

Aktion:
- adjustment = -2.5 kg (oder -5% falls Nutzer sehr hohe Lasten fährt)
- Singles: ersetzen durch RPE 6–7 Technik-Single oder streichen
- optional: nächste Woche “Mini-Deload” markieren

### Schmerz Safety
Bei Schmerz >= 6:
- klarer Warnhinweis:
  - “Keine schweren Singles. Volumen halbieren. Wenn Schmerz bleibt: medizinisch abklären.”

---

## TM-Update Checkpoint (Woche 4 und 8)
Dialog:
- bestes Single Gewicht
- RPE (7–9)

Berechnung:
1) Einfach: new_TM = single_weight - 7.5 kg (RPE8-Annahme)
2) Genauer: e1RM und dann TM
   - e1RM = single_weight / 0.92 (RPE8)
   - new_TM = e1RM * 0.90
   - runden

Audit Trail speichern:
- week
- old_tm
- single_weight
- rpe
- new_tm
- method
