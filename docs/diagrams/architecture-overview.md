# 🏗️ Architektur-Übersicht: arsnova.click V3

**Erstellt:** 2026-02-20  
**Zweck:** Visualisierung der gesamten Codebasis-Struktur und Architektur

## System-Architektur-Diagramm

```mermaid
graph TB
    subgraph "Monorepo (npm Workspaces)"
        subgraph "Frontend - Angular 17+ (aktuell 19)"
            FE[Angular App<br/>Port 4200]
            FE_COMP[Standalone Components<br/>Signals · Tailwind CSS]
            FE_ROUTES[Routing<br/>/quiz /session /vote]
            FE_SERVICES[Services<br/>tRPC Client · Yjs · Theme · i18n]
        end
        
        subgraph "Backend - Node.js + tRPC"
            BE[Express Server<br/>Port 3000]
            TRPC[tRPC Router<br/>/trpc]
            ROUTERS[Router Layer<br/>health · quiz · session<br/>vote · qa]
            SERVICES[Service Layer<br/>Scoring · Streak · SessionCode<br/>RateLimit · BonusToken]
            DTO[DTO Layer<br/>Data Stripping<br/>QuestionStudentDTO<br/>QuestionRevealedDTO]
        end
        
        subgraph "Shared Library"
            SHARED[shared-types Library<br/>Zod Schemas<br/>Type Definitions]
        end
    end
    
    subgraph "Datenbanken & Storage"
        PG[(PostgreSQL<br/>Prisma ORM<br/>Sessions · Votes<br/>Participants)]
        REDIS[(Redis<br/>Pub/Sub<br/>Rate Limiting)]
        IDB[(IndexedDB<br/>Yjs CRDT<br/>Local-First Quizzes)]
    end
    
    subgraph "Externe Clients"
        DOZENT[Dozent Client<br/>Quiz-Erstellung<br/>Session-Steuerung]
        STUDENT[Student Client<br/>Voting<br/>Leaderboard]
    end
    
    subgraph "Echtzeit-Kommunikation"
        WS[WebSocket<br/>tRPC Subscriptions]
        YWS[y-websocket<br/>Yjs Sync Relay]
    end
    
    %% Frontend-Verbindungen
    FE --> FE_COMP
    FE --> FE_ROUTES
    FE --> FE_SERVICES
    FE_SERVICES --> SHARED
    FE_SERVICES --> WS
    FE_SERVICES --> YWS
    FE_SERVICES --> IDB
    
    %% Backend-Verbindungen
    BE --> TRPC
    TRPC --> ROUTERS
    ROUTERS --> SERVICES
    ROUTERS --> DTO
    SERVICES --> PG
    SERVICES --> REDIS
    ROUTERS --> SHARED
    DTO --> SHARED
    
    %% Echtzeit-Verbindungen
    WS --> BE
    YWS --> BE
    REDIS --> WS
    
    %% Client-Verbindungen
    DOZENT --> FE
    STUDENT --> FE
    DOZENT --> IDB
    
    %% Styling
    classDef frontend fill:#DD0031,stroke:#333,stroke-width:2px,color:#fff
    classDef backend fill:#2596be,stroke:#333,stroke-width:2px,color:#fff
    classDef shared fill:#2D3748,stroke:#333,stroke-width:2px,color:#fff
    classDef database fill:#4A90E2,stroke:#333,stroke-width:2px,color:#fff
    classDef client fill:#7B68EE,stroke:#333,stroke-width:2px,color:#fff
    
    class FE,FE_COMP,FE_ROUTES,FE_SERVICES frontend
    class BE,TRPC,ROUTERS,SERVICES,DTO backend
    class SHARED shared
    class PG,REDIS,IDB database
    class DOZENT,STUDENT client
```

## Datenfluss-Diagramm

