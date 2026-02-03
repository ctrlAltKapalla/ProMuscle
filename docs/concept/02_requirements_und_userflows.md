# Requirements & User Flows

## Functional Requirements (Must)
1. **Input-Erfassung**
   - Alter (Jahre)
   - Körpergewicht (kg)
   - Trainingstage/Woche (3 oder 4)
   - TM (kg)
   - Zielgewicht (Ziel-1RM in kg)

2. **Plan-Generierung**
   - Generiert einen 12-Wochen-Plan in 3 Blöcken (4 Wochen/Block)
   - Pro Woche: Einheiten A, B, C (und optional D)
   - Einheit A: RPE + kg (Top Single) + Backoffs (kg aus %TM)
   - Einheit B/C: %TM + kg (mit Rundung)
   - Deload/Taper-Wochen fest im Template (W4, W8, W11/12)

3. **Plan-Anzeige**
   - „Planblatt“-Layout (Header, Blocktitel, Erklärungstext, Tabelle)
   - Tabelle: Zeilen = Wochen, Spalten = Einheiten
   - Jede Einheit zeigt Sätze×Wdh + Ziel (RPE oder %) + kg
   - Fußnoten/Regeln sichtbar: Rundung, Anpassungen, Sicherheitsregeln

4. **Ziel-Machbarkeit (12 Wochen)**
   - App berechnet anhand TM, Alter, Trainingstage eine **heuristische Machbarkeit**:
     - Likely / Possible / Unlikely
   - Zeigt Begründung + Empfehlung (z. B. 16 Wochen statt 12)

5. **Wöchentlicher Check-in (Recommended, v1 optional)**
   - Minimaler Wochenabschluss: “alle Einheiten geschafft?”, “Reps verfehlt?”, “Schmerz 0–10”
   - Regelbasierte Anpassung für nächste Woche:
     - +2,5 kg / 0 / -2,5 kg (oder prozentual)

## Non-Functional Requirements (Must)
- **Deterministisch:** gleiche Inputs → gleicher Plan
- **Testbar:** Berechnungseinheit als pure function (Unit Tests möglich)
- **Offline-first möglich:** Plan kann lokal (LocalStorage) gespeichert werden
- **Barrierearm:** gute Lesbarkeit, mobile nutzbar (Tabelle scrollt/stackt)

## User Flows

### Flow A: Schnellstart (MVP)
1. User öffnet App → sieht Input-Card
2. Eingabe: Alter, Gewicht, Tage, TM, Zielgewicht
3. Klick “Plan erstellen” (oder live)
4. App zeigt:
   - Ziel-Machbarkeitsampel + Erklärung
   - 12-Wochen Planblätter (Block 1–3)
5. User kann speichern (LocalStorage) / Reset

### Flow B: Wöchentlicher Check-in
1. User öffnet App → “Woche X Check-in”
2. 3 Fragen beantworten (30 Sekunden)
3. App passt Week X+1 Lasten an (oder empfiehlt Deload)
4. App zeigt “Änderungen vorgenommen: …” (auditierbar)

### Flow C: TM Update (nach Woche 4 / 8) — optional, aber stark empfohlen
1. App fordert “Top Single Gewicht + RPE” an
2. App berechnet e1RM und setzt neues TM
3. Plan für nächste Blöcke wird mit neuem TM neu berechnet
