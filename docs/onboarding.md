# 🎓 Onboarding: arsnova.click V3

Willkommen im Entwickler-Team von **arsnova.click V3**! Dieses Dokument hilft dir als Informatikstudierende/r, das Projekt zu verstehen, die Entwicklungsumgebung aufzusetzen und produktiv mitzuarbeiten.

---

## 1. Quickstart: Entwicklungsumgebung einrichten

### Voraussetzungen

| Tool | Version | Prüfbefehl |
|------|---------|------------|
| Node.js | ≥ 20 (siehe `.nvmrc`) | `node -v` |
| npm | ≥ 10 | `npm -v` |
| Docker & Docker Compose | aktuell | `docker compose version` |
| Git | aktuell | `git -v` |

### Setup in 5 Schritten

```bash
# 1. Repository klonen
git clone https://github.com/kqc-real/arsnova-click-v3.git
cd arsnova-click-v3

# 2. Umgebungsvariablen anlegen
cp .env.example .env

# 3. Datenbank & Redis starten (Docker)
docker compose up -d
# → Startet PostgreSQL (Port 5432) und Redis (Port 6379)

# 4. Dependencies installieren (npm Workspaces)
npm install
# → Installiert alle Abhängigkeiten für Backend, Frontend und shared-types

# 5. Prisma-Client generieren & Datenbank-Schema synchronisieren
npx prisma generate
npx prisma db push
```

### Entwicklungsserver starten

```bash
# Alles auf einmal (Backend + Frontend parallel):
npm run dev

# Oder einzeln:
npm run dev:backend    # → http://localhost:3000 (tRPC-API)
npm run dev:frontend   # → http://localhost:4200 (Angular)
```

**Funktioniert alles?** Öffne `http://localhost:4200` im Browser. Du solltest „✅ Frontend läuft!" und „✅ Backend verbunden (ok)" sehen.

---

## 2. Projektstruktur (Monorepo)

Das Projekt nutzt **npm Workspaces**, um Backend, Frontend und geteilte Typen in einem Repository zu verwalten. Änderungen an `@arsnova/shared-types` wirken sich sofort auf Backend und Frontend aus.

```
arsnova-click-v3/
├── apps/
│   ├── backend/              # Node.js + tRPC API-Server
│   │   └── src/
│   │       ├── index.ts      # Express-Server, Startpunkt
│   │       ├── trpc.ts       # tRPC-Initialisierung (Router, Procedures)
│   │       └── routers/      # tRPC-Router (API-Endpunkte)
│   │           ├── index.ts  # appRouter – vereint alle Sub-Router
│   │           └── health.ts # Health-Check-Endpoint
│   └── frontend/             # Angular 19 Single-Page-App
│       └── src/app/
│           ├── app.component.ts   # Root-Komponente
│           ├── app.routes.ts      # Routing-Konfiguration
│           ├── app.config.ts      # Angular-App-Konfiguration
│           └── trpc.client.ts     # tRPC-Client (Verbindung zum Backend)
├── libs/
│   └── shared-types/         # Geteilte Zod-Schemas und TypeScript-Typen
│       └── src/
│           ├── index.ts      # Re-Exports
│           └── schemas.ts    # ALLE Zod-Schemas, DTOs und Enums
├── prisma/
│   └── schema.prisma         # Datenbankmodell (Single Source of Truth)
├── docs/                     # Dokumentation
│   ├── architecture/         # Architektur-Handbuch + ADRs
│   └── diagrams/             # Mermaid-Architekturdiagramme
├── docker-compose.yml        # PostgreSQL + Redis
├── AGENT.md                  # ⚠️ KI-Coding-Regeln (Pflichtlektüre!)
├── Backlog.md                # Alle User-Storys mit Akzeptanzkriterien
└── package.json              # Root: npm Workspaces + globale Scripts
```

### Wichtige Zusammenhänge

| Paket | npm-Name | Aufgabe |
|-------|----------|---------|
| `apps/backend` | `@arsnova/backend` | API-Server – empfängt Requests, validiert mit Zod, greift auf DB zu |
| `apps/frontend` | `@arsnova/frontend` | Browser-App – Angular-Standalone-Components mit Tailwind CSS |
| `libs/shared-types` | `@arsnova/shared-types` | Geteilte Verträge – Zod-Schemas, die **beide** Seiten importieren |

> **Typsicherheit:** Wenn du ein Feld im Prisma-Schema änderst, muss das passende Zod-Schema in `libs/shared-types/src/schemas.ts` aktualisiert werden. Andernfalls schlägt der Build fehl.

