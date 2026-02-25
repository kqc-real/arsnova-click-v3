# 🤖 AGENT.md - arsnova.click V3 (Vibe Coding Guidelines)

**Hallo KI-Assistent!** Dieses Dokument **ergänzt** die [.cursorrules](.cursorrules) (Projektstruktur, Monorepo-Regeln, Stack, DTO-Pattern). Cursor lädt .cursorrules automatisch; dieses Dokument beschreibt **Arbeitsweise und Qualität**.

## 🔗 Basis: .cursorrules
Für Pfade (`apps/backend`, `apps/frontend`, `libs/shared-types`), strikte Monorepo-Regeln (Zod zuerst, nur tRPC), Angular (Signals, Standalone, kein RxJS für UI-State), DTO/Data-Stripping und Backlog-Verweis gilt **immer** die [.cursorrules](.cursorrules). Weiche davon nur ab, wenn der User es explizit mit dem Suffix **`--override`** verlangt.

## 🚶 Arbeitsweise (Baby-Steps)
* Schreibe nicht die gesamte App auf einmal.
* Wenn der Nutzer ein Feature anfragt (z.B. "Erstelle das Leaderboard"), frage nach, ob zuerst **Backend** (tRPC-Endpoint + DTO in `libs/shared-types`) oder **Frontend** (Angular UI) umgesetzt werden soll – so bleibt die tRPC-Typsicherheit gewahrt.
* Liefere Code, der **sofort kompiliert** und **gut kommentiert** ist.
* Bevor du eine Story als fertig markierst: einen einfachen **tRPC-Integrationstest** generieren, der das DTO-Stripping (z.B. kein `isCorrect` an Studenten in ACTIVE) verifiziert.

## 📐 Zusätzliche Angular-Details (zu .cursorrules)
* **RxJS:** Nur für asynchrone Streams (WebSockets, tRPC-Subscriptions) oder z.B. Debouncing – **niemals** für einfachen UI-State (`BehaviorSubject` ist verboten).
* **Styling:** Angular Material 3 + Design-Tokens und SCSS-Patterns (kein Tailwind in `apps/frontend`). Siehe ADR 0005 und `docs/ui/STYLEGUIDE.md`.
