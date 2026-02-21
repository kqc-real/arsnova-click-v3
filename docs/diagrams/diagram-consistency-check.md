# Konsistenzprüfung: Diagramme · Handbuch · Backlog · Code

**Datum:** 2026-02-21  
**Geprüft:** diagrams.md, architecture-overview.md, handbook.md, Backlog.md, prisma/schema.prisma, libs/shared-types/src/schemas.ts, apps/backend/src/\*, apps/frontend/src/\*

---

## 1. Konsistenz innerhalb der Diagramme (diagrams.md)

### 1.1 Backend-Komponenten
- **Router:** health, quiz, session, vote, qa – untereinander konsistent; Verbindungen zu Services, DTO, Validation und PG/Redis/WebSocket/y-websocket stimmig.
- **DTO-Layer:** QuestionStudentDTO (kein isCorrect), QuestionRevealedDTO (mit isCorrect), SessionInfoDTO, LeaderboardEntryDTO, PersonalScorecardDTO – stimmt mit shared-types Zod-Schemas überein.
- **Validation:** SubmitVoteInputSchema, CreateSessionInputSchema, QuizUploadInputSchema im Diagramm – alle drei existieren identisch in `libs/shared-types/src/schemas.ts`. ✓
- **Header:** Als „Ziel-Architektur" gekennzeichnet; nur healthRouter ist implementiert. ✓

### 1.2 Frontend-Komponenten
- **Routen:** Home (/), Quiz (/quiz), Session (/session/:code), Beamer (/session/:code/present), Student (/session/:code/vote), Legal (/legal) – konsistent mit Backlog und Handbook.
- **Komponenten:** Alle geplanten Komponenten (inkl. QaModeratorComponent, QaStudentComponent, RatingScaleComponent, FreetextInputComponent, MotivationMessageComponent, EmojiBarComponent, BonusTokenDisplay, BonusTokenListComponent, EmojiOverlayComponent, QrCodeComponent, WordcloudComponent, RatingHistogramComponent, ImportExportComponent, ConfirmDialogComponent) sind abgebildet. ✓

### 1.3 Datenbank-Schema (erDiagram)
- **Entitäten:** Quiz, Question, AnswerOption, Session, Participant, Team, Vote, VoteAnswer, BonusToken, QaQuestion, QaUpvote – stimmen mit Prisma-Schema überein. ✓
- **Relationen & Kardinalitäten:** Alle 1:n- und n:m-Beziehungen korrekt.
- **Felder im erDiagram:** Nur eine Auswahl dargestellt (id, name, text, etc.). Prisma-Schema enthält deutlich mehr Felder (z. B. Quiz hat 17 Felder im Schema, 4 im Diagramm). Akzeptable Vereinfachung.

### 1.4 Sequenzdiagramme (Dozent & Student)
- **Dozent:** quiz.upload → session.create → Subscriptions → nextQuestion → revealResults → session.end → Redis-Cleanup → getBonusTokens – Reihenfolge konsistent mit Backlog (2.1a, 2.3, 2.4, 4.2, 4.6). ✓
- **Student:** session.getInfo → session.join → onQuestionRevealed → vote.submit → onResultsRevealed → onPersonalResult → onStatusChanged FINISHED → bonusToken – konsistent mit Backlog (3.1, 3.3a/b, 4.6, 5.6). ✓
- **DTOs:** QuestionStudentDTO (kein isCorrect) im ACTIVE-Status, QuestionRevealedDTO (mit isCorrect) im RESULTS-Status – korrekt dargestellt. ✓

### 1.5 Aktivitätsdiagramm
- Dozent/Student/Server-Phasen korrekt abgebildet.
- ⚠️ **`PAUSED`-Status** aus dem Prisma-Schema fehlt im Ablauf. Der Übergang von RESULTS zurück zur nächsten Frage wird direkt dargestellt, ohne den Zwischenzustand PAUSED.

---

## 2. Konsistenz zwischen diagrams.md und architecture-overview.md

