# ProMuscle — Projektanalyse

**Stand:** 2026-03-04  
**Analysiert von:** Tom (DevOps Agent)  
**Repo:** `git@github-promuscle:ctrlAltKapalla/ProMuscle.git`

---

## 1. Produkt-Überblick

**ProMuscle** ist eine rein client-seitige Webapp zur deterministischen Generierung von **12-Wochen Bankdrück-Trainingsplänen**. Keine KI, kein Backend — der Kern ist eine pure function (`generatePlan`), die aus Nutzerprofil-Inputs einen vollständigen Plan erzeugt.

**Zielgruppe:** Kraftsportler (Powerlifting / allgemeines Bankdrücken), die einen strukturierten, auf RPE- und %TM-basierenden Progressionsplan wollen.

---

## 2. Tech-Stack

| Schicht | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| UI-Library | React | 19.2.3 |
| Sprache | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 (via PostCSS) |
| Hosting | Render.com | Free tier (Node runtime) |
| Persistence | LocalStorage | (geplant, noch nicht implementiert) |
| Tests | — | **kein Test-Runner konfiguriert** |
| CI/CD | — | **kein CI vorhanden** |
| Backend | — | keins (pure client-side) |
| DB | — | keins |

**Node-Anforderung:** `>=20.9.0 <23.0.0`

**Deployment:** `render.yaml` konfiguriert `web/` als Node-Service. Build: `npm install && npm run build`. Start: `npm start`.

---

## 3. Repository-Struktur

```
ProMuscle/
├── render.yaml                    # Render.com Deploy-Konfiguration
├── docs/concept/                  # 10 Konzept-Docs (Spezifikation v1)
│   ├── README.md
│   ├── 01_idee_und_scope.md
│   ├── 02_requirements_und_userflows.md
│   ├── 03_datenmodell_und_validierung.md
│   ├── 04_plan_template_12w.md
│   ├── 05_berechnung_und_rundung.md
│   ├── 06_ziel_machbarkeit_12w_check.md
│   ├── 07_weekly_checkin_und_autoregulation.md
│   ├── 08_ui_styleguide_pdf_look.md
│   ├── 09_architektur_und_technikentscheidungen.md
│   └── 10_testfaelle_und_acceptance_criteria.md
└── web/                           # Next.js App
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx           # Single-Page-Root
    │   │   ├── layout.tsx         # App-Shell
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── UserProfileForm.tsx
    │   │   ├── PlanSheet.tsx
    │   │   ├── WeeklyCheckinForm.tsx
    │   │   └── TmUpdateDialog.tsx
    │   └── lib/
    │       ├── domain/types.ts    # Zentrale Domänentypen
    │       ├── math/
    │       │   ├── rounding.ts    # roundToIncrement (konservativ)
    │       │   └── percent.ts     # percentOfTM
    │       ├── plan/
    │       │   ├── generatePlan.ts
    │       │   ├── template.ts    # BASE_TEMPLATE (12W, 3 Blöcke)
    │       │   ├── topSingle.ts   # RPE → Startgewicht
    │       │   └── tmUpdate.ts    # TM-Neuberechnung aus Single + RPE
    │       ├── heuristics/
    │       │   └── feasibility.ts # Machbarkeits-Ampel (Likely/Possible/Unlikely)
    │       ├── checkin/
    │       │   └── engine.ts      # Wöchentlicher Check-in + Adjustment
    │       └── validation/
    │           └── userProfile.ts # Validierung aller Eingabefelder
    └── package.json
```

---

## 4. Domänenlogik & Architektur

### 4.1 Kern-Architektur

```
UserProfile → generatePlan() → Plan
                                 ↓
                          PlanBlock[3]
                          (je 4 Wochen)
                                 ↓
                          PlanWeek → PlanSession[A,B,C,(D)]
                                          ↓
                                    PlanEntry (Sets×Reps + Intent + kg)
```

Vollständig deterministisch: gleiche Inputs → gleicher Plan. Keine Zufälligkeit, kein State außer React-State.

### 4.2 Gewichtsberechnung

**%TM-Einheiten (B/C):**
```
computedWeightKg = roundToIncrement(tmKg * percent, increment)
```

**RPE-Einheiten (A — Top Single):**
```
factor = RPE_START_FACTORS[rpe]  // z. B. RPE 8.0 → 0.96
startWeight = roundToIncrement(tmKg * factor, increment)
```

