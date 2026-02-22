import { z } from 'zod';

// ---------------------------------------------------------------------------
// Enums – müssen mit Prisma-Schema synchron bleiben
// ---------------------------------------------------------------------------

export const QuestionTypeEnum = z.enum([
  'MULTIPLE_CHOICE',
  'SINGLE_CHOICE',
  'FREETEXT',
  'SURVEY',
  'RATING',
]);
export type QuestionType = z.infer<typeof QuestionTypeEnum>;

export const SessionStatusEnum = z.enum([
  'LOBBY',
  'QUESTION_OPEN',
  'ACTIVE',
  'PAUSED',
  'RESULTS',
  'FINISHED',
]);
export type SessionStatus = z.infer<typeof SessionStatusEnum>;

export const DifficultyEnum = z.enum(['EASY', 'MEDIUM', 'HARD']);
export type Difficulty = z.infer<typeof DifficultyEnum>;

export const NicknameThemeEnum = z.enum([
  'NOBEL_LAUREATES',
  'KINDERGARTEN',
  'PRIMARY_SCHOOL',
  'MIDDLE_SCHOOL',
  'HIGH_SCHOOL',
]);
export type NicknameTheme = z.infer<typeof NicknameThemeEnum>;

export const TeamAssignmentEnum = z.enum(['AUTO', 'MANUAL']);
export type TeamAssignment = z.infer<typeof TeamAssignmentEnum>;

export const QaQuestionStatusEnum = z.enum([
  'PENDING',
  'ACTIVE',
  'PINNED',
  'ARCHIVED',
  'DELETED',
]);
export type QaQuestionStatus = z.infer<typeof QaQuestionStatusEnum>;

export const SessionTypeEnum = z.enum(['QUIZ', 'Q_AND_A']);
export type SessionType = z.infer<typeof SessionTypeEnum>;

/** Quiz-Presets für Schnellkonfiguration (Story 1.11) */
export const QuizPresetEnum = z.enum(['PLAYFUL', 'SERIOUS']);
export type QuizPreset = z.infer<typeof QuizPresetEnum>;

/** Multiplikatoren für die Punkteberechnung pro Schwierigkeitsgrad */
export const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};

/** Maximale Basispunkte pro Frage (vor Multiplikator) */
export const MAX_BASE_POINTS = 1000;

/** Streak-Multiplikatoren für aufeinanderfolgende richtige Antworten (Story 5.5) */
export const STREAK_MULTIPLIER: Record<number, number> = {
  0: 1.0,
  1: 1.0,
  2: 1.1,
  3: 1.2,
  4: 1.3,
};
/** Ab 5+ Streak gilt dieser Maximal-Multiplikator */
export const STREAK_MULTIPLIER_MAX = 1.5;

/** Verfügbare Emoji-Reaktionen (Story 5.8) */
export const EMOJI_REACTIONS = ['👏', '🎉', '😮', '😂', '😢'] as const;
export type EmojiReaction = (typeof EMOJI_REACTIONS)[number];

// ---------------------------------------------------------------------------
// Quiz-Schemas (Zod) – werden in Backend (Validierung) & Frontend (Forms) genutzt
// ---------------------------------------------------------------------------

/** Schema für die Erstellung eines neuen Quizzes */
export const CreateQuizInputSchema = z.object({
  name: z.string().min(1, 'Quiz-Name darf nicht leer sein').max(200),
  description: z.string().max(1000).optional(),
  showLeaderboard: z.boolean().optional().default(true),
  allowCustomNicknames: z.boolean().optional().default(true),
  defaultTimer: z.number().int().min(5).max(300).nullable().optional(),
  enableSoundEffects: z.boolean().optional().default(true),
  enableRewardEffects: z.boolean().optional().default(true),
  enableMotivationMessages: z.boolean().optional().default(true),
  enableEmojiReactions: z.boolean().optional().default(true),
  anonymousMode: z.boolean().optional().default(false),
  teamMode: z.boolean().optional().default(false),
  teamCount: z.number().int().min(2).max(8).optional(),
  teamAssignment: TeamAssignmentEnum.optional().default('AUTO'),
  backgroundMusic: z.string().max(50).nullable().optional().default(null),
  nicknameTheme: NicknameThemeEnum.optional().default('NOBEL_LAUREATES'),
  bonusTokenCount: z.number().int().min(1).max(50).nullable().optional().default(null), // Story 4.6
  readingPhaseEnabled: z.boolean().optional().default(true), // Story 2.6: Zwei-Phasen-Frageanzeige (Lesephase)
});

