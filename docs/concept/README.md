# Bankdrücken Plan-Generator Webapp — Spezifikation (v1)

Diese Spezifikation beschreibt eine Webapp, die ausschließlich für **Bankdrücken** automatisiert Trainingspläne erzeugt und in einer **PDF-ähnlichen** tabellarischen Darstellung anzeigt (kein PDF-Export nötig).

**Plan-Design (fix):**
- 12 Wochen (3 Blöcke à 4 Wochen)
- Standard: **3 Einheiten/Woche**
- Optional: **4. Technik-/Recovery-Tag**
- Einheit A (Tag 1): **RPE + kg** (Auto-Regulation, v. a. Top Single)
- Einheit B/C (Tag 2–3): **%TM + kg** (strukturierte Progression + konsistente Volumen-/Speed-Steuerung)

**User Inputs (Pflicht):**
- Alter
- Körpergewicht
- Trainingstage/Woche (3 oder 4)
- Training Max (TM)
- Zielgewicht (Ziel-1RM)

**Zusätzliche Funktionen (optional, empfohlen):**
- Wöchentlicher Check-in (kurz, deterministisch)
- TM-Update nach Woche 4 und 8 (deterministisch, über Top Single + RPE)

> Hinweis: Die App benötigt keine KI für die Planberechnung. Ein deterministischer Algorithmus ist stabiler, testbar und besser nachvollziehbar.

## Dateien
- `01_idee_und_scope.md`
- `02_requirements_und_userflows.md`
- `03_datenmodell_und_validierung.md`
- `04_plan_template_12w.md`
- `05_berechnung_und_rundung.md`
- `06_ziel_machbarkeit_12w_check.md`
- `07_weekly_checkin_und_autoregulation.md`
- `08_ui_styleguide_pdf_look.md`
- `09_architektur_und_technikentscheidungen.md`
- `10_testfaelle_und_acceptance_criteria.md`
