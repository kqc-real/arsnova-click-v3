# UI Styleguide (Angular Material 3)

## Ziel und Geltungsbereich
Dieser Styleguide definiert verbindliche UI-Regeln fuer `apps/frontend` von arsnova.click v3.
Ergaenzend zur ADR `docs/architecture/decisions/0005-use-angular-material-design.md` beschreibt er die operative Umsetzung im Alltag.

## Grundsaetze
- Angular Material ist der Standard fuer interaktive UI-Elemente.
- Material 3 ist die visuelle und semantische Grundlage.
- Styling ist tokenbasiert und zentral gesteuert.
- Kein Tailwind im Repository.
- Eigenes SCSS ist erlaubt fuer Layout-Patterns und app-spezifische Strukturen.

## Theming und Farbmodus
- Das globale Theme wird auf Root-Ebene (`html`) mit `mat.theme(...)` definiert.
- `color-scheme` steuert Light/Dark-Verhalten.
- Bei Komponenten gilt: Farben nur aus Tokens, keine ad-hoc Hex-Werte.
- Standard-Hintergrund/Farbe fuer die App orientiert sich an `--mat-sys-surface` und `--mat-sys-on-surface`.

## Komponentenrichtlinien
- Neue Features verwenden zuerst Angular-Material-Komponenten.
- Eigenkomponenten sind erlaubt, wenn Material funktional nicht reicht.
- Eigene Komponenten muessen dieselben Tokens verwenden wie Material-Komponenten.
- Keine CSS-Selektoren gegen interne Material-DOM-Strukturen.
- Komponentenanpassungen nur ueber offizielle Override-APIs.

## Token-Nutzung
- System-Tokens: `--mat-sys-*`.
- App-Semantik-Tokens (z. B. Erfolg/Warnung/Info) mappen auf System-Tokens.
- Direkte Farbwerte in Feature-SCSS sind nur mit begruendeter Ausnahme erlaubt.

## Typografie
- Typografie folgt der M3-Type-Scale (Display, Headline, Title, Body, Label).
- Fuer Texte in Komponenten bevorzugt Typo-Tokens wie `--mat-sys-body-medium`.
- Keine freien Font-Groessen/Line-Heights ohne Design-System-Bedarf.

## Shape, Elevation, Borders
- Border-Radius erfolgt ueber Shape-Tokens (z. B. `--mat-sys-corner-*`).
- Schatten/Elevation erfolgt ueber Elevation-Tokens (`--mat-sys-level*`).
- Linien/Outlines nutzen `--mat-sys-outline` oder `--mat-sys-outline-variant`.

## Layout-Patterns (SCSS)
Erlaubte Pattern-Kategorien:
- Stack: vertikales Spacing zwischen Elementen
- Cluster: horizontale Gruppen mit Umbruch
- Grid: responsives Raster
- Inset: konsistente Innenabstaende
- Section/Page-Container: wiederkehrende Seitenstruktur

Regeln:
- Spacing-Werte zentral definieren, nicht pro Feature neu erfinden.
- Keine Utility-Klassen-Flut; stattdessen wiederverwendbare Pattern-Klassen/Mixins.
- Layout und Component-Skin trennen (Struktur vs. visuelle Semantik).

## Accessibility und Interaktion
- Kontrast und Lesbarkeit muessen in Light und Dark erfuellt sein.
- Fokuszustand muss klar sichtbar sein (bei Bedarf `mat.strong-focus-indicators()`).
- Disabled, Error und Hover/Focus-Zustaende nur ueber passende Tokens ausdruecken.

## Beispielmuster
Tokenbasierte Card-Flaeche:

```scss
.panel {
  background: var(--mat-sys-surface-container);
  color: var(--mat-sys-on-surface);
  border: 1px solid var(--mat-sys-outline-variant);
  border-radius: var(--mat-sys-corner-large);
  box-shadow: var(--mat-sys-level1);
}
```

## Preset Spielerisch (Startseite)
- **Hintergrund:** Verlauf mit Primary-/Tertiary-Container (Token `--app-bg-root`).
- **Karten:** Zusaetzlicher Schatten mit Primary-Anteil (`--app-shadow-card-playful`). Nur die ersten beiden Karten (Beitreten, Erstellen) haben Hover: leichtes Anheben + Scale aus der Mitte, nur bei `prefers-reduced-motion: no-preference`.
- **Haupt-CTA:** Der gefuellte Button „Session erstellen“ erhaelt im Spielerisch-Modus einen dezenten Glow (`--app-shadow-cta-glow`).
- **Header:** Gradient, dezenter Primary-Rahmen, `--app-shadow-accent`.
- Alle Werte tokenbasiert in `styles.scss` (html.preset-playful) und Home-Komponente.

## Startseite: Buttons und Toast
- **Button-Hierarchie:** Nur ein gefuellter CTA pro Kontext (z. B. „Session erstellen“ auf der Erstellen-Karte). Uebrige Aktionen als Text-Buttons ohne Umrandung (Bibliothek, Erstellen-Karte: Quiz auswaehlen, Q&amp;A, Hilfe).
- **Toast (Preset-Hinweis):** Zentriert, mit Close-Button; Schliessen per Klick auf Backdrop oder Button. Kein Auto-Close-Timer.
- **Abstaende:** Einheitlicher Button-/Link-Abstand auf Karten ueber `l-stack--sm` (0,5rem).

## Nicht erlaubt
- Tailwind-Klassen im Repository.
- Direkte Ueberschreibung interner Material-Klassen.
- Hardcoded Hex/RGB-Farben fuer Standard-UI-Semantik.
- Wildwuchs an einmaligen Layout-Hacks pro Feature.

## Dokumente
- ADR: `docs/architecture/decisions/0005-use-angular-material-design.md`
- Tokens: `docs/ui/TOKENS.md`
- PR-Checkliste: `docs/ui/PR-CHECKLIST-UI.md`
