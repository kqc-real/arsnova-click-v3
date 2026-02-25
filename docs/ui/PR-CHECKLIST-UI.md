# PR-Checklist UI (Angular Material 3)

Diese Checkliste ist fuer alle PRs mit UI-Aenderungen in `apps/frontend` verpflichtend.

## 1) Design-System-Konformitaet
- [ ] Es wurden keine Tailwind-Klassen, Tailwind-Configs oder Tailwind-Utilities eingefuehrt.
- [ ] Neue interaktive UI nutzt primaer Angular-Material-Komponenten.
- [ ] Eigenkomponenten wurden nur dort verwendet, wo Material funktional nicht ausreicht.

## 2) Theming und Tokens
- [ ] Farben, Typografie, Shape und Elevation kommen aus Tokens.
- [ ] Keine hardcoded Hex-/RGB-Werte fuer Standard-UI-Semantik.
- [ ] App-Semantik-Tokens (`--app-*`) sind auf System-Tokens (`--mat-sys-*`) gemappt.
- [ ] Neue Token-Bedarfe sind in `docs/ui/TOKENS.md` ergaenzt oder begruendet.

## 3) Angular-Material-Overrides
- [ ] Keine fragilen Overrides gegen interne Material-DOM-Strukturen.
- [ ] Anpassungen an Material-Komponenten erfolgen ueber `mat.theme-overrides(...)` oder `<component>-overrides(...)`.
- [ ] Keine Deep-Selector-Hacks fuer Material-Komponenten.

## 4) Layout und SCSS-Patterns
- [ ] Layout wurde ueber zentrale Pattern (Stack, Cluster, Grid, Inset, Section) umgesetzt.
- [ ] Kein einmaliger Spacing-/Layout-Hack ohne Wiederverwendungsabsicht.
- [ ] Struktur-Styles und visuelle Semantik sind getrennt.

## 5) Accessibility und States
- [ ] Light/Dark wurde geprueft.
- [ ] Fokuszustand ist sichtbar und kontrastreich.
- [ ] Disabled, Error, Hover, Focus wurden getestet.
- [ ] Kontrast ist fuer relevante Text/Surface-Kombinationen plausibel.

## 6) Regression und Qualitaet
- [ ] Betroffene Screens wurden manuell geprueft (Desktop + relevante Breakpoints).
- [ ] Es gibt keine visuelle Regression bei bestehenden Material-Komponenten.
- [ ] Ueberfluessige Alt-Styles wurden entfernt (kein paralleler Stilpfad).

## 7) Dokumentation
- [ ] ADR `0005` wurde beachtet.
- [ ] Styleguide und Tokens-Doku wurden bei Bedarf aktualisiert.
- [ ] Ausnahmen (falls vorhanden) sind dokumentiert mit Scope, Dauer und Rueckbauplan.

## Reviewer-Entscheidung
- [ ] Freigabe
- [ ] Freigabe mit Auflagen
- [ ] Aenderungen erforderlich
