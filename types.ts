export type Language = 'English' | 'Hindi' | 'Marathi';

export type StudyTime = '15 min' | '30 min' | '60 min' | '90+ min';

export interface StudentProfile {
  name: string;
  grade: string;
  subjects: string[];
  language: Language;
  studyTime: StudyTime;
  createdAt: number;
}

export interface TopicInfo {
  subject: string;
  grade: string;
  chapter: string;
  topic: string;
  code: string;
}

/* ---------------------------------------------------------------------- */
/* Phase 2: Diagnostic, Study Plan, Practice, Progress                    */
/* ---------------------------------------------------------------------- */

export type MasteryStatus = 'weak' | 'developing' | 'strong';

export type SkillDifficulty = 'easy' | 'medium' | 'hard';

export interface DiagnosticAnswer {
  questionId: string;
  topicCode: string;
  selectedIndex: number;
  correct: boolean;
}

export interface DiagnosticResult {
  completedAt: number;
  answers: DiagnosticAnswer[];
}

export interface TopicMastery {
  topicCode: string;
  subject: string;
  topic: string;
  chapter: string;
  status: MasteryStatus;
  scorePct: number;
  /** The score recorded the first time this topic was diagnosed. Never
   * overwritten by later practice — used to show "before vs after" progress.
   * Undefined if this mastery record was created from a practice session
   * without a prior diagnostic (e.g. a scanned topic practiced directly). */
  diagnosticScorePct?: number;
  attempts: number;
  lastPracticedAt?: number;
}

export type PlanItemStatus = 'pending' | 'in_progress' | 'done';

export interface StudyPlanItem {
  topicCode: string;
  subject: string;
  topic: string;
  chapter: string;
  reason: string;
  order: number;
  status: PlanItemStatus;
}

export type PlanSource = 'ai' | 'fallback';

export interface StudyPlan {
  generatedAt: number;
  language: Language;
  items: StudyPlanItem[];
  source: PlanSource;
}

export interface PracticeSession {
  id: string;
  topicCode: string;
  mode: 'practice' | 'quiz';
  answers: DiagnosticAnswer[];
  scorePct: number;
  completedAt: number;
}

export interface ProgressState {
  masteries: TopicMastery[];
  sessions: PracticeSession[];
  streakDays: number;
  lastActiveDate: string | null;
}

export interface AdaptiveNudge {
  /** Short one-line summary, kept for simple/compact display. */
  message: string;
  /** What the agent changed in the plan. */
  whatChanged: string;
  /** Why it made that change, grounded in the student's actual performance. */
  why: string;
  /** The concrete next action the agent recommends. */
  next: string;
  generatedAt: number;
  source: PlanSource;
}

/* ---------------------------------------------------------------------- */
/* Phase 3: Action — daily goals                                          */
/* ---------------------------------------------------------------------- */

export interface DailyGoals {
  date: string; // YYYY-MM-DD, local date this goal set applies to
  practiceTarget: number; // # of practice questions targeted today
  practiceCount: number; // # of practice questions answered today
  topicStudied: boolean; // opened at least one topic's details today
  weakTopicPracticed: boolean; // completed a practice session on a topic that was 'weak' today
  sessionCompleted: boolean; // completed at least one practice session today
}

/* ---------------------------------------------------------------------- */
/* Phase 4: SAT prep mode                                                 */
/* ---------------------------------------------------------------------- */

/**
 * SAT prep reuses every Phase 2/3 type above (TopicMastery, StudyPlan,
 * PracticeSession, AdaptiveNudge, ...) — an SAT skill is just a TopicInfo
 * whose `subject` is one of SAT_SUBJECTS (see data/questionBank.ts). No new
 * scoring, persistence, or plan model is introduced; SAT prep simply adds a
 * second, parallel diagnostic/plan/nudge "slot" in useStudyData so a
 * student can run SAT prep alongside their general subjects without one
 * overwriting the other. Progress (masteries + sessions) is shared and
 * filtered by subject prefix for SAT-specific views.
 */
export type LearningScope = 'general' | 'sat';