/** Schema für eine einzelne Antwortoption beim Hinzufügen/Bearbeiten */
export const AnswerOptionInputSchema = z.object({
  text: z.string().min(1, 'Antworttext darf nicht leer sein').max(500),
  isCorrect: z.boolean(),
});
export type AnswerOptionInput = z.infer<typeof AnswerOptionInputSchema>;

/** Schema für das Hinzufügen/Bearbeiten einer Frage (Story 1.2a, 1.2b, 1.3) */
export const AddQuestionInputSchema = z.object({
  text: z.string().min(1, 'Fragenstamm darf nicht leer sein').max(2000),
  type: QuestionTypeEnum,
  timer: z.number().int().min(5).max(300).nullable().optional(),
  difficulty: DifficultyEnum.optional().default('MEDIUM'),
  order: z.number().int().min(0),
  answers: z.array(AnswerOptionInputSchema).max(10),
  ratingMin: z.number().int().min(0).max(10).optional(),    // Nur bei RATING
  ratingMax: z.number().int().min(1).max(10).optional(),    // Nur bei RATING
  ratingLabelMin: z.string().max(50).optional(),            // Nur bei RATING
  ratingLabelMax: z.string().max(50).optional(),            // Nur bei RATING
});
export type AddQuestionInput = z.infer<typeof AddQuestionInputSchema>;

/** Schema für den Quiz-Upload beim Live-Schalten (Story 2.1a) */
export const QuizUploadInputSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  showLeaderboard: z.boolean(),
  allowCustomNicknames: z.boolean(),
  defaultTimer: z.number().int().min(5).max(300).nullable().optional(),
  enableSoundEffects: z.boolean(),
  enableRewardEffects: z.boolean(),
  enableMotivationMessages: z.boolean(),
  enableEmojiReactions: z.boolean(),
  anonymousMode: z.boolean(),
  teamMode: z.boolean(),
  teamCount: z.number().int().min(2).max(8).nullable().optional(),
  teamAssignment: TeamAssignmentEnum.optional(),
  backgroundMusic: z.string().max(50).nullable().optional(),
  nicknameTheme: NicknameThemeEnum,
  bonusTokenCount: z.number().int().min(1).max(50).nullable().optional(), // Story 4.6
  readingPhaseEnabled: z.boolean().optional(), // Story 2.6: Zwei-Phasen-Frageanzeige
  questions: z.array(AddQuestionInputSchema).min(1, 'Mindestens eine Frage erforderlich'),
});
export type QuizUploadInput = z.infer<typeof QuizUploadInputSchema>;

// ---------------------------------------------------------------------------
// Session-Schemas (Story 2.1–2.3)
// ---------------------------------------------------------------------------

/** Input: Eine neue Live-Session starten */
export const CreateSessionInputSchema = z.object({
  type: SessionTypeEnum.optional().default('QUIZ'),       // Story 8.1: Quiz oder Q&A
  quizId: z.string().uuid().optional(),                    // Pflicht bei QUIZ, null bei Q_AND_A
  title: z.string().max(200).optional(),                   // Story 8.1: Titel für Q&A-Runde
  moderationMode: z.boolean().optional().default(false),   // Story 8.4: Q&A-Fragen moderieren
});
export type CreateSessionInput = z.infer<typeof CreateSessionInputSchema>;