```mermaid
sequenceDiagram
    participant D as Dozent
    participant FE as Frontend (Angular)
    participant YJS as Yjs (IndexedDB)
    participant BE as Backend (tRPC)
    participant PG as PostgreSQL
    participant R as Redis
    participant S as Student
    
    Note over D,YJS: Local-First: Quiz wird lokal gespeichert
    D->>FE: Quiz erstellen/bearbeiten
    FE->>YJS: CRDT-Dokument speichern
    YJS-->>FE: Sync bestätigt
    
    Note over D,BE: Session starten (Backlog 2.1a)
    D->>FE: Live schalten
    FE->>BE: quiz.upload (Quiz-Kopie)
    BE->>PG: Quiz + Questions speichern
    FE->>BE: session.create()
    BE->>PG: Session speichern
    BE->>R: Code registrieren
    BE-->>FE: Session-Code zurück
    
    Note over S,BE: Student tritt bei
    S->>FE: Code eingeben
    FE->>BE: session.join()
    BE->>PG: Participant erstellen
    BE->>R: Pub/Sub: onParticipantJoined
    R-->>D: Echtzeit-Update
    
    Note over D,S: Frage wird gestartet
    D->>FE: Nächste Frage
    FE->>BE: session.nextQuestion()
    BE->>PG: Status = ACTIVE
    BE->>R: Pub/Sub: onQuestionRevealed
    R-->>S: Frage anzeigen (OHNE isCorrect!)
    
    Note over S,BE: Student votet
    S->>FE: Antwort auswählen
    FE->>BE: vote.submit()
    BE->>PG: Vote speichern
    BE->>R: Pub/Sub: onVoteCountUpdate
    R-->>D: Live-Update
    
    Note over D,S: Ergebnisse werden aufgelöst
    D->>FE: Ergebnisse zeigen
    FE->>BE: session.revealResults()
    BE->>PG: Status = RESULTS
    BE->>BE: Scoring berechnen
    BE->>R: Pub/Sub: onResultsRevealed (MIT isCorrect!)
    R-->>S: Ergebnisse + Punkte
```

## Komponenten-Hierarchie

```mermaid
graph TD
    subgraph "Frontend Komponenten"
        APP[AppComponent]
        
        subgraph "Home Route"
            HOME[HomePageComponent]
            STATUS[ServerStatusWidget]
            JOIN[JoinInputComponent]
        end
        
        subgraph "Quiz-Verwaltung"
            QLIST[QuizListComponent]
            QEDIT[QuizEditorComponent]
            QCONFIG[QuizConfigComponent]
            QEDITOR[QuestionEditorComponent]
            AEDITOR[AnswerEditorComponent]
            PREVIEW[QuizPreviewComponent]
        end
        
        subgraph "Session-Steuerung (Dozent)"
            LOBBY[LobbyComponent]
            CONTROL[QuizControlComponent]
            BEAMER[BeamerViewComponent]
            CHART[ResultChartComponent]
            LEADERBOARD[LeaderboardComponent]
        end
        
        subgraph "Student-Ansicht"
            NICK[NicknameSelectComponent]
            VOTING[VotingViewComponent]
            BUTTONS[AnswerButtonsComponent]
            SCORECARD[ScorecardComponent]
        end

        subgraph "Legal - /legal"
            IMPRINT[ImprintComponent]
            PRIVACY[PrivacyComponent]
        end
        
        subgraph "Shared Components"
            HEADER[HeaderComponent]
            FOOTER[FooterComponent]
            THEME[ThemeSwitcherComponent]
            COUNTDOWN[CountdownComponent]
            MARKDOWN[MarkdownKatexComponent]
        end
    end
    
    APP --> HOME
    APP --> HEADER
    APP --> FOOTER
    
    HOME --> STATUS
    HOME --> JOIN
    
    QLIST --> QEDIT
    QEDIT --> QCONFIG
    QEDIT --> QEDITOR
    QEDIT --> PREVIEW
    QEDITOR --> AEDITOR
    
    LOBBY --> CONTROL
    CONTROL --> BEAMER
    BEAMER --> CHART
    BEAMER --> LEADERBOARD
    
    NICK --> VOTING
    VOTING --> BUTTONS
    VOTING --> SCORECARD
    
    HEADER --> THEME
    FOOTER --> IMPRINT
    FOOTER --> PRIVACY
    BEAMER --> COUNTDOWN
    VOTING --> COUNTDOWN
    QEDITOR --> MARKDOWN
```

