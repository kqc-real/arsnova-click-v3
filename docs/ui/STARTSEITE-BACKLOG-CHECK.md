# Startseite – Backlog-Funktionalitäts-Check

**Datum:** 2026-02-25  
**Basis:** Backlog.md – alle Optionen, die von der Startseite erreichbar oder sichtbar sein müssen

---

## Übersicht: Backlog vs. Startseite

| Backlog-Anforderung | Story | Sichtbar/Erreichbar | Status |
|---------------------|-------|---------------------|--------|
| Theme-Umschalter (Light/Dark/System) | 6.1 | Header | ✅ |
| Sprachwähler | 6.2 | Header | ✅ (DE/EN; 5 Sprachen noch offen) |
| Quiz-Presets (Seriös/Spielerisch) | 1.11 | Header | ✅ |
| Session erstellen / Quiz erstellen | 2.1a, Epic 1 | Erstellen-Karte | ✅ |
| Quiz wählen | Epic 1 | Erstellen-Karte | ✅ |
| Q&amp;A | 8.1 | Erstellen-Karte | ⚠️ Link zu /quiz (Platzhalter; Story 8.1 offen) |
| Session-Code-Eingabe (Beitreten) | 3.1 | Beitreten-Karte | ✅ |
| Server-Status-Widget | 0.4 | Status-Karte | ✅ |
| Bibliothek (Lokal &amp; Vorlagen) | Epic 1 | Bibliothek-Karte | ✅ Link „Zur Bibliothek“ → /quiz |
| Neues Quiz (Start-Karte) | Epic 1 | Start-Karte | ✅ |
| Beitreten (Start-Karte) | 3.1 | Start-Karte | ✅ |
| Impressum / Datenschutz | 6.3 | Footer (alle Seiten) | ✅ |
| Hilfe (Onboarding) | – | Erstellen-Karte | ✅ |

---

## Lücken

### 1. Bibliothek-Karte – ✅ Erledigt
Link „Zur Bibliothek“ hinzugefügt, führt zu `/quiz`.

### 2. Q&amp;A-Link
Der Link „Q&amp;A“ führt zu `/quiz`. Story 8.1 (Q&amp;A-Session) ist noch offen – der Link ist ein sinnvoller Platzhalter bis zur Implementierung.

---

## Zusammenfassung

- **Alle Lücken behoben.** Bibliothek-Karte hat nun Link „Zur Bibliothek“ → /quiz.
- **Platzhalter:** Q&amp;A → /quiz (korrekt bis Story 8.1)