---

## 3. Architektur-Philosophie

Das System ist nach dem **Local-First**-Prinzip entworfen:

* **Zero-Knowledge:** Der Server speichert Quiz-Inhalte *niemals dauerhaft*. Die „Single Source of Truth" für Quizzes ist die lokale Browser-Datenbank des Dozenten.
* **Datensouveränität:** Das geistige Eigentum (die Fragen) verbleibt beim Dozenten – keine Cloud, kein Account-Zwang.
* **Relay-Modell:** Das Backend fungiert als *flüchtiger Vermittler* für Live-Daten während einer Hörsaal-Sitzung.

---

## 4. Aktueller Stand vs. Ziel-Architektur

> ⚠️ **Wichtig:** Das Projekt befindet sich im frühen Aufbau. Viele der hier beschriebenen Komponenten existieren erst als Planung (siehe `Backlog.md`). Dieser Abschnitt kennzeichnet klar, was **bereits implementiert** ist und was noch **umgesetzt werden muss**.

### Was bereits funktioniert (✅ Implementiert)

| Komponente | Beschreibung |
|---|---|
| Express + tRPC-Server | Backend läuft auf Port 3000 mit einem `health.check`-Endpoint |
| Angular 19 Frontend | Standalone Root-Component mit Tailwind CSS, zeigt Backend-Verbindungsstatus |
| tRPC-Client (`httpBatchLink`) | Frontend ruft typsicher Backend-Endpoints auf |
| Prisma-Schema | Vollständiges Datenbankmodell (Quiz, Question, Session, Vote, etc.) |
| Zod-Schemas (`shared-types`) | Alle Input-/Output-Schemas und DTOs sind definiert |
| Docker Compose | PostgreSQL 16 + Redis 7 starten per `docker compose up` |
| CI/CD-Pipeline | GitHub Actions prüft TypeScript, ESLint, Prisma und Docker-Build |

### Was noch umgesetzt werden muss (🔲 Geplant)

| Komponente | Beschreibung | Backlog-Story |
|---|---|---|
| Redis-Anbindung im Backend | `ioredis`-Client für Pub/Sub und Rate-Limiting | Story 0.1 |
| tRPC WebSocket-Adapter | `wsLink` für Echtzeit-Subscriptions (Events an Clients pushen) | Story 0.2 |
| Yjs / IndexedDB | Local-First-Speicherung der Quizzes im Browser | Story 1.5 |
| y-websocket Relay | Multi-Device-Sync für Dozenten (PC ↔ iPad) | Story 0.3 |
| Quiz-Verwaltung | Erstellen, Bearbeiten, Löschen von Quizzes | Stories 1.1–1.10 |
| Live-Session-Flow | Session starten, Lobby, Fragen freigeben, Abstimmung, Ergebnis | Epics 2–4 |
| Service Layer | ScoringService, StreakService, BonusTokenService, etc. | Epics 4–5 |
| DTO-Stripping (Runtime) | `isCorrect` serverseitig entfernen bei Status `ACTIVE` | Story 2.4 |

---

## 5. Komponentenbeschreibung (Ziel-Architektur)

Das folgende Diagramm zeigt die **geplante Backend-Architektur**. Aktuell existiert nur der `healthRouter` – alle anderen Komponenten werden schrittweise umgesetzt.

```mermaid
graph TB
    subgraph Entry["Entry Point"]
        express[Express Server - Port 3000]
        cors[CORS Middleware]
        trpcmw["tRPC Middleware"]
    end

    subgraph Router["appRouter - tRPC"]
        health["healthRouter ✅"]
        quiz["quizRouter 🔲"]
        session["sessionRouter 🔲"]
        vote["voteRouter 🔲"]
    end

    subgraph Services["Services 🔲"]
        scoring[ScoringService]
        streak[StreakService]
        codegen[SessionCodeService]
        cleanup[CleanupService]
        ratelimit[RateLimitService]
    end

    subgraph DTO["DTO Layer 🔲"]
        studdto["QuestionStudentDTO (kein isCorrect)"]
        revdto["QuestionRevealedDTO (mit isCorrect)"]
    end

    pg[(PostgreSQL)]
    redis[("Redis 🔲")]

    express --> cors --> trpcmw
    trpcmw --> health
    trpcmw --> quiz
    trpcmw --> session
    trpcmw --> vote
    session --> scoring
    session --> codegen
    vote --> scoring
    vote --> streak
    vote --> ratelimit
    session --> studdto
    session --> revdto
    scoring --> pg
    ratelimit --> redis
    session --> redis
```