/** Input: Einer Session beitreten (Story 3.1) */
export const JoinSessionInputSchema = z.object({
  code: z.string().length(6, 'Session-Code muss 6 Zeichen lang sein'),
  nickname: z.string().min(1).max(30),
});
export type JoinSessionInput = z.infer<typeof JoinSessionInputSchema>;

// ---------------------------------------------------------------------------
// Vote-Schemas (Story 3.3)
// ---------------------------------------------------------------------------

/** Input: Abstimmung abgeben */
export const SubmitVoteInputSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  answerIds: z.array(z.string().uuid()).optional(), // MC: mehrere, SC: eine, FREETEXT/RATING: keine
  freeText: z.string().max(500).optional(),
  ratingValue: z.number().int().min(0).max(10).optional(), // Nur bei RATING
  responseTimeMs: z.number().int().min(0).optional(), // Antwortzeit in ms
});
export type SubmitVoteInput = z.infer<typeof SubmitVoteInputSchema>;

// ---------------------------------------------------------------------------
// DTOs – Sichere Antwort-Objekte für den Client (Data-Stripping!)
// ---------------------------------------------------------------------------

/**
 * DTO: Antwort-Option OHNE isCorrect (Story 2.4 / Security).
 * WIRD an Studenten gesendet – enthält bewusst kein `isCorrect`!
 */
export const AnswerOptionStudentDTOSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
});
export type AnswerOptionStudentDTO = z.infer<typeof AnswerOptionStudentDTOSchema>;

/**
 * DTO: Antwort-Option MIT isCorrect (Story 3.4 / Ergebnis-Phase).
 * Wird erst NACH Auflösung durch den Dozenten (Status RESULTS) gesendet!
 */
export const AnswerOptionRevealedDTOSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  isCorrect: z.boolean(),
  voteCount: z.number(),        // Anzahl Votes für diese Option
  votePercentage: z.number(),   // Prozentualer Anteil (0–100)
});
export type AnswerOptionRevealedDTO = z.infer<typeof AnswerOptionRevealedDTOSchema>;

/** DTO: Frage mit aufgelösten Ergebnissen (Story 3.4, 4.4) */
export const QuestionRevealedDTOSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  type: QuestionTypeEnum,
  difficulty: DifficultyEnum,
  order: z.number(),
  answers: z.array(AnswerOptionRevealedDTOSchema),
  freeTextResponses: z.array(z.string()).optional(), // Nur bei FREETEXT-Fragen
  totalVotes: z.number(),
});
export type QuestionRevealedDTO = z.infer<typeof QuestionRevealedDTOSchema>;

/** DTO: Frage für Studenten (ohne Lösung) */
export const QuestionStudentDTOSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  type: QuestionTypeEnum,
  timer: z.number().nullable(),
  difficulty: DifficultyEnum,
  order: z.number(),
  answers: z.array(AnswerOptionStudentDTOSchema),
  ratingMin: z.number().nullable().optional(),        // Nur bei RATING
  ratingMax: z.number().nullable().optional(),        // Nur bei RATING
  ratingLabelMin: z.string().nullable().optional(),   // Nur bei RATING
  ratingLabelMax: z.string().nullable().optional(),   // Nur bei RATING
});
export type QuestionStudentDTO = z.infer<typeof QuestionStudentDTOSchema>;

/**
 * DTO: Frage in der Lesephase – NUR Fragenstamm, KEINE Antwortoptionen (Story 2.6).
 * Wird im Status QUESTION_OPEN an alle Clients gesendet.
 * Der Dozent gibt erst danach die Antworten frei (→ ACTIVE + QuestionStudentDTO).
 */
export const QuestionPreviewDTOSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  type: QuestionTypeEnum,
  difficulty: DifficultyEnum,
  order: z.number(),
  ratingMin: z.number().nullable().optional(),        // Nur bei RATING
  ratingMax: z.number().nullable().optional(),        // Nur bei RATING
  ratingLabelMin: z.string().nullable().optional(),   // Nur bei RATING
  ratingLabelMax: z.string().nullable().optional(),   // Nur bei RATING
});
export type QuestionPreviewDTO = z.infer<typeof QuestionPreviewDTOSchema>;

