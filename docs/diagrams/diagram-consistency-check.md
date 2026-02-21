# Konsistenzprüfung: Diagramme · Handbuch · Backlog

**Datum:** 2026-02-20  
**Geprüft:** diagrams.md, architecture-overview.md, handbook.md, Backlog.md, prisma/schema.prisma

---

## 1. Konsistenz innerhalb der Diagramme

### 1.1 Backend-Komponenten (diagrams.md)
- **Router:** health, quiz, session, vote, qa – untereinander konsistent; Verbindungen zu Services, DTO, Validation und PG/Redis/WebSocket/y-websocket stimmig.
- **DTO:** QuestionStudentDTO (kein isCorrect), QuestionRevealedDTO (mit isCorrect), SessionInfoDTO, LeaderboardEntryDTO, PersonalScorecardDTO – mit Handbuch §3.3 und Backlog Story 2.4 abgestimmt.
- **Hinweis:** Als „Ziel-Architektur“ gekennzeichnet; aktuell ist nur healthRouter implementiert.

### 1.2 Frontend-Komponenten (diagrams.md)
- **Routen:** Home (/), Quiz (/quiz), Session (/session/:code), Beamer (/session/:code/present), Student (/session/:code/vote) – konsistent.
- **Lücken (behoben):** Legal-Route (/legal) mit Imprint/Privacy (Story 6.3), QaModeratorComponent, QaStudentComponent, RatingScaleComponent, FreetextInputComponent, MotivationMessageComponent waren zunächst nicht abgebildet und wurden ergänzt.

### 1.3 Datenbank-Schema (diagrams.md vs. architecture-overview.md)
- **Entitäten:** Quiz, Question, AnswerOption, Session, Participant, Team, Vote, VoteAnswer, BonusToken, QaQuestion, QaUpvote (kein User-Modell – App ist accountfrei) – mit Prisma-Schema abgeglichen; Relationen und Kardinalitäten stimmen.
- **Hinweis:** In Mermaid erDiagram werden Umlaute in Relation-Labels vermieden (z. B. „enthaelt“), in architecture-overview „enthält“ – inhaltlich identisch.

### 1.4 Sequenz- und Aktivitätsdiagramme
- **Dozent:** quiz.upload → session.create → Subscriptions → nextQuestion → revealResults → session.end → getBonusTokens – Reihenfolge und DTOs (QuestionStudentDTO / QuestionRevealedDTO) konsistent mit Backlog 2.1a, 2.3, 2.4, 4.6.
- **Student:** session.getInfo → session.join → onQuestionRevealed → vote.submit → onResultsRevealed → onPersonalResult → onStatusChanged FINISHED, ggf. bonusToken – konsistent mit Backlog 3.1, 3.3a/b, 4.6, 5.6.
- **Aktivitätsablauf:** Dozent/Student/Server-Phasen (Quiz erstellen, Live schalten, Lobby, Frage/Abstimmung/Ergebnis, Beenden, Bonus-Token) entsprechen dem Backlog-Lifecycle.

---

## 2. Konsistenz zwischen den Diagrammen

| Thema | diagrams.md | architecture-overview.md | Bewertung |
|-------|-------------|---------------------------|-----------|
| tRPC-Router | health, quiz, session, vote, qa | ROUTERS: health · quiz · session · vote · qa | ✓ gleich |
| DTOs | QuestionStudentDTO, QuestionRevealedDTO, … | DTO Layer: QuestionStudentDTO, QuestionRevealedDTO | ✓ gleich |
| Data-Stripping | ACTIVE ohne isCorrect, RESULTS mit isCorrect | Sicherheits-Diagramm + Datenfluss-Text | ✓ gleich |
| Session-Ablauf | quiz.upload → session.create | Datenfluss zeigt nur session.create() | ⚠ Übersicht vereinfacht (siehe unten) |
| Frontend-Routen | /, /quiz, /session/:code, /present, /vote, /legal | Komponenten-Hierarchie: Home, Quiz, Session, Student | ✓ nach Ergänzung Legal konsistent |
| DB-Modelle | Quiz, Question, Session, … (ohne User) | erDiagram gleiche Entitäten | ✓ gleich |

**Vereinfachung in architecture-overview:** Im Datenfluss-Diagramm wird nur „Session erstellen“ und `session.create()` gezeigt. Der Schritt **Quiz-Upload** (Backlog 2.1a) ist dort nicht dargestellt; er ist in diagrams.md (Kommunikation Dozent) korrekt als `quiz.upload` vor `session.create` enthalten. Empfehlung: In architecture-overview entweder einen Hinweis ergänzen („Vor Session-Start wird das Quiz hochgeladen, vgl. diagrams.md“) oder einen Schritt „Quiz hochladen“ andeuten.

---

## 3. Abdeckung Handbuch (TA-Handbuch)

| Handbuch-Kapitel | In Diagrammen abgebildet |
|------------------|---------------------------|
| **§2 Technologie-Stack** | Angular, tRPC, PostgreSQL/Prisma, Redis, Yjs – in architecture-overview (System + Technologie-Stack) und diagrams.md (Backend/Frontend) ✓ |
| **§3.1 Local-First & Zero-Knowledge** | Quiz-Bibliothek lokal (Yjs/IndexedDB); Session-Kopie beim Live-Schalten (quiz.upload) – in Dozent-Sequenz und Aktivität ✓ |
| **§3.2 End-to-End Typsicherheit (tRPC)** | tRPC Router, httpBatchLink/wsLink, Typen aus Backend – in Frontend-Services und Kommunikationsdiagrammen ✓ |
| **§3.3 Security & Data-Stripping** | QuestionStudentDTO ohne isCorrect, QuestionRevealedDTO mit isCorrect; Sicherheits-Diagramm in architecture-overview ✓ |
| **§5 Datenmodell** | Prisma als Single Source of Truth – erDiagram in beiden Dateien, abgestimmt mit schema.prisma ✓ |

---

## 4. Abdeckung Backlog (Stories/Epics)

- **Epic 0:** Redis, tRPC WebSocket, Yjs – in Backend/System-Architektur und Kommunikation erwähnt; health.stats (0.4), Rate-Limiting (0.5) in Backend-Services/DTO angedeutet.
- **Epic 1:** Quiz erstellen, Fragentypen, Local-First, Preview (1.13) – in Frontend Quiz-Verwaltung und Dozent-Ablauf; SC-Schnellformate, Presets, Markdown/KaTeX in Komponenten/Text erwähnt.
- **Epic 2:** 2.1a Quiz-Upload + Session (quiz.upload, session.create), 2.2 Lobby (onParticipantJoined), 2.3 Steuerung (nextQuestion, revealResults), 2.4 Data-Stripping, 2.5 Beamer – in allen relevanten Diagrammen ✓.
- **Epic 3:** 3.1 Beitreten (getInfo, join), 3.2 Nicknames, 3.3a/b Frage/Vote, 3.5 Countdown – in Student-Sequenz und Frontend (NicknameSelect, VotingView, Countdown) ✓.
- **Epic 4:** 4.1 Leaderboard (getLeaderboard), 4.2 Cleanup (session.end, Redis), 4.6 Bonus-Token (getBonusTokens, onPersonalResult) – in Dozent/Student-Sequenz und Aktivität; Redis-Cleanup in Dozent-Sequenz ergänzt ✓.
- **Epic 5:** 5.6 Scorecard (onPersonalResult, PersonalScorecardDTO), 5.8 Emoji (session.react) – in Sequenzen und Frontend (Scorecard, EmojiBar) ✓.
- **Epic 6:** 6.3 Impressum/Datenschutz – Legal-Route und Imprint/Privacy-Komponenten in Frontend-Diagramm ergänzt ✓.
- **Epic 7:** Team-Modus – im DB-Schema (Team, Participant.teamId) und Backlog-Referenz; Frontend könnte Team-Leaderboard-Komponente bei Bedarf explizit benennen.
- **Epic 8:** Q&A (qa.submit, qa.upvote, qa.moderate, onQuestionsUpdated) – in Backend (qaRouter), Dozent/Student-Sequenz und Frontend (QaModerator, QaStudent) ✓.

---

## 5. Durchgeführte Anpassungen (Stand 2026-02-20)

1. **Frontend-Diagramm (diagrams.md):** Legal-Bereich mit ImprintComponent, PrivacyComponent und Route /legal ergänzt; QaModeratorComponent (Session-Steuerung), QaStudentComponent, RatingScaleComponent, FreetextInputComponent, MotivationMessageComponent (Student) ergänzt.
2. **Dozent-Sequenz (diagrams.md):** Nach session.end Schritt „Redis-Keys löschen (Story 4.2)“ ergänzt.
3. **architecture-overview.md:** Kurzer Hinweis im Datenfluss ergänzt, dass vor Session-Start das Quiz hochgeladen wird (Backlog 2.1a); Verweis auf diagrams.md für Details.

---

## 6. Kurzfassung

- **In sich konsistent:** Alle Diagramme sind intern schlüssig (Router, DTOs, Abläufe).
- **Untereinander konsistent:** diagrams.md und architecture-overview.md stimmen in Router-, DTO- und Data-Stripping-Beschreibung überein; einzige Vereinfachung: architecture-overview zeigt im Datenfluss keinen expliziten Quiz-Upload (Hinweis ergänzt).
- **Handbuch:** Technologie-Stack, Local-First, tRPC, Data-Stripping und Datenmodell sind in den Diagrammen abgebildet.
- **Backlog:** Relevante Stories aus Epics 0–8 sind in den Diagrammen abgedeckt; fehlende Komponenten (Legal, Q&A, Student-Features) und Redis-Cleanup wurden ergänzt.