RPE-Faktoren: 7.0→0.92, 7.5→0.94, 8.0→0.96, 8.5→0.98, 9.0→1.0 (mit Interpolation für Zwischenwerte)

**Rundung (konservativ bei Ties):**
```
roundToIncrement(value, 2.5) → nächstes 2.5-Vielfaches, bei .5 nach unten
```

### 4.3 Plan-Template

12 Wochen in 3 Blöcken (à 4 Wochen) aus `template.ts`:
- **Block 1** — Aufbau & Technik (kein Grind, W4 = Deload)
- **Block 2** — Kraft-Aufbau (erhöhte Intensität, W8 = Deload)
- **Block 3** — Peak & Test (W11/12 = Taper/Test)

Pro Woche 3 Sessions (A, B, C), optional D:
- **A** — Heavy/Skill: Top Single (RPE) + Backoffs (%TM)
- **B** — Pause/Volumen: %TM
- **C** — Speed/Variante: %TM
- **D** — Recovery/Technik: 6×3 @ RPE 6 (nur bei 4 Tagen/Woche)

### 4.4 Machbarkeits-Heuristik

```
estimated_1rm = tmKg / 0.9
gainLow  = e1rm * 0.03 * ageFactor + daysBonus   (min 2.5 kg)
gainHigh = e1rm * 0.06 * ageFactor + 2*daysBonus (max 12.5 kg)
```

Alters-Faktoren: ≤35→1.0, ≤45→0.9, ≤55→0.8, >55→0.7. Ergebnis: `Likely / Possible / Unlikely / AlreadyReachable`.

### 4.5 Wöchentlicher Check-in

3-Fragen-Input → Ampel-Auswertung:
- **Grün** (alle Einheiten, saubere Technik, Schmerz ≤3) → +2.5 kg
- **Rot** (2+ verpasst ODER Technik schlecht ODER Schmerz ≥6) → -2.5 kg + Mini-Deload-Flag
- **Gelb** (sonst) → 0 kg

Anpassung greift auf `computedWeightKg` aller `PercentTM`-Entries einer Woche.

### 4.6 TM-Update (nach W4/W8)

**Main-Branch (simpel):**
```
newTM = single - 7.5 kg  (RPE 8), ±2.5 für RPE 7/9
```

**Feature-Branch `feature/check-week-tm` (verbessert, präziser):**
```
rir = rpe === 7 ? 3 : rpe === 8 ? 2 : 1
estimated1rm = singleWeight * (1 + (1 + rir) / 30)  // Epley
newTM = min(estimated1rm * 0.9, singleWeight)        // gecappt
```
Außerdem: RTS-RPE-Tabelle aus `rpe/rtstable.ts` (12 Reps × 9 RPE-Stufen, Mike Tuchscherer) + RPE-Info-Modal in der UI.

---

## 5. Frontend / UI

### 5.1 Komponenten

| Komponente | Funktion |
|---|---|
| `UserProfileForm` | 5 Pflichtfelder, Live-Validierung, Submit-Gate |
| `PlanSheet` | PDF-ähnliche Tabellenansicht, 3 Blöcke, responsive |
| `WeeklyCheckinForm` | 3-Fragen Check-in, Toggle-Buttons + Slider |
| `TmUpdateDialog` | Single-Gewicht + RPE → TM-Vorschlag, 2-Step-Confirm |

### 5.2 Layout

Single-Page-App: Split-Layout (links: Forms, rechts: PlanSheet). Responsive via Tailwind (`lg:flex-row`). Keine Routing/Pages außer `/`.

### 5.3 Fonts & Metadata

- Google Fonts: Geist + Geist Mono (via `next/font`)
- **⚠ Metadata noch Default:** `title: "Create Next App"` — nicht production-ready

---

## 6. Tests

### Vorhandene Test-Dateien

| Datei | Was getestet |
|---|---|
| `math/rounding.test.ts` | `roundToIncrement` — 3 Testfälle |
| `math/percent.test.ts` | `percentOfTM` |
| `heuristics/feasibility.test.ts` | `classifyFeasibility` — Spec-Beispiel |
| `plan/topSingle.test.ts` | `getTopSingleStartWeight` |

### Kritisches Gap