| Thema | diagrams.md | architecture-overview.md | Bewertung |
|-------|-------------|--------------------------|-----------|
| tRPC-Router | health, quiz, session, vote, qa | health · quiz · session · vote · qa | ✓ gleich |
| DTOs | QuestionStudentDTO, QuestionRevealedDTO, SessionInfoDTO, LeaderboardEntryDTO, PersonalScorecardDTO | QuestionStudentDTO, QuestionRevealedDTO | ⚠️ Übersicht benennt nur 2 DTOs |
| Data-Stripping | ACTIVE ohne isCorrect, RESULTS mit isCorrect | Sicherheits-Diagramm + Datenfluss | ✓ gleich |
| Session-Ablauf | quiz.upload → session.create → … | Datenfluss zeigt quiz.upload + session.create | ✓ nach vorheriger Anpassung konsistent |
| Frontend-Routen | /, /quiz, /session/:code, /present, /vote, /legal | Home, Quiz, Session, Student, Legal | ✓ gleich |
| DB-Modelle | 11 Entitäten mit Relationen | 11 Entitäten, gleiche Relationen | ✓ gleich |
| Frontend-Komponenten | 37 Komponenten | 20 Komponenten | ⚠️ Vereinfacht (siehe 2.1) |

### 2.1 Fehlende Komponenten in architecture-overview.md

Die Komponenten-Hierarchie in architecture-overview.md ist eine **bewusst vereinfachte** Darstellung. Folgende Komponenten aus diagrams.md fehlen dort:

**Session-Steuerung:** QaModeratorComponent, BonusTokenListComponent  
**Beamer:** WordcloudComponent, RatingHistogramComponent, EmojiOverlayComponent, QrCodeComponent  
**Student:** McToggleButtonsComponent, RatingScaleComponent, FreetextInputComponent, MotivationMessageComponent, EmojiBarComponent, QaStudentComponent, BonusTokenDisplay  
**Shared:** LanguageSwitcherComponent, ConfirmDialogComponent, MarkdownKatexComponent (fehlt in Hierarchie-Darstellung)  
**Quiz:** ImportExportComponent, QuizConfigComponent

**Empfehlung:**  
Da beide Dateien als Living Documentation dienen, sollte architecture-overview.md entweder (a) einen expliziten Vermerk „Vereinfachte Darstellung – Details in diagrams.md" tragen oder (b) die fehlenden Komponenten ergänzt werden, um Verwirrung zu vermeiden.

---

## 3. Abdeckung Handbuch (Handbook)

| Handbuch-Kapitel | In Diagrammen abgebildet |
|------------------|--------------------------|
| **§2 Technologie-Stack** | Angular, tRPC, PostgreSQL/Prisma, Redis, Yjs – in architecture-overview + diagrams.md ✓ |
| **§3.1 Local-First & Zero-Knowledge** | Quiz-Bibliothek lokal (Yjs/IndexedDB); Session-Kopie (quiz.upload) in Dozent-Sequenz ✓ |
| **§3.2 End-to-End Typsicherheit** | tRPC Router, httpBatchLink/wsLink, Path-Alias @arsnova/api – in Frontend-Services und System-Architektur ✓ |
| **§3.3 Security & Data-Stripping** | QuestionStudentDTO ohne isCorrect, QuestionRevealedDTO mit isCorrect; Sicherheits-Diagramm in architecture-overview ✓ |
| **§5 Datenmodell** | Prisma als Single Source of Truth – erDiagram in beiden Dateien, synchron mit schema.prisma ✓ |

---

## 4. Abdeckung Backlog (Stories/Epics)

### Epic 0: Infrastruktur
| Story | Abgedeckt in Diagrammen | Anmerkung |
|-------|------------------------|-----------|
| 0.1 Redis-Setup | Redis in System- und Backend-Architektur ✓ | |
| 0.2 tRPC WebSocket | WebSocket Server + wsLink in Diagrammen ✓ | Code: noch nicht implementiert |
| 0.3 Yjs WebSocket | y-websocket Relay in Backend-Diagramm ✓ | |
| 0.4 health.stats | Nicht explizit in Diagrammen | ⚠️ ServerStatusWidget im Frontend-Diagramm, aber kein health.stats-Call in Sequenzdiagrammen |
| 0.5 Rate-Limiting | RateLimitService in Backend-Diagramm ✓ | Redis-basiert dargestellt |
| 0.6 CI/CD | Nicht in Architektur-Diagrammen (korrekt, da Dev-Tooling) | |

### Epic 1: Quiz-Verwaltung
- QuizEditorComponent, QuestionEditorComponent, AnswerEditorComponent, QuizPreviewComponent, ImportExportComponent – alle in Frontend-Diagramm ✓
- Quiz-Presets (1.11) und SC-Schnellformate (1.12) – clientseitig in shared-types definiert, Komponenten implizit in QuizConfigComponent ✓
- Markdown/KaTeX (1.7) – MarkdownKatexComponent in Shared ✓

