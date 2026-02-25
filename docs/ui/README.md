# UI-Dokumentation Einstieg

## Zweck
Dieses Verzeichnis enthaelt die verbindlichen UI-Standards fuer arsnova.click v3 auf Basis von Angular Material 3.
Startpunkt fuer alle UI-Aenderungen ist diese Datei.

## Reihenfolge fuer die Arbeit
1. ADR lesen: `docs/architecture/decisions/0005-use-angular-material-design.md`
2. Umsetzungsregeln lesen: `docs/ui/STYLEGUIDE.md`
3. Token-Nutzung pruefen: `docs/ui/TOKENS.md`
4. PR vor Merge validieren: `docs/ui/PR-CHECKLIST-UI.md`

## Wann welches Dokument?
- `STYLEGUIDE.md`: Wie Components, Layout und Theming konkret gebaut werden.
- `TOKENS.md`: Welche Tokens erlaubt sind und wie neue Tokens eingefuehrt werden.
- `PR-CHECKLIST-UI.md`: Verbindliche Review-Kriterien vor Freigabe.

## Verbindlichkeit
Alle UI-PRs in `apps/frontend` muessen diese Regeln einhalten.
Ausnahmen sind nur mit explizitem Review, Zeitlimit und Rueckbauplan erlaubt.
Verbindliche ADR-Grundlage inkl. vollstaendiger DoD: `docs/architecture/decisions/0005-use-angular-material-design.md`

## DoD Quick Check (UI)
Eine UI-Aenderung ist erst fertig, wenn:
- kein Tailwind im Repository genutzt wurde
- Tokens statt hardcoded Farben/Typo/Shape/Elevation verwendet wurden
- keine fragilen Material-DOM-Overrides eingefuehrt wurden
- Light/Dark sowie Fokus/Hover/Disabled/Error geprueft wurden
- `docs/ui/PR-CHECKLIST-UI.md` vollstaendig abgearbeitet wurde