**Kein Test-Runner installiert oder konfiguriert.**
- Kein Vitest, kein Jest in `devDependencies`
- Kein `test`-Script in `package.json`
- Tests sind vorhanden aber **nicht ausführbar**

---

## 7. Infra & CI/CD

| Aspekt | Status |
|---|---|
| Hosting | Render.com Free Tier (configured via `render.yaml`) |
| Build | `npm install && npm run build` (Next.js static/SSR) |
| CI/CD | **Nicht vorhanden** — kein `.github/workflows/` |
| Branch Protection | **Unbekannt** — kein Nachweis |
| Deploy-Key | Eingerichtet (`~/.ssh/id_promuscle`, Host-Alias `github-promuscle`) |
| Lint | ESLint 9 + `eslint-config-next` konfiguriert |

---

## 8. Branches & Git-History

| Branch | Commits | Beschreibung |
|---|---|---|
| `main` | 3 | Init → Web-Projekt → Render-Config + Skills |
| `feature/check-week-tm` | +3 | Verbesserte TM-Berechnung (Epley), RTS-RPE-Tabelle, RPE-Modal |

`feature/check-week-tm` ist **nicht gemergt** — enthält produktionsreifere TM-Logik.

---

## 9. Gaps & Risiken

### P0 — Blockierend

| # | Problem | Impact |
|---|---|---|
| 1 | **Kein Test-Runner** — Tests vorhanden aber nicht ausführbar | Qualitätssicherung unmöglich |
| 2 | **Kein CI/CD** — kein automatisches Build/Test auf Push | Regressionen unentdeckt |
| 3 | **LocalStorage nicht implementiert** — Spec sagt "offline-first/LocalStorage", Code hat keinen einzigen `localStorage`-Aufruf | Datenverlust bei Page-Reload |

### P1 — Wichtig

| # | Problem | Impact |
|---|---|---|
| 4 | `feature/check-week-tm` nicht gemergt — bessere TM-Logik liegt brach | Main nutzt veraltete, ungenauere Berechnung |
| 5 | App-Metadata default (`"Create Next App"`) | SEO/Branding nicht vorhanden |
| 6 | Kein Error Boundary in React | Unerwartete Fehler crashen die gesamte App |
| 7 | Check-in wendet Anpassung immer auf _letzte_ Woche an (Hardcode in `page.tsx`) | User kann Zielwoche nicht wählen |

### P2 — Nice-to-have

| # | Problem |
|---|---|
| 8 | Kein PWA/Service Worker (trotz Offline-First-Ziel) |
| 9 | `UserProfileForm` Callback-Signatur (`onSubmit(profile, validation)`) — `page.tsx` ignoriert `validation` (zweites Argument) |
| 10 | Keine E2E-Tests (nur Unit-Tests) |
| 11 | `next.config.ts` leer — kein CSP, kein output-mode konfiguriert |
| 12 | Render.com Free Tier: Cold Starts (~30s) bei Inaktivität |

---

## 10. Empfohlene Folge-Tasks

Priorisiert nach Wirkung/Aufwand:

1. **[DevOps]** Test-Runner einrichten (Vitest) + `test`-Script + CI (GitHub Actions: lint + test auf push)
2. **[Dev]** `feature/check-week-tm` in `main` mergen (verbesserte TM-Logik + RPE-Tabelle)
3. **[Dev]** LocalStorage-Persistenz implementieren (Plan speichern/laden)
4. **[Dev]** App-Metadata korrigieren (Titel, Description, OG-Tags)
5. **[Dev]** Error Boundary für PlanSheet + globales Fallback
6. **[Dev]** Check-in: Zielwoche wählbar machen (statt Hardcode auf letzte Woche)

---

## 11. Stärken

- **Saubere Domänenarchitektur:** Klare Trennung von types / math / plan / heuristics / validation
- **Determinismus konsequent umgesetzt:** Pure functions, kein globaler Mutable State
- **Sehr gute Konzept-Dokumentation:** 10 Spec-Dokumente decken alle Aspekte ab
- **Korrekte Rundungslogik:** Konservative Tie-breaking-Regel implementiert
- **RTS-RPE-Tabelle** in Feature-Branch: professionelle Datenquelle (Mike Tuchscherer)
- **Audit Trail:** Plan-Änderungen werden mit Timestamp und Reason geloggt

---

*Analysiert und erstellt von Tom ✨ — ProMuscle Repo-Analyse v1.0*