### Epic 2: Session-Start & Steuerung
- quiz.upload + session.create in Dozent-Sequenz ✓
- QR-Code (2.1b) – QrCodeComponent im Beamer-Diagramm ✓
- Lobby (2.2) – LobbyComponent + onParticipantJoined ✓
- Data-Stripping (2.4) – QuestionStudentDTO/QuestionRevealedDTO in allen relevanten Diagrammen ✓
- Beamer-Ansicht (2.5) – BeamerViewComponent mit Chart, Leaderboard, Wordcloud, etc. ✓

### Epic 3: Student-Teilnahme
- session.getInfo + session.join in Student-Sequenz ✓
- Nicknames (3.2) – NicknameSelectComponent ✓
- Frage/Vote (3.3a/b) – VotingViewComponent, AnswerButtons, McToggle, Freetext, RatingScale ✓
- Countdown (3.5) – CountdownComponent in Beamer und Student ✓
- Anonymer Modus (3.6) – anonymousMode in Prisma-Schema, keine explizite Diagramm-Darstellung ⚠️

### Epic 4: Ergebnis & Cleanup
- Leaderboard (4.1) – LeaderboardComponent + LeaderboardEntryDTO ✓
- Cleanup (4.2) – Redis-Cleanup in Dozent-Sequenz ✓
- Ergebnis-Visualisierung (4.4) – ResultChartComponent, WordcloudComponent, RatingHistogramComponent ✓
- Bonus-Token (4.6) – BonusTokenListComponent, BonusTokenDisplay, Token-Generierung in Sequenzdiagramm ✓

### Epic 5: Gamification
- Sound/Musik (5.1, 5.3) – In Prisma-Schema (enableSoundEffects, backgroundMusic), nicht in Diagrammen dargestellt ⚠️ (akzeptabel, da clientseitig)
- Scorecard (5.6) – ScorecardComponent + PersonalScorecardDTO + onPersonalResult ✓
- Emoji (5.8) – EmojiBarComponent, EmojiOverlayComponent ✓
- Motivation (5.7) – MotivationMessageComponent ✓

### Epic 6: Theming, i18n, Legal
- Theme (6.1) – ThemeSwitcherComponent + ThemeService ✓
- i18n (6.2) – LanguageSwitcherComponent + I18nService ✓
- Legal (6.3) – ImprintComponent, PrivacyComponent, /legal Route ✓

### Epic 7: Team-Modus
- Team im DB-Schema (Team, Participant.teamId) ✓
- TeamLeaderboardEntryDTO in shared-types ✓
- ⚠️ Kein explizites Team-Leaderboard-Component im Frontend-Diagramm (könnte als Teil von LeaderboardComponent geplant sein)

### Epic 8: Q&A
- qaRouter in Backend-Diagramm ✓
- QaModeratorComponent (Dozent), QaStudentComponent (Student) ✓
- QaQuestion, QaUpvote im DB-Schema ✓
- QaQuestionDTO, SubmitQaQuestionInputSchema, UpvoteQaQuestionInputSchema in shared-types ✓

---

## 5. Konsistenz Zod-Schemas ↔ Prisma-Schema

| Zod-Schema (shared-types) | Prisma-Modell/Enum | Status |
|---------------------------|--------------------|--------|
| QuestionTypeEnum | QuestionType | ✓ Werte identisch |
| SessionStatusEnum | SessionStatus | ✓ Werte identisch |
| DifficultyEnum | Difficulty | ✓ Werte identisch |
| NicknameThemeEnum | NicknameTheme | ✓ Werte identisch |
| TeamAssignmentEnum | TeamAssignment | ✓ Werte identisch |
| QaQuestionStatusEnum | QaQuestionStatus | ✓ Werte identisch |
| SessionTypeEnum | SessionType | ✓ Werte identisch |
| QuizUploadInputSchema | Quiz + Question + AnswerOption | ✓ Felder stimmen überein |
| CreateSessionInputSchema | Session | ✓ type, quizId, title, moderationMode |
| JoinSessionInputSchema | Participant + Session | ✓ code (6 Zeichen), nickname |
| SubmitVoteInputSchema | Vote + VoteAnswer | ✓ sessionId, questionId, answerIds, freeText, ratingValue, responseTimeMs |

**Bewertung:** Alle Zod-Enums sind synchron mit den Prisma-Enums. Input-Schemas spiegeln die Prisma-Modelle korrekt wider. ✓

