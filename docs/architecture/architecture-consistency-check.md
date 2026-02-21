# Prüfung: Widersprüche in der technischen Architektur

**Datum:** 2026-02-20  
**Geprüft:** AGENT.md, handbook.md, README, ADRs, Prisma-Schema, Backend/Frontend-Code, Diagramme

---

## 1. Zero-Knowledge / Quiz-Speicherung vs. Prisma-Schema

**Dokumentation:**
- Handbook 3.1: *"Quizzes werden nicht in der zentralen PostgreSQL-Datenbank gespeichert."*
- ADR-0004: *"Der Server sieht zu keinem Zeitpunkt den Klartext der Quiz-Inhalte"* und *"Quiz-Inhalte (geistiges Eigentum der Dozenten) sollen niemals im Klartext auf einem zentralen Server gespeichert werden."*

**Code/Modell:**
- `prisma/schema.prisma` enthält die Modelle **Quiz**, **Question**, **AnswerOption** mit Klartext-Feldern (name, description, text, isCorrect, etc.).
- Backlog Story **2.1a** heißt explizit „Session-ID & **Quiz-Upload**“ – also Upload des Quiz beim Start einer Session.

**Widerspruch:**  
Die Dokumentation behauptet, der Server speichere Quiz-Inhalte nie und sehe sie nie im Klartext. Das Datenmodell und die geplante Story 2.1a sehen aber vor, dass beim Session-Start ein Quiz (inkl. Fragen und Antworten) an den Server übertragen und in PostgreSQL gehalten wird.

**Empfehlung:**  
Architektur-Dokumentation präzisieren (siehe oben).  
**Erledigt (2026-02-20):** ADR-0004 und Handbook 3.1 wurden entsprechend angepasst (Zero-Knowledge = keine dauerhafte Quiz-Bibliothek auf dem Server; Session-Kopie beim Quiz-Upload explizit erlaubt).

---

## 2. Handbuch: „Typen aus der API-Schicht des Backends“

**Handbook 3.2:**  
*"Das Frontend importiert die Typen direkt aus der API-Schicht des Backends."*

**ADR-0003:**  
*"Das Frontend importiert die Router-Typen direkt aus dem Backend über den `libs/shared-types`-Pfad."*

**Code:**
- Frontend importiert `AppRouter` aus `@arsnova/api`.
- In `tsconfig.json` ist `@arsnova/api` ein **Path-Alias** auf `apps/backend/src/routers/index.ts` (also die Backend-API-Schicht).
- Geteilte Zod-Schemas und Typen liegen in `libs/shared-types`.

**Bewertung:**  
Kein Widerspruch. Die Router-Typen (AppRouter) kommen aus dem Backend (über den Alias), DTOs/Schemas aus shared-types. Formulierung im Handbook ist in Ordnung; ADR-0003 könnte präzisiert werden: Router-Typ aus Backend (via Path-Alias), Schemas/Typen aus `libs/shared-types`.

---

## 3. Backend-Komponentendiagramm vs. Implementierung

**Diagramm** (`docs/diagrams/diagrams.md` – Backend-Architektur):  
Zeigt Router: health, **quiz**, **session**, **vote**, **qa** sowie viele Services (ScoringService, StreakService, SessionCodeService, …) und DTOs.

**Code:**  
In `apps/backend/src/routers/index.ts` ist aktuell nur **healthRouter** eingebunden. Es gibt keine quiz-, session-, vote- oder qa-Router und keine entsprechenden Services im Repo.

**Bewertung:**  
Kein architektonischer Widerspruch, aber **Dokumentation und Code sind nicht synchron.** Das Diagramm beschreibt die **Ziel-Architektur** (Backlog/Stories), nicht den aktuellen Stand.

**Empfehlung:**  
Im Diagramm oder in einer Überschrift deutlich machen: „Ziel-Architektur (geplant)“ bzw. „Stand: Backlog“. Oder das Diagramm schrittweise an den implementierten Stand anpassen.

---

## 4. Angular-Version

**AGENT.md / handbook:**  
*"Angular (Version 17+)"* bzw. *"Angular (v17+)"*.

**Code:**  
`apps/frontend/package.json`: `"@angular/core": "^19.0.0"`.

**Bewertung:**  
Kein Widerspruch. 19 erfüllt „17+“. Optional: Dokumentation auf „Angular 17+ (aktuell 19)“ oder „v19“ anheben, um Verwirrung zu vermeiden.

---

## 5. Docker-Befehl im README

**README:**  
*"docker-compose up -d"*

**Projekt:**  
Es gibt `docker-compose.yml`. Docker Compose v2 nutzt `docker compose` (mit Leerzeichen), v1 `docker-compose`.

**Bewertung:**  
Kleinere Uneinheitlichkeit. Beide Varianten sind verbreitet. Optional: Im README ergänzen „(oder `docker compose up -d` unter Docker Compose v2)“.

---

## 6. Tippfehler in AGENT.md

**AGENT.md Abschnitt 3:**  
*"darf **währen** einer Live-Session"*

**Korrektur:**  
*"während"*

---

## Zusammenfassung

| Nr. | Thema | Art | Handlungsbedarf |
|-----|--------|-----|------------------|
| 1 | Quiz-Speicherung vs. Zero-Knowledge | Inhaltlicher Widerspruch | ADR-0004 und Handbook 3.1 präzisieren (Session-Kopie vs. dauerhafte Bibliothek). |
| 2 | Typen-Import (Handbook vs. ADR) | Kein Widerspruch | Optional: ADR-0003 präzisieren. |
| 3 | Backend-Diagramm vs. Code | Dokumentation voraus | Diagramm als „Ziel-Architektur“ kennzeichnen oder an Code anpassen. |
| 4 | Angular-Version | Kein Widerspruch | Optional: „v19“ in Docs erwähnen. |
| 5 | docker-compose | Kleine Abweichung | Optional: `docker compose` im README erwähnen. |
| 6 | „währen“ | Tippfehler | In AGENT.md zu „während“ korrigieren. |

Der einzige **inhaltliche** Widerspruch betrifft die Beschreibung von Zero-Knowledge/Quiz-Speicherung (Punkt 1). Die übrigen Punkte sind Klarstellungen oder optionale Anpassungen.