/** DTO: Session-Info für den Beitritt */
export const SessionInfoDTOSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  type: SessionTypeEnum,                           // Story 8.1: Quiz oder Q&A
  status: SessionStatusEnum,
  quizName: z.string().nullable(),                 // null bei Q&A-Sessions
  title: z.string().nullable().optional(),          // Story 8.1: Q&A-Titel
  participantCount: z.number(),
});
export type SessionInfoDTO = z.infer<typeof SessionInfoDTOSchema>;

/** DTO: Teilnehmer-Info */
export const ParticipantDTOSchema = z.object({
  id: z.string().uuid(),
  nickname: z.string(),
});
export type ParticipantDTO = z.infer<typeof ParticipantDTOSchema>;

/** DTO: Leaderboard-Eintrag (Story 4.1) */
export const LeaderboardEntryDTOSchema = z.object({
  rank: z.number(),
  nickname: z.string(),
  totalScore: z.number(),        // Gesamtpunkte (Schwierigkeit × Zeitbonus)
  correctCount: z.number(),      // Anzahl richtiger Antworten
  totalQuestions: z.number(),     // Gesamtanzahl Fragen
  totalResponseTimeMs: z.number(), // Gesamtantwortzeit in ms (Tiebreaker)
});
export type LeaderboardEntryDTO = z.infer<typeof LeaderboardEntryDTOSchema>;

/** DTO: Persönliche Scorecard nach jeder Frage (Story 5.6) */
export const PersonalScorecardDTOSchema = z.object({
  questionOrder: z.number(),         // Frage-Nr. (1-basiert)
  wasCorrect: z.boolean().nullable(), // null bei SURVEY/FREETEXT
  correctAnswerIds: z.array(z.string().uuid()).optional(), // Korrekte Antwort-IDs (bei Falsch)
  questionScore: z.number(),         // Punkte für diese Frage (inkl. Streak)
  baseScore: z.number(),             // Punkte vor Streak-Multiplikator
  streakCount: z.number(),           // Aktuelle Serie
  streakMultiplier: z.number(),      // Angewandter Streak-Faktor
  currentRank: z.number(),           // Aktueller Rang
  previousRank: z.number().nullable(), // Rang nach vorheriger Frage (null bei 1. Frage)
  rankChange: z.number(),            // Differenz (positiv = aufgestiegen)
  totalScore: z.number(),            // Gesamtpunktzahl bisher
  bonusToken: z.string().nullable().optional(), // Story 4.6: Token-Code (nur für Top-X, sonst null)
});
export type PersonalScorecardDTO = z.infer<typeof PersonalScorecardDTOSchema>;

/** DTO: Team-Leaderboard-Eintrag (Story 7.1) */
export const TeamLeaderboardEntryDTOSchema = z.object({
  rank: z.number(),
  teamName: z.string(),
  teamColor: z.string().nullable(),
  totalScore: z.number(),           // Summe aller Mitglieder-Scores
  memberCount: z.number(),
  averageScore: z.number(),         // Durchschnitt pro Mitglied
});
export type TeamLeaderboardEntryDTO = z.infer<typeof TeamLeaderboardEntryDTOSchema>;

/** Input: Emoji-Reaktion senden (Story 5.8) */
export const SendEmojiReactionInputSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  emoji: z.enum(EMOJI_REACTIONS),
});
export type SendEmojiReactionInput = z.infer<typeof SendEmojiReactionInputSchema>;

// ---------------------------------------------------------------------------
// Health-Check & Server-Status
// ---------------------------------------------------------------------------

/** Health-Check Response */
export const HealthCheckResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  version: z.string(),
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

/** DTO: Server-Auslastung für die Startseite (Story 0.4) */
export const ServerStatsDTOSchema = z.object({
  activeSessions: z.number(),      // Anzahl laufender Quiz-Sessions (Status != FINISHED)
  totalParticipants: z.number(),   // Summe aller Teilnehmer in aktiven Sessions
  completedSessions: z.number(),   // Anzahl bisher durchgeführter Quizzes (Status == FINISHED)
  serverStatus: z.enum(['healthy', 'busy', 'overloaded']),
});

