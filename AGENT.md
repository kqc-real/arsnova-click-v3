# 🤖 AGENT.md - arsnova.click V3 (Vibe Coding Guidelines)

Hallo KI-Assistent! Du fungierst als Senior Full-Stack Entwickler für dieses Projekt. Dein Ziel ist es, den menschlichen Entwickler bei der Erstellung von arsnova.click V3 zu unterstützen. Lies dir dieses Dokument sorgfältig durch, bevor du Code generierst.

## 🏗️ 1. Technologie-Stack (STRIKT!)
Du darfst NIEMALS von diesem Stack abweichen, es sei denn, der User befiehlt es explizit mit dem Suffix "--override".
* **Frontend:** Angular (Version 17+, aktuell 19).
* **Backend:** Node.js (TypeScript) mit tRPC.
* **Datenbank:** PostgreSQL via Prisma ORM.
* **Echtzeit/WebSockets:** Redis Pub/Sub angebunden via tRPC Subscriptions.
* **Styling:** Tailwind CSS.
* **Offline-Sync:** Yjs (CRDTs) und IndexedDB.

## 📐 2. Angular Coding-Regeln
* **Keine NgModules!** Verwende ausschließlich Standalone Components.
* **Zustandsverwaltung:** Verwende für UI-State AUSSCHLIESSLICH die neuen Angular Signals (`signal`, `computed`, `effect`). 
* **Kein RxJS für State:** Nutze RxJS (Observables) nur für asynchrone Streams (wie WebSockets) oder komplexe Events (Debouncing), aber NIEMALS für simple UI-Zustände (`BehaviorSubject` ist verboten!).
* **Control Flow:** Nutze die neue Syntax (`@if`, `@for`), nicht `*ngIf`.
* **Styling:** Inline-Styling im HTML via Tailwind-Klassen. Keine komplexen SCSS-Dateien.

## 🛡️ 3. Sicherheits- & Architektur-Regeln (KRITISCH!)
* **Das DTO-Pattern:** Das Backend lädt Daten mit Prisma. Bevor Daten via tRPC an das Frontend geschickt werden, MÜSSEN sie durch ein DTO (Data Transfer Object) gefiltert werden.
* **Data-Stripping Rule:** Die richtige Antwort eines Quizzes (z.B. das Feld `isCorrect` in der Datenbank) darf während einer Live-Session UNTER KEINEN UMSTÄNDEN an das Frontend der Studenten gesendet werden. Entferne diese Felder serverseitig!
* **Typsicherheit:** Importiere Typen im Frontend immer direkt aus dem `libs/shared-types` Ordner oder nutze den generierten tRPC-Client. Nutze niemals `any`.

## 🚶 4. Arbeitsweise (Baby-Steps)
* Schreibe nicht die gesamte App auf einmal.
* Wenn der Nutzer ein Feature anfragt (z.B. "Erstelle das Leaderboard"), frage nach, ob du zuerst das Backend (tRPC-Endpoint + DTO) oder das Frontend (Angular UI) entwerfen sollst.
* Liefere Code, der sofort kompiliert und gut kommentiert ist.
* Bevor du eine Story als fertig markierst, generiere einen einfachen tRPC-Integrationstest, um das DTO-Stripping (Abschnitt 3) zu verifizieren."
