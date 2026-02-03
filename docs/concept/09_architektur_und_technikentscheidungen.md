# Architektur & Technikentscheidungen

## Grundsatz
Kernlogik = deterministischer Plan-Generator (pure function) + UI-Renderer.

## Module
1) Input + Validierung
2) Plan Engine: generatePlan(profile, template)
3) Renderer: Planblatt (Header/Blocks/Tabelle)
4) Check-in Engine: applyWeeklyAdjustment
5) Storage: LocalStorage

## Template-Strategie
Templates als Daten (JSON/TS objects), nicht in UI hardcoded.

## Determinismus & Auditierbarkeit
- jede Anpassung wird geloggt (week, delta, reason)
- plan bleibt nachvollziehbar

## Warum keine KI?
- stabil, testbar, erklärbar
- KI nur optional für Coaching-Texte (nicht Kern)
