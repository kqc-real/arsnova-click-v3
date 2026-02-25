# 🎬 Live-Szenario: Eine "Vibe Coding" Session (Student & KI)

### 🔄 Turn 1: Das Setup & Das Backend (tRPC)
**Student (Prompt):**
> "Hallo KI! Lies die `AGENT.md` und das `schema.prisma`. Wir arbeiten an Epic 1. Baue mir den tRPC-Endpunkt `getQuizById`. Er soll das Quiz aus Postgres laden. Schreibe **NUR den Backend-Code**."

**KI (Antwort):**
> *Generiert fehlerfreien tRPC-Router-Code mit Zod-Validierung und Prisma-Query.*

### 🔄 Turn 2: Der Frontend-Entwurf (Und der Fehler)
**Student (Prompt):**
> "Perfekt! Jetzt das Angular Frontend. Erstelle die `QuizViewComponent`. Lade die Daten via tRPC und zeige sie in einer Angular-Material-Card mit tokenbasiertem Styling."

**KI (Antwort):**
> *Generiert die Komponente, macht aber einen Fehler:*
> `quiz$ = new BehaviorSubject<any>(null);` (Nutzt altes RxJS Muster!)

### 🔄 Turn 3: Der Architekt greift ein (Die "Code Defense")
**Student (Prompt):**
> "HALT! Lies Regel #2 aus der `AGENT.md`. Du hast gerade `BehaviorSubject` für den UI-Zustand verwendet. Das ist verboten! Nutze ausschließlich **Angular Signals**."

**KI (Antwort):**
> *Entschuldigt sich und liefert den perfekten, modernen Code:*
> `quiz = signal<Quiz | null>(null);`