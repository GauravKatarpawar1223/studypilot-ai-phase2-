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
  message: string;
  generatedAt: number;
  source: PlanSource;
}