export type ServerStatsDTO = z.infer<typeof ServerStatsDTOSchema>;

// ---------------------------------------------------------------------------
// Quiz-Export / Import (Story 1.8, 1.9)
// ---------------------------------------------------------------------------

/** Aktuelle Export-Schema-Version */
export const QUIZ_EXPORT_VERSION = 1;

/** Schema für eine exportierte Antwortoption */
const ExportedAnswerOptionSchema = z.object({
  text: z.string(),
  isCorrect: z.boolean(),
});

/** Schema für eine exportierte Frage */
const ExportedQuestionSchema = z.object({
  text: z.string(),
  type: QuestionTypeEnum,
  timer: z.number().nullable().optional(),
  difficulty: DifficultyEnum,
  order: z.number(),
  answers: z.array(ExportedAnswerOptionSchema),
  ratingMin: z.number().nullable().optional(),           // Nur bei RATING
  ratingMax: z.number().nullable().optional(),           // Nur bei RATING
  ratingLabelMin: z.string().nullable().optional(),      // Nur bei RATING
  ratingLabelMax: z.string().nullable().optional(),      // Nur bei RATING
});

/** Schema für das gesamte Quiz-Export-Format */
export const QuizExportSchema = z.object({
  exportVersion: z.number().int().min(1),
  exportedAt: z.string(),         // ISO-8601 Timestamp
  quiz: z.object({
    name: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    showLeaderboard: z.boolean(),
    allowCustomNicknames: z.boolean(),
    defaultTimer: z.number().int().min(5).max(300).nullable().optional(),
    enableSoundEffects: z.boolean(),
    enableRewardEffects: z.boolean(),
    enableMotivationMessages: z.boolean(),
    enableEmojiReactions: z.boolean(),
    anonymousMode: z.boolean(),
    teamMode: z.boolean(),
    teamCount: z.number().int().min(2).max(8).nullable().optional(),
    teamAssignment: TeamAssignmentEnum.optional(),
    backgroundMusic: z.string().max(50).nullable().optional(),
    nicknameTheme: NicknameThemeEnum,
    bonusTokenCount: z.number().int().min(1).max(50).nullable().optional(), // Story 4.6
    readingPhaseEnabled: z.boolean().optional(), // Story 2.6: Lesephase
    questions: z.array(ExportedQuestionSchema).min(1),
  }),
});
export type QuizExport = z.infer<typeof QuizExportSchema>;

// ---------------------------------------------------------------------------
// Rating-Ergebnis (Story 1.2c)
// ---------------------------------------------------------------------------

/** DTO: Aggregiertes Rating-Ergebnis für eine Skala-Frage */
export const RatingResultDTOSchema = z.object({
  questionId: z.string().uuid(),
  ratingMin: z.number(),
  ratingMax: z.number(),
  ratingLabelMin: z.string().nullable(),
  ratingLabelMax: z.string().nullable(),
  distribution: z.record(z.string(), z.number()), // { "1": 5, "2": 12, ... }
  average: z.number(),
  standardDeviation: z.number(),
  totalVotes: z.number(),
});
export type RatingResultDTO = z.infer<typeof RatingResultDTOSchema>;

// ---------------------------------------------------------------------------
// Bonus-Token (Story 4.6)
// ---------------------------------------------------------------------------

/** DTO: Einzelner Bonus-Token-Eintrag in der Dozenten-Liste */
export const BonusTokenEntryDTOSchema = z.object({
  token: z.string(),               // z.B. "BNS-A3F7-K2M9"
  nickname: z.string(),            // Pseudonym (Snapshot)
  quizName: z.string(),            // Quiz-Name (Snapshot)
  totalScore: z.number(),          // Erreichte Gesamtpunktzahl
  rank: z.number(),                // Platzierung (1-basiert)
  generatedAt: z.string(),         // ISO-8601 Timestamp
});
export type BonusTokenEntryDTO = z.infer<typeof BonusTokenEntryDTOSchema>;

