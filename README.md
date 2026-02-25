# 🚀 arsnova.click V3 (Vibe Coding Edition)

[![CI](https://github.com/kqc-real/arsnova-click-v3/actions/workflows/ci.yml/badge.svg)](https://github.com/kqc-real/arsnova-click-v3/actions/workflows/ci.yml)
[![Tech Stack: Angular](https://img.shields.io/badge/Frontend-Angular%2017%2B-DD0031.svg?style=flat-square&logo=angular)](https://angular.dev/)
[![Tech Stack: tRPC](https://img.shields.io/badge/API-tRPC-2596be.svg?style=flat-square&logo=trpc)](https://trpc.io/)
[![Tech Stack: Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748.svg?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Documentation: ADRs](https://img.shields.io/badge/Docs-ADRs%20(DaC)-007A8A.svg?style=flat-square)](./docs/architecture/)

> **Ein modernes, 100 % DSGVO-konformes Audience-Response-System.**
> Entwickelt im Rahmen des Hochschul-Moduls "Software Engineering & Vibe Coding".

## 📖 Über das Projekt

**arsnova.click V3** ist die architektonische Neuerfindung einer etablierten Hörsaal-Quiz-App (ähnlich wie Kahoot! oder Mentimeter).

Der absolute USP (Unique Selling Proposition) dieses Systems ist die **"Zero-Knowledge"-Infrastruktur**: Dozenten müssen keine Accounts anlegen. Das geistige Eigentum (die Quizfragen) wird niemals **dauerhaft** auf einem zentralen Server gespeichert, sondern lebt **Local-First** im Browser des Erstellers. Beim Start einer Live-Session wird eine temporäre Kopie an den Server übertragen, die nur für die Dauer der Sitzung existiert. Der Server fungiert lediglich als "dummer", extrem schneller Relay-Knotenpunkt für die Live-Abstimmungen der Studierenden im Hörsaal.

## 🏗️ Der Technologie-Stack

Wir setzen auf einen stark typisierten, hochmodernen Full-Stack:

* **Frontend:** Angular (Standalone Components, Signals, Angular Material 3)
* **Backend:** Node.js API mit tRPC (End-to-End Typsicherheit & WebSockets)
* **Datenbank:** PostgreSQL via Prisma ORM
* **Echtzeit-Broker:** Redis (Pub/Sub)
* **Offline-Sync:** Yjs (CRDTs)

## 📂 Projektstruktur (Monorepo)

Dieses Projekt ist als Monorepo (npm Workspaces) strukturiert, damit Frontend und Backend sich nahtlos Typen und DTOs teilen können:

```text
arsnova-click-v3/
├── AGENT.md                 # 🤖 Leitplanken für euren KI-Assistenten
├── docs/
│   └── architecture/        # 🏛️ Architecture Decision Records (ADRs) & Handbuch
├── prisma/
│   └── schema.prisma        # 🗄️ Die Single Source of Truth (Datenbank)
├── apps/
│   ├── frontend/            # Das Angular-Projekt
│   └── backend/             # Das Node.js-Projekt
└── libs/
    └── shared-types/        # Geteilte Typen (tRPC Router, DTOs)
```

## 🚀 Getting Started (Für Entwickler)

Folge diesen Schritten, um das Projekt lokal auf deiner Maschine zum Laufen zu bringen.

### 1. Voraussetzungen

* Node.js (v20 oder neuer)
* Docker Desktop (für die lokale Datenbank)

### 2. Infrastruktur & Installation

Klone dieses Repository und wechsle in den Ordner:

```bash
git clone https://github.com/kqc-real/arsnova-click-v3.git
cd arsnova-click-v3
npm install
```

Kopiere die Environment-Datei und starte die Docker-Container (Postgres & Redis, **Epic 0**):

```bash
cp .env.example .env
docker compose up -d
# → Startet PostgreSQL (5432) und Redis (6379); optional: App-Container (3000, 3001, 3002)
```

Pushe das Datenbankschema und generiere den Prisma-Client:

```bash
npx prisma db push
npx prisma generate
```

### 3. Server starten

Starte Frontend und Backend parallel (oder einzeln: `npm run dev:backend` / `npm run dev:frontend`):

```bash
npm run dev
```

Die App ist nun unter `http://localhost:4200` (Frontend) erreichbar; auf der Startseite erscheint das **Server-Status-Widget** (Epic 0.4: aktive Sessions, Teilnehmer, completed Sessions, Status-Indikator). Die tRPC-API läuft auf `http://localhost:3000`; WebSocket-Subscriptions auf Port 3001, Yjs-Sync auf Port 3002.

**Reload / Deployment:** Damit Reload auf Unterseiten (z. B. `/legal/imprint`) nicht zu einer leeren Seite führt, muss der Server bei allen Client-Routen `index.html` ausliefern (SPA-Fallback). Beim lokalen `ng serve` ist das Standard. Für Production: Bei Vercel wird `apps/frontend/vercel.json` genutzt; bei Nginx/Apache/anderen Hosts eine Rewrite-Regel auf `index.html` setzen.

## 🤖 Vibe Coding & KI-Assistenz

Dieses Projekt wird im "Vibe Coding"-Modus entwickelt. Du agierst als Architekt, die KI (z.B. GitHub Copilot, Cursor, Gemini) übernimmt die Code-Generierung.

**WICHTIG:** Lade zu Beginn deiner Programmier-Session immer die Datei `AGENT.md` in den Kontext deiner KI, damit diese sich an die strengen Architektur- und Sicherheitsregeln (z.B. das Data-Stripping von Lösungen) hält. Für **umfassenden Projekt-Kontext** (Struktur, Stack, Backlog, DoD, ~4k Tokens) und optional **Context Caching** (Claude Opus 4.6): `@docs/cursor-context.md` in die erste Nachricht einbinden. Die Cursor-Regel unter `.cursor/rules/core.mdc` verweist darauf automatisch.

**Übergabe an Studis:** Siehe [CONTRIBUTING.md](./CONTRIBUTING.md) – Onboarding, Story-Wahl, DoD-Check vor PR, Branch/PR-Konventionen.

## 📚 Dokumentation

Wir leben **"Documentation as Code"**. Bevor du große Features implementierst, lies das [Architektur-Handbuch](./docs/architecture/handbook.md). Jede architektonische Entscheidung muss als ADR im Ordner `docs/architecture/decisions/` dokumentiert werden.

## 🗺️ Nächste Schritte (Onboarding)

Nachdem die App lokal läuft, empfiehlt sich diese Lesereihenfolge:

1. **[CONTRIBUTING.md](./CONTRIBUTING.md)** – Mitwirken, Story-Wahl, DoD vor PR (Einstieg für Studis)
2. **[AGENT.md](./AGENT.md)** – die KI-Leitplanken (immer zuerst in den Kontext laden!)
3. **[docs/cursor-context.md](./docs/cursor-context.md)** – stabile Projektreferenz für KI (~4k Tokens; für Context Caching: `@docs/cursor-context.md` laden)
4. **[Backlog.md](./Backlog.md)** – alle Storys mit Prioritäten und Definition of Done
5. **[Architektur-Handbuch](./docs/architecture/handbook.md)** – Konzepte, Stack und Regeln
6. **[Diagramme](./docs/diagrams/diagrams.md)** – Mermaid-Diagramme (Komponenten, Sequenz, ER, …)
7. **[ADRs](./docs/architecture/decisions/)** – bisherige Architekturentscheidungen (Signals, tRPC, Yjs)
8. **[Vibe-Coding-Szenario](./docs/vibe-coding/vibe-coding-szenario.md)** – so funktioniert die Zusammenarbeit mit der KI

> **Tipp:** **Epic 0 (Infrastruktur) ist abgeschlossen** (Redis, tRPC WebSocket, Yjs, Server-Status, Rate-Limiting, CI/CD). Starte mit einer 🔴 Must-Story aus Epic 1 oder 2, die noch ⬜ Offen ist (z.B. Story 1.1 Quiz erstellen). Lies erst den Story-Text im Backlog, dann prompte deine KI mit dem Kontext aus `AGENT.md`.

## 🔄 Zurücksetzen auf einen bekannten Zustand

Falls etwas schiefgeht oder du komplett neu anfangen möchtest, kannst du auf einen der folgenden Git-Tags zurücksetzen:

| Tag | Beschreibung |
|-----|--------------|
| **`v0-baseline`** | Sauberer Startzustand (Projekt-Skeleton: Health-Check, CI/CD, Prisma-Schema, Zod-Schemas, Dokumentation) |
| **`v0-epic0`** | Epic 0 abgeschlossen (Redis, tRPC WebSocket, Yjs, Server-Status, Rate-Limiting, CI/CD, alle 0.1–0.6 umgesetzt) |

```bash
# Alle lokalen Änderungen verwerfen und auf gewünschten Stand setzen
git reset --hard v0-epic0   # Stand nach Epic 0 (empfohlen)
# oder
git reset --hard v0-baseline   # Nur Skeleton (vor Epic 0)
npm install
```

> **Achtung:** `git reset --hard` löscht alle nicht-committeten Änderungen unwiderruflich. Committe oder stashe deine Arbeit vorher, falls du sie behalten willst.

---
*Viel Erfolg beim Bauen der Zukunft des digitalen Lernens!* 🚀