## Technologie-Stack Übersicht

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#e3f2fd', 'primaryTextColor': '#0d47a1', 'primaryBorderColor': '#1976d2', 'secondaryColor': '#e8f5e9', 'secondaryTextColor': '#1b5e20', 'secondaryBorderColor': '#388e3c', 'tertiaryColor': '#fff8e1', 'tertiaryTextColor': '#bf360c', 'tertiaryBorderColor': '#ff9800', 'lineColor': '#37474f', 'textColor': '#212121' }}}%%
mindmap
  root((arsnova.click V3))
    Frontend
      Angular 17+
        Standalone Components
        Signals
        Control Flow @if @for
      Tailwind CSS
      tRPC Client
        httpBatchLink
        wsLink
      Yjs
        CRDTs
        IndexedDB
        y-websocket
    Backend
      Node.js
        Express
        TypeScript
      tRPC
        Router
        Procedures
        Subscriptions
      Prisma ORM
        PostgreSQL
        Schema
        Migrations
      Redis
        Pub/Sub
        Rate Limiting
    Shared
      shared-types Library
        Zod Schemas
        Type Definitions
        DTOs
    Architektur
      Local-First
        Zero-Knowledge
        Yjs CRDTs
      End-to-End Typsicherheit
        tRPC
        Zod Validation
      Data Stripping
        DTO Pattern
        Security
```

## Datenbank-Schema Übersicht

```mermaid
erDiagram
    Quiz ||--o{ Question : enthaelt
    Quiz ||--o{ Session : verwendet_in
    Question ||--o{ AnswerOption : hat
    Question ||--o{ Vote : erhaelt
    Session ||--o{ Participant : hat
    Session ||--o{ Vote : sammelt
    Session ||--o{ Team : hat
    Session ||--o{ BonusToken : generiert
    Session ||--o{ QaQuestion : enthaelt
    Participant ||--o{ Vote : gibt_ab
    Participant ||--o{ BonusToken : erhaelt
    Participant ||--o{ QaQuestion : stellt
    Participant ||--o{ QaUpvote : votet
    Team ||--o{ Participant : besteht_aus
    Vote ||--o{ VoteAnswer : waehlt
    AnswerOption ||--o{ VoteAnswer : wird_gewaehlt
    QaQuestion ||--o{ QaUpvote : erhaelt

    Quiz {
        string id PK
        string name
        boolean showLeaderboard
        int bonusTokenCount
    }
    Question {
        string id PK
        string text
        enum type
        enum difficulty
    }
    Session {
        string id PK
        string code UK
        enum status
    }
    Participant {
        string id PK
        string nickname
    }
    Vote {
        string id PK
        int score
        int streakCount
    }
```

## Sicherheits-Architektur

```mermaid
graph LR
    subgraph "Zero-Knowledge Prinzip"
        Q[Quiz-Daten]
        Q -->|Nur lokal| IDB[IndexedDB<br/>Yjs CRDT]
        Q -.->|Nur Deltas| YWS[y-websocket<br/>Multi-Device Sync]
    end
    
    subgraph "Data Stripping Pattern"
        PG[(PostgreSQL<br/>isCorrect = true)]
        PG -->|Laden| BE[Backend]
        BE -->|DTO Filter| STUDENT_DTO[QuestionStudentDTO<br/>⚠️ KEIN isCorrect]
        BE -->|DTO Filter| REVEALED_DTO[QuestionRevealedDTO<br/>✅ MIT isCorrect]
        
        STUDENT_DTO -->|Status: ACTIVE| STUDENT[Student Client]
        REVEALED_DTO -->|Status: RESULTS| STUDENT
    end
    
    subgraph "Rate Limiting"
        CLIENT[Client Request]
        CLIENT -->|Sliding Window| REDIS[(Redis)]
        REDIS -->|Allow/Deny| BE
    end
    
    style STUDENT_DTO fill:#ff6b6b
    style REVEALED_DTO fill:#51cf66
    style IDB fill:#4dabf7
```

---

**Weitere Diagramme:** Detaillierte Backend- und Frontend-Komponenten, Datenbank-Schema, Kommunikation Dozent/Student sowie Aktivitätsablauf finden sich in [diagrams.md](./diagrams.md) (Mermaid, von GitHub gerendert).

**Hinweis:** Diese Diagramme sind eine **vereinfachte Übersicht** (Living Documentation). Die vollständige Komponentenliste und alle DTOs finden sich in [diagrams.md](./diagrams.md). Bei größeren Architekturänderungen sollten beide Dateien aktualisiert werden.
