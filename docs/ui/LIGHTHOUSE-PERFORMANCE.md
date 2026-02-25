# Lighthouse Performance

## Erwartete Werte

Mit **Angular + Angular Material** sind **50–70 % Performance** bei Lighthouse (Mobile, Throttling) nicht ungewöhnlich – das Framework-Bundle ist vergleichsweise groß. Wichtig: **Accessibility, Best Practices, SEO** bei 100 % zu halten. Um Performance zu verbessern, in Lighthouse die Karte **„Opportunities“** und **„Diagnostics“** prüfen (konkrete Hinweise wie „Reduce unused JavaScript“, „Largest Contentful Paint element“).

## Wichtig: Production-Build messen

**Lighthouse immer gegen einen Production-Build laufen lassen.** Im Development-Modus (`ng serve`) ist das Bundle unminifiziert und nicht optimiert – das führt zu schlechten Performance-Werten (~50 %).

```bash
cd apps/frontend
npm run build -- --configuration=production
npx serve dist/browser -s
# Dann in Chrome: http://localhost:3000 → DevTools → Lighthouse → Performance (Mobile)
```

Hinweis: Der Build-Output liegt unter **`dist/browser/`** (Angular Application Builder). Beim Servieren immer **`dist/browser`** als Dokument-Wurzel nutzen, damit `/` die App lädt und nicht ein Verzeichnislisting.

Alternativ: `npx http-server dist/browser -p 8080 -c-1`

### robots.txt: „not valid“, viele Fehler (z. B. 40)?

Wenn der Server **nicht** aus **`dist/browser`** bedient wird, liefert die SPA bei Anfragen wie `/robots.txt` die **index.html** aus (Fallback). Lighthouse parst dann HTML als robots.txt → sehr viele Syntaxfehler. **Lösung:** Server mit Wurzel **`dist/browser`** starten (`npx serve dist/browser -s`), dann liefert `/robots.txt` die echte Datei. Die `robots.txt` im Projekt ist minimal und RFC-konform (`User-agent: *` + leeres `Disallow:`).

### App wird nicht angezeigt / weiße Seite?

- **Nur Verzeichnislisting?** Du siehst „Index of …“ mit Ordnern wie `browser/` → Server läuft mit Wurzel **`dist/`**. Stoppe den Server und starte mit **`dist/browser`** als Wurzel (siehe Befehle oben). Dann im Browser **nur** die Root-URL öffnen (z. B. `http://localhost:3000/`).
- **URL endet auf `/browser/`?** Wenn der Server mit Wurzel `dist/` läuft und du `…/browser/` aufrufst, lädt die App ihre Skripte von `/chunk-xxx.js` statt von `/browser/chunk-xxx.js` → 404, weiße Seite. **Lösung:** Server mit Wurzel `dist/browser` starten und **`http://localhost:PORT/`** (ohne `/browser/`) öffnen.

## Umgesetzte Optimierungen

| Maßnahme | Zweck |
|----------|--------|
| **Fonts async + optional** | Google Fonts mit `display=optional` und `media="print"` + `onload="this.media='all'"` – blockieren nicht, weniger Layout-Shift (CLS). |
| **Material Icons nach Load** | Icon-Stylesheet wird per Script erst nach `window.load` eingebunden, damit der kritische Pfad frei bleibt. Icons erscheinen kurz nach dem ersten Paint. |
| **Preconnect** | `preconnect` zu `fonts.googleapis.com` und `fonts.gstatic.com` für frühen Verbindungsaufbau. |
| **Lazy Loading** | Alle Routen (Home, Quiz, Session, Legal) laden ihre Komponenten per `loadComponent()` (Code-Splitting). |
| **Bundle-Budgets** | `angular.json`: initial max. 500 kB (Warning), 1 MB (Error). |
| **Service Worker** | PWA/ngsw für Production – Caching bei wiederholten Besuchen. |

## Weitere Tipps bei Bedarf

- **Bundle analysieren:** `cd apps/frontend && npm run build -- --configuration=production --stats-json`, dann mit [source-map-explorer](https://www.npmjs.com/package/source-map-explorer) oder [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) die größten Pakete prüfen (z. B. Angular Material, tRPC).
- **Font-Subset:** Nur benötigte Schriftschnitte laden – bereits umgesetzt (Roboto 400/500, Nunito 400/700).
- **Material Icons:** Falls Performance weiter Priorität hat, auf SVG-Icons oder ein selbst gehostetes Icon-Subset wechseln, um die Icon-Font-Größe zu reduzieren.
- **LCP:** Hero und erste Card bleiben schlank; `display=optional` vermeidet längeren unsichtbaren Text (FOIT) und reduziert CLS.