> ✅ = implementiert · 🔲 = geplant

### A. Frontend (Angular 19)

Das Frontend nutzt modernste Angular-Features:

* **Standalone Components:** Wir verzichten komplett auf `NgModules` – jede Komponente ist eigenständig importierbar.
* **Angular Signals:** Steuern reaktiv den UI-Zustand. Wenn sich Daten ändern, aktualisiert Angular nur den betroffenen DOM-Teil (kein manuelles `subscribe`/`unsubscribe`).
* **tRPC-Client:** Stellt eine typsichere Verbindung zum Backend her. Aktuell ist nur `httpBatchLink` aktiv (für Queries/Mutations). Geplant: `wsLink` für Echtzeit-Subscriptions (Story 0.2).
* **Yjs & IndexedDB (geplant):** Quiz-Daten werden im Browser gespeichert. Yjs sorgt als CRDT-Bibliothek dafür, dass Änderungen zwischen Geräten konfliktfrei synchronisiert werden (Story 1.5).

### B. Backend (Node.js + tRPC)

* **tRPC Router:** Definiert die API-Endpunkte. Frontend und Backend teilen sich die Typdefinitionen direkt über `@arsnova/shared-types` – kein manuelles Pflegen von REST-Contracts nötig.
* **Service Layer (geplant):** Geschäftslogik wie Punkteberechnung (ScoringService), Streak-Tracking (StreakService) und Bonus-Token-Generierung (BonusTokenService).
* **DTO Layer (geplant):** Kritische Sicherheitskomponente – filtert sensible Daten (z. B. `isCorrect`) heraus, bevor sie an Studenten-Clients gesendet werden.
* **Prisma ORM:** Typsicherer Abstraktionslayer für PostgreSQL. Das Schema ist bereits vollständig definiert in `prisma/schema.prisma`.

### C. Infrastruktur

* **PostgreSQL:** Speichert flüchtige Daten einer Live-Session (Teilnehmer, Session-Status, Votes). Läuft via Docker.
* **Redis (geplant – Story 0.1):** Message-Broker für Pub/Sub-Echtzeitereignisse und Datenspeicher für Rate-Limiting. Der Container läuft bereits, die Backend-Anbindung fehlt noch.
* **y-websocket Relay (geplant – Story 0.3):** Spiegelt Yjs-Synchronisationsdaten zwischen den Geräten des Dozenten.

---

## 6. Das Zusammenspiel in einer Live-Session (Ziel)

> Dieser Ablauf beschreibt die **fertige Ziel-Architektur**. Nutze ihn als Referenz, um zu verstehen, worauf die Entwicklung hinarbeitet.

1. **Quiz-Upload:** Der Dozent wählt ein Quiz aus seiner lokalen IndexedDB. Das Frontend sendet eine Kopie via `quiz.upload` (Zod-validiert) an das Backend.
2. **Session-Initialisierung:** Das Backend speichert die Quiz-Kopie in PostgreSQL, generiert einen 6-stelligen Code und registriert ihn in Redis.
3. **Lobby-Phase:** Studenten treten mit dem Code bei. Das Backend erstellt einen `Participant`-Eintrag und informiert den Dozenten in Echtzeit via Redis Pub/Sub → tRPC Subscription.
4. **Frage-Aktivierung (Security):**
    * Der Dozent klickt „Nächste Frage".
    * Das Backend setzt den Status auf `ACTIVE`.
    * Das **DTO-Stripping** entfernt `isCorrect` aus den Antwortoptionen.
    * Die gefilterten Daten (`QuestionStudentDTO`) werden via tRPC Subscription an alle Studenten-Smartphones gepusht.
5. **Abstimmung:** Studenten senden ihre Votes. Der ScoringService berechnet Punkte basierend auf Korrektheit, Antwortzeit und Schwierigkeitsgrad.
6. **Auflösung:** Der Dozent beendet die Frage (Status → `RESULTS`). *Erst jetzt* sendet das Backend das vollständige Objekt (`QuestionRevealedDTO` inkl. `isCorrect`) an die Studenten.

---

## 7. Wichtige Regeln für Entwickler

> Diese Regeln sind ausführlich in [`AGENT.md`](../AGENT.md) beschrieben. Hier die Kurzfassung:

| Regel | Beschreibung |
|---|---|
| **Kein `any`** | TypeScript-Typen immer aus `@arsnova/shared-types` importieren |
| **Signals statt RxJS** | Für UI-State ausschließlich Angular Signals verwenden. RxJS nur für WebSocket-Streams |
| **Security First** | Neues Feld an einer Frage? → Prüfen, ob es im `QuestionStudentDTO` entfernt werden muss |
| **Standalone Components** | Keine `NgModules`. Neue `@if`/`@for` Control-Flow-Syntax, kein `*ngIf`/`*ngFor` |
| **Tailwind CSS** | Styling inline via Tailwind-Klassen, keine separaten SCSS-Dateien |
| **ADRs schreiben** | Architekturentscheidungen als ADR in `docs/architecture/decisions/` dokumentieren |

---

## 8. Pflichtlektüre

| Dokument | Inhalt |
|---|---|
| [`AGENT.md`](../AGENT.md) | KI-Coding-Regeln und Architektur-Leitplanken |
| [`Backlog.md`](../Backlog.md) | Alle User-Storys mit Priorität und Akzeptanzkriterien |
| [`docs/architecture/handbook.md`](architecture/handbook.md) | Ausführliches Architektur-Handbuch |
| [`docs/architecture/decisions/`](architecture/decisions/) | Architecture Decision Records (ADRs) |
| [`docs/diagrams/diagrams.md`](diagrams/diagrams.md) | Mermaid-Diagramme (Backend, Frontend, DB, Sequenz) |
| [`prisma/schema.prisma`](../prisma/schema.prisma) | Datenbankmodell – Single Source of Truth |
| [`libs/shared-types/src/schemas.ts`](../libs/shared-types/src/schemas.ts) | Alle Zod-Schemas und DTOs |

---

## 9. Glossar

| Begriff | Erklärung |
|---|---|
| **Monorepo** | Ein einzelnes Git-Repository, das mehrere Pakete enthält (hier: Backend, Frontend, shared-types). Verwaltet über npm Workspaces. |
| **tRPC** | TypeScript Remote Procedure Call – Framework für typsichere API-Kommunikation ohne REST-Boilerplate. Frontend und Backend teilen sich die Typen direkt. |
| **Zod** | TypeScript-Validierungsbibliothek. Definiert Schemas, die sowohl zur Laufzeit (Eingabevalidierung) als auch zur Compile-Zeit (Typen) genutzt werden. |
| **Prisma** | ORM (Object-Relational Mapping) für Node.js. Übersetzt TypeScript-Objekte in SQL-Queries. Das Schema in `schema.prisma` definiert die Datenbankstruktur. |
| **DTO** | Data Transfer Object – ein gefiltertes Datenobjekt, das nur die Felder enthält, die der Empfänger sehen darf. Zentral für die Sicherheit (kein `isCorrect` für Studenten). |
| **CRDT** | Conflict-free Replicated Data Type – Datenstruktur, die parallele Änderungen auf mehreren Geräten automatisch und ohne Konflikte zusammenführt. Verwendet über die Bibliothek Yjs. |
| **Yjs** | JavaScript-Bibliothek für CRDTs. Speichert Daten in IndexedDB (Browser-Datenbank) und synchronisiert Änderungen als kleine „Deltas" über WebSockets. |
| **Pub/Sub** | Publish/Subscribe – Messaging-Muster, bei dem ein Sender (Publisher) Nachrichten veröffentlicht und alle registrierten Empfänger (Subscribers) diese erhalten. Umgesetzt über Redis. |
| **ADR** | Architecture Decision Record – kurzes Dokument, das eine technische Entscheidung, ihre Begründung und Alternativen festhält. Liegt unter `docs/architecture/decisions/`. |
| **Subscription** | tRPC-Mechanismus für Echtzeit-Kommunikation über WebSockets. Der Client registriert sich für Events, die der Server aktiv pusht (z. B. „neuer Teilnehmer beigetreten"). |
| **IndexedDB** | Browsereigene NoSQL-Datenbank für große Datenmengen. Wird hier von Yjs genutzt, um Quizzes lokal zu persistieren – auch nach Browser-Neustart. |
| **Data-Stripping** | Sicherheitsmechanismus: Das Backend entfernt sensible Felder (z. B. `isCorrect`) aus Objekten, *bevor* sie an Studenten gesendet werden – verhindert Schummeln via DevTools. |

---

Viel Erfolg bei der Entwicklung von arsnova.click V3! 🚀 Bei Fragen: Schau zuerst in die [Pflichtlektüre](#8-pflichtlektüre), dann frag im Team.
