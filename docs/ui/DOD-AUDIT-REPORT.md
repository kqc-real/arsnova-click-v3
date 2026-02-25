# DoD-Audit: Material Design 3 Compliance

**Datum:** 2026-02-25  
**Basis:** ADR 0005, PR-CHECKLIST-UI.md, STYLEGUIDE.md

---

## 1) Tailwind

| Kriterium | Status | Details |
|-----------|--------|---------|
| Kein Tailwind in `apps/frontend` | ✅ Bestanden | Keine Tailwind-Klassen, Configs oder Utilities |
| Kein Tailwind im gesamten Repository | ✅ Ausnahme dokumentiert | `apps/landing` nutzt Tailwind (Astro-App). In ADR 0005 als Ausnahme mit Scope, Dauer, Rueckbauplan dokumentiert. |

---

## 2) Angular Material Komponenten

| Kriterium | Status | Details |
|-----------|--------|---------|
| Material als Standard fuer interaktive UI | ✅ Bestanden | mat-button, mat-card, mat-form-field, mat-select, mat-input, mat-button-toggle, mat-chip-set, mat-icon durchgaengig genutzt |
| Eigenkomponenten nur wo Material nicht reicht | ✅ Bestanden | Code-Slots-Anzeige, Server-Status-Dot, Preset-Toast sind app-spezifisch; nutzen Tokens |

---

## 3) Tokens (Farben, Typografie, Shape, Elevation)

| Kriterium | Status | Details |
|-----------|--------|---------|
| Farben aus Tokens | ✅ Bestanden | 0 hardcoded Hex/RGB in `apps/frontend/src` |
| Typografie aus Tokens | ⚠️ Teilweise | `--mat-sys-body-*`, `--mat-sys-title-*`, `--mat-sys-display-*` genutzt. Code-Slots und Session-Code nutzen `font-size`/`font-weight` in rem – fachlich begruendet (Monospace, groessere Darstellung). |
| Shape aus Tokens | ✅ Bestanden | `--mat-sys-corner-*` durchgaengig |
| Elevation aus Tokens | ✅ Bestanden | `--mat-sys-level3` im Preset-Toast |
| App-Tokens auf System-Tokens gemappt | ✅ Bestanden | `--app-*` in styles.scss definiert, mappen auf `--mat-sys-*` |

---

## 4) Override-Policy

| Kriterium | Status | Details |
|-----------|--------|---------|
| Keine fragilen Material-DOM-Overrides | ✅ Bestanden | Kein `::ng-deep`, keine `.mat-mdc-*` Selektoren in Komponenten |
| Anpassungen nur ueber offizielle APIs | ✅ Bestanden | `mat.theme()`, `mat.card-overrides()` in styles.scss |

---

## 5) Layout und SCSS-Patterns

| Kriterium | Status | Details |
|-----------|--------|---------|
| Zentrale Layout-Patterns genutzt | ✅ Bestanden | `l-page`, `l-section`, `l-stack` (xs, sm) in Home, Quiz, Session |
| Kein einmaliger Spacing-Hack | ✅ Bestanden | Spacing ueber Pattern-Gaps und konsistente rem-Werte |
| Struktur vs. Semantik getrennt | ✅ Bestanden | Layout-Klassen vs. Token-basierte Farben/Typo |

---

## 6) Theme-Foundation

| Kriterium | Status | Details |
|-----------|--------|---------|
| Globales `mat.theme()` auf html | ✅ Bestanden | styles.scss |
| Light/Dark ueber color-scheme | ✅ Bestanden | `html.dark`, `html.light`, `color-scheme: light dark` |
| Preset (Serioes/Spielerisch) ueber Theme | ✅ Bestanden | `html.preset-playful` mit alternativer Palette |

---

## 7) Accessibility und States

| Kriterium | Status | Details |
|-----------|--------|---------|
| Light/Dark geprueft | ✅ Manuell moeglich | Theme-Switcher vorhanden |
| Fokuszustand sichtbar | ✅ Bestanden | Material-Komponenten haben Default-Focus; `focus-visible` bei Custom-Elementen |
| Disabled/Error/Hover getestet | ⚠️ Manuell erforderlich | Beitreten-Button disabled-State; joinError-Anzeige |
| `mat.strong-focus-indicators()` | ✅ Bestanden | In styles.scss aktiviert |

---

## 8) Dokumentation

| Kriterium | Status | Details |
|-----------|--------|---------|
| TOKENS.md aktuell | ✅ Bestanden | Definiert App-Tokens, Theme-Konfiguration |
| Ausnahmen dokumentiert | ✅ Bestanden | Landing Tailwind (ADR 0005), theme-color (ADR 0005, TOKENS.md) |

---

## Bekannte Ausnahmen / Empfehlungen

### A) `index.html` theme-color
- **Wert:** `#f5f5f5` (light), `#1c1b1f` (dark)
- **Grund:** HTML meta `theme-color` unterstuetzt keine CSS-Variablen.
- **Status:** In ADR 0005 und TOKENS.md dokumentiert.

### B) Landing-App Tailwind
- **Scope:** `apps/landing` (Astro, nicht Angular)
- **Status:** In ADR 0005 als Ausnahme dokumentiert.

### C) Spacing-Werte (rem)
- Komponenten nutzen 0.25rem, 0.5rem, 0.75rem, 1rem – konsistent mit Layout-Pattern-Skala.
- M3 hat keine Spacing-Tokens; rem-Skala ist akzeptabel.

### D) Typografie-Ausnahmen
- Code-Slots, Code-Input: groessere Monospace-Schrift – fachlich begruendet.
- Session-Code-Anzeige: `clamp()` fuer responsive Groesse.

---

## Zusammenfassung

| Kategorie | Bestanden | Teilweise | Offen |
|----------|-----------|-----------|-------|
| DoD-Kriterien | 21 | 2 | 0 |
| Gesamtbewertung | **Konform** | | |

Die `apps/frontend`-UI erfuellt die DoD-Kriterien der ADR 0005. Ausnahmen sind dokumentiert; `mat.strong-focus-indicators()` ist aktiviert.