/** DTO: Vollständige Bonus-Token-Liste für den Dozenten */
export const BonusTokenListDTOSchema = z.object({
  sessionId: z.string().uuid(),
  sessionCode: z.string(),
  quizName: z.string(),
  tokens: z.array(BonusTokenEntryDTOSchema),
});
export type BonusTokenListDTO = z.infer<typeof BonusTokenListDTOSchema>;

// ---------------------------------------------------------------------------
// Q&A-Modus (Epic 8)
// ---------------------------------------------------------------------------

/** DTO: Eine Q&A-Frage */
export const QaQuestionDTOSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  upvoteCount: z.number(),
  status: QaQuestionStatusEnum,
  createdAt: z.string(),          // ISO-8601
  hasUpvoted: z.boolean(),        // Hat der aktuelle Student bereits gevotet?
});
export type QaQuestionDTO = z.infer<typeof QaQuestionDTOSchema>;

/** Input: Q&A-Frage einreichen (Story 8.2) */
export const SubmitQaQuestionInputSchema = z.object({
  sessionId: z.string().uuid(),
  text: z.string().min(1).max(500),
});
export type SubmitQaQuestionInput = z.infer<typeof SubmitQaQuestionInputSchema>;

/** Input: Q&A-Frage upvoten (Story 8.3) */
export const UpvoteQaQuestionInputSchema = z.object({
  questionId: z.string().uuid(),
});
export type UpvoteQaQuestionInput = z.infer<typeof UpvoteQaQuestionInputSchema>;

// ---------------------------------------------------------------------------
// SC-Schnellformate (Story 1.12) — clientseitig angewandt
// ---------------------------------------------------------------------------

/** Verfügbare Single-Choice-Schnellformate */
export const ScFormatEnum = z.enum([
  'YES_NO',
  'YES_NO_MAYBE',
  'YES_NO_DONT_KNOW',
  'TRUE_FALSE',
  'ABCD',
]);
export type ScFormat = z.infer<typeof ScFormatEnum>;

/** Vorkonfigurierte Antwortoptionen pro SC-Format (Texte werden bei i18n lokalisiert) */
export const SC_FORMAT_PRESETS: Record<ScFormat, { label: string; answers: string[] }> = {
  YES_NO:            { label: 'Ja / Nein',              answers: ['Ja', 'Nein'] },
  YES_NO_MAYBE:      { label: 'Ja / Nein / Vielleicht', answers: ['Ja', 'Nein', 'Vielleicht'] },
  YES_NO_DONT_KNOW:  { label: 'Ja / Nein / Weiß nicht', answers: ['Ja', 'Nein', 'Weiß nicht'] },
  TRUE_FALSE:        { label: 'Wahr / Falsch',          answers: ['Wahr', 'Falsch'] },
  ABCD:              { label: 'A / B / C / D',          answers: ['A', 'B', 'C', 'D'] },
};

/** Preset-Konfigurationen (Story 1.11) — clientseitig angewandt */
export const QUIZ_PRESETS: Record<QuizPreset, Partial<CreateQuizInput>> = {
  PLAYFUL: {
    showLeaderboard: true,
    enableSoundEffects: true,
    enableRewardEffects: true,
    enableMotivationMessages: true,
    enableEmojiReactions: true,
    anonymousMode: false,
    readingPhaseEnabled: false,    // Story 2.6: Schnelles Spieltempo
  },
  SERIOUS: {
    showLeaderboard: false,
    enableSoundEffects: false,
    enableRewardEffects: false,
    enableMotivationMessages: false,
    enableEmojiReactions: false,
    anonymousMode: true,
    defaultTimer: null,          // Offene Antwortphase (kein Countdown)
    readingPhaseEnabled: true,    // Story 2.6: Frage zuerst lesen
  },
};