---

## 6. Konsistenz Diagramme ↔ Code (aktueller Implementierungsstand)

| Aspekt | Im Diagramm | Im Code | Status |
|--------|-------------|---------|--------|
| Backend-Router | health, quiz, session, vote, qa | nur healthRouter | ⚠️ Ziel-Architektur |
| Backend-Services | ScoringService, StreakService, etc. | keine Services | ⚠️ Ziel-Architektur |
| Backend Prisma-Nutzung | pg[(PostgreSQL - Prisma 7)] | kein Prisma-Import | ⚠️ Ziel-Architektur |
| Frontend Routen | /, /quiz, /session/:code, /legal | `Routes = []` (leer) | ⚠️ Ziel-Architektur |
| Frontend wsLink | trpc[httpBatchLink + wsLink] | nur httpBatchLink | ⚠️ Ziel-Architektur |
| Frontend Komponenten | 37 Komponenten | nur AppComponent | ⚠️ Ziel-Architektur |
| Shared-Types | 20+ Schemas/DTOs definiert | definiert, nicht genutzt | ✓ Vorbereitet |

**Bewertung:** Alle Deltas sind erwartete Differenzen zwischen Ziel-Architektur und aktuellem Prototyp-Stand (nur Health-Check). Kein unerwarteter Widerspruch.

---

## 7. Gefundene Probleme

### 7.1 `PAUSED`-Status fehlt in Diagrammen
Der Prisma-Enum `SessionStatus` enthält `PAUSED`, aber kein Sequenz- oder Aktivitätsdiagramm zeigt diesen Zustand. Im Ablauf fehlt der Übergang RESULTS → PAUSED → ACTIVE (nächste Frage).

**Empfehlung:** Im Aktivitätsdiagramm den Zustand PAUSED zwischen zwei Fragen einfügen, oder wenn PAUSED nicht genutzt wird, aus dem Enum entfernen.

**Erledigt (2026-02-21):** `PAUSED`-Status in Aktivitäts- und Dozent-Sequenzdiagramm (diagrams.md) integriert.

### 7.2 `health.stats` nicht in Sequenzdiagrammen
Story 0.4 definiert `health.stats` mit ServerStatusWidget auf der Startseite. Das ServerStatusWidget ist im Frontend-Diagramm vorhanden, aber kein Sequenzdiagramm zeigt den health.stats-Aufruf.

**Empfehlung:** Optional: Kurzes Sequenzdiagramm für die Startseite (Home → health.check + health.stats) ergänzen, oder als „trivial" weglassen.

### 7.3 Team-Leaderboard-Komponente fehlt
`TeamLeaderboardEntryDTO` ist in shared-types definiert, aber kein Frontend-Diagramm zeigt eine dedizierte Team-Leaderboard-Komponente.

**Empfehlung:** Falls das Team-Leaderboard in `LeaderboardComponent` integriert wird, dies als Anmerkung im Diagramm vermerken. Alternativ `TeamLeaderboardComponent` hinzufügen.

---

## 8. Zusammenfassung

| Aspekt | Bewertung |
|--------|-----------|
| **Diagramme intern** | ✓ Konsistent (Router, DTOs, Abläufe, DB-Schema stimmig) |
| **diagrams.md ↔ architecture-overview.md** | ✅ architecture-overview als vereinfachte Übersicht gekennzeichnet; Details in diagrams.md |
| **Diagramme ↔ Handbook** | ✓ Alle Kernkonzepte (Local-First, tRPC, Data-Stripping, Datenmodell) abgebildet |
| **Diagramme ↔ Backlog** | ✓ Relevante Stories aus Epics 0–8 abgedeckt; PAUSED-Status ergänzt, 2 kleine offene Lücken (7.2–7.3) |
| **Zod-Schemas ↔ Prisma** | ✓ Alle Enums synchron, Input-Schemas spiegeln Modelle korrekt |
| **Diagramme ↔ Code** | ⚠️ Erwartete Deltas (Ziel-Architektur vs. Prototyp) |

**Gesamtbewertung:** Die Diagramme sind intern konsistent und decken Handbook sowie Backlog umfassend ab. Die architecture-overview.md ist nun explizit als vereinfachte Übersicht gekennzeichnet. Der PAUSED-Status wurde in den Diagrammen ergänzt. Zwei optionale Lücken verbleiben (health.stats-Sequenz, Team-Leaderboard-Komponente).
