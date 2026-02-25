# Token-Konventionen (Angular Material 3)

## Ziel
Dieses Dokument beschreibt, wie Tokens in arsnova.click v3 definiert, genutzt und erweitert werden.
Es verhindert Design-Drift und sichert eine konsistente Material-3-Umsetzung.

## Token-Ebenen
### 1) System-Tokens (Quelle der Wahrheit)
- Prefix: `--mat-sys-*`
- Herkunft: Angular Material Theme (`mat.theme(...)`) in `styles.scss`
- Beispiele:
  - Farbe: `--mat-sys-primary`, `--mat-sys-surface`, `--mat-sys-on-surface`
  - Typografie: `--mat-sys-body-medium`, `--mat-sys-title-large`
  - Shape: `--mat-sys-corner-medium`, `--mat-sys-corner-large`, `--mat-sys-corner-extra-large`
  - Elevation: `--mat-sys-level1`, `--mat-sys-level3`

### 2) App-Semantik-Tokens (definiert in `styles.scss :root`)
- Prefix: `--app-*`
- Zweck: fachliche Semantik abbilden (z. B. Erfolg, Hinweis, Gefahr, Root-Hintergrund).
- Regel: App-Tokens mappen auf `--mat-sys-*`, nicht auf freie Farbwerte.

Aktuell definierte App-Tokens:

```scss
:root {
  // Status-Farben
  --app-color-success-bg: var(--mat-sys-secondary-container);
  --app-color-success-fg: var(--mat-sys-on-secondary-container);
  --app-color-danger-bg: var(--mat-sys-error-container);
  --app-color-danger-fg: var(--mat-sys-on-error-container);
  --app-color-info-bg: var(--mat-sys-tertiary-container);
  --app-color-info-fg: var(--mat-sys-on-tertiary-container);
  --app-color-warning-bg: var(--mat-sys-surface-variant);
  --app-color-warning-fg: var(--mat-sys-on-surface-variant);

  // Preset-abhaengige Tokens
  --app-bg-root: var(--mat-sys-surface);
  --app-shadow-accent: none;
}

html.preset-playful {
  --app-bg-root: linear-gradient(135deg, ...surface-container-Stufen...);
  --app-shadow-accent: 0 10px 30px -14px var(--mat-sys-primary);
}
```

### 3) Komponententokens
- Anpassungen fuer Angular-Material-Komponenten ueber offizielle Override-APIs.
- Keine direkte Ueberschreibung interner Klassen/DOM-Strukturen.

## Erlaubte Styling-Quellen
- `mat.theme(...)` fuer Theme-Definition
- `mat.theme-overrides(...)` fuer systemnahe Token-Anpassung
- `<component>-overrides(...)` fuer gezielte Komponentenanpassung
- SCSS-Patterns fuer Layout und app-spezifische Strukturen

## Nicht erlaubt
- Hardcoded Hex-/RGB-Farben in Feature-SCSS fuer Standard-UI-Faelle
- Direkte Material-DOM-Overrides mit fragilen Selektoren
- Token-Bypass durch ad-hoc Inline-Styles

## Theme-Konfiguration
Das globale Theme in `styles.scss` nutzt `mat.theme()` mit:

| Preset   | Primary-Palette       | Tertiary-Palette     |
|----------|-----------------------|----------------------|
| Serioes  | `mat.$azure-palette`  | `mat.$cyan-palette`  |
| Spielerisch | `mat.$magenta-palette` | `mat.$violet-palette` |

Light/Dark wird ueber `color-scheme` gesteuert:
- `html` (default): `color-scheme: light dark` (folgt Systemeinstellung)
- `html.dark`: `color-scheme: dark`
- `html.light`: `color-scheme: light`

Preset-Umschaltung via CSS-Klasse `html.preset-playful`.

## Mapping-Regeln
- Farben:
  - Aktionen: `primary` / `on-primary`
  - Flaechen: `surface*` / `on-surface*`
  - Fehler: `error*`
- Typografie:
  - Titel: `title-*`
  - Fliesstext: `body-*`
  - Labels/Controls: `label-*`
- Shape/Elevation:
  - Radius und Schatten nur ueber Token, keine freien Pixelwerte ohne Ausnahme.

## Einfuehrung neuer Tokens
1. Bedarf beschreiben (fachlich + visuell).
2. Pruefen, ob bestehender `--mat-sys-*` Token ausreicht.
3. Falls noetig, neuen `--app-*` Token einfuehren.
4. Mapping dokumentieren (Alt -> Neu bzw. Zweck -> Token).
5. In mindestens einem echten Screen validieren (Light/Dark, Hover/Focus/Disabled).

## Beispiel: Banner-Semantik

```scss
.banner--info {
  background: var(--mat-sys-secondary-container);
  color: var(--mat-sys-on-secondary-container);
  border: 1px solid var(--mat-sys-outline-variant);
}

.banner--error {
  background: var(--mat-sys-error-container);
  color: var(--mat-sys-on-error-container);
}
```

## Technische Ausnahmen

### meta theme-color (index.html)
Die HTML meta `theme-color` unterstuetzt keine CSS Custom Properties. Daher werden feste Hex-Werte verwendet:
- Light: `#f5f5f5` (naehe M3 surface)
- Dark: `#1c1b1f` (naehe M3 surface)

Diese Ausnahme ist technisch bedingt und dokumentiert in ADR 0005.

## Referenzen
- ADR: `docs/architecture/decisions/0005-use-angular-material-design.md`
- Styleguide: `docs/ui/STYLEGUIDE.md`
- PR-Checkliste: `docs/ui/PR-CHECKLIST-UI.md`
