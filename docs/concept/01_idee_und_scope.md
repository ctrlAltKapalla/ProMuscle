# Idee & Scope

## Produktidee
Eine Webapp, die aus wenigen Inputs einen **12-Wochen Bankdrücken-Trainingsplan** generiert und ihn in einer **hochlesbaren, PDF-ähnlichen Tabellenansicht** darstellt. Der Plan ist **standardisiert** (Template-basiert) und wird über **TM** und **Auto-Regulation (RPE)** an die Tagesform angepasst.

## Warum Tag 1 (RPE + kg) und Tag 2–3 (%TM + kg)?
**Einheit A (Tag 1)** beinhaltet ein schweres **Top Single** (1×1) als Skill-/Neural-Reiz. Singles sind stark von Tagesform (Schlaf/Stress/Fokus) abhängig. **RPE-Steuerung** verhindert:
- unnötige Grinds und Technikzerfall
- Überlastung an schlechten Tagen
- zu leichte Reize an sehr guten Tagen

**Einheit B & C (Tag 2–3)** sind Volumen-/Pause-/Speed-orientiert, typischerweise submaximal. Hier ist **%TM** sinnvoll, weil:
- Progression klar und konsistent bleibt
- Volumen planbar ist
- Geschwindigkeit/Technik sauber reproduzierbar ist

**Ziel:** optimale Kombination aus Auto-Regulation (Tag 1) und Struktur (Tag 2–3).

## Scope (v1)
### In Scope
- Bankdrücken-Planerstellung (12 Wochen)
- Anzeige in „Planblatt“-Layout (PDF-ähnlich)
- Gewichtsberechnung aus %TM + Rundung
- RPE-Top-Single als Text + Startgewichtsvorschlag
- Optionaler 4. Tag: Technik-/Recovery Bench
- Ziel-Machbarkeitscheck (heuristisch, deterministisch)
- Wöchentlicher Check-in mit Regel-basierten Anpassungen

### Out of Scope (v1)
- KI-Coach, Chat, Freitext-Analyse
- Video-/Technikanalyse
- Multi-Lift Programme (nur Bankdrücken)
- Export/Download (optional später)

## Definitionen (Glossar)
- **TM (Training Max):** konservativer Referenzwert für Trainingsgewichte. In dieser App gilt standardmäßig: **TM ≈ 90% des realistischen 1RM**.
- **%TM:** Last als Prozentsatz des TM.
- **RPE:** subjektive Anstrengungsskala (1–10). RPE 8 = ca. 2 Reps im Tank (RIR ~2).
- **Backoff:** Arbeitssätze nach dem Top Single.
- **Pause Bench:** 1s Pause auf der Brust.
- **Speed Bench:** submaximale Last, maximale Bar-Speed bei sauberer Technik.
