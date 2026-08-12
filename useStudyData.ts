import { useCallback, useState } from 'react';
import { scoreDiagnostic, applySessionToMasteries } from '@/lib/mastery';
import type {
  AdaptiveNudge,
  DiagnosticAnswer,
  DiagnosticResult,
  PracticeSession,
  ProgressState,
  StudyPlan,
  TopicMastery,
} from '@/types';

const DIAGNOSTIC_KEY = 'studypilot_diagnostic_v1';
const PLAN_KEY = 'studypilot_plan_v1';
const PROGRESS_KEY = 'studypilot_progress_v1';
const NUDGE_KEY = 'studypilot_nudge_v1';

const emptyProgress: ProgressState = {
  masteries: [],
  sessions: [],
  streakDays: 0,
  lastActiveDate: null,
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T | null): void {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    /* storage may be unavailable; ignore */
  }
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function isYesterday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10);
}

function bumpStreak(progress: ProgressState): Pick<ProgressState, 'streakDays' | 'lastActiveDate'> {
  const today = todayStr();
  if (progress.lastActiveDate === today) {
    return { streakDays: progress.streakDays, lastActiveDate: today };
  }
  if (progress.lastActiveDate && isYesterday(progress.lastActiveDate)) {
    return { streakDays: progress.streakDays + 1, lastActiveDate: today };
  }
  return { streakDays: 1, lastActiveDate: today };
}

export function useStudyData() {
  const [diagnostic, setDiagnosticState] = useState<DiagnosticResult | null>(() =>
    readJSON(DIAGNOSTIC_KEY, null as DiagnosticResult | null)
  );
  const [plan, setPlanState] = useState<StudyPlan | null>(() =>
    readJSON(PLAN_KEY, null as StudyPlan | null)
  );
  const [progress, setProgressState] = useState<ProgressState>(() =>
    readJSON(PROGRESS_KEY, emptyProgress)
  );
  const [nudge, setNudgeState] = useState<AdaptiveNudge | null>(() =>
    readJSON(NUDGE_KEY, null as AdaptiveNudge | null)
  );

  const recordDiagnostic = useCallback((answers: DiagnosticAnswer[]): TopicMastery[] => {
    const result: DiagnosticResult = { completedAt: Date.now(), answers };
    const masteries = scoreDiagnostic(answers);

    setDiagnosticState(result);
    writeJSON(DIAGNOSTIC_KEY, result);

    setProgressState((prev) => {
      const streak = bumpStreak(prev);
      const next: ProgressState = { ...prev, masteries, ...streak };
      writeJSON(PROGRESS_KEY, next);
      return next;
    });

    return masteries;
  }, []);

  const savePlan = useCallback((newPlan: StudyPlan) => {
    setPlanState(newPlan);
    writeJSON(PLAN_KEY, newPlan);
  }, []);

  const recordPracticeSession = useCallback((session: PracticeSession): ProgressState => {
    let nextProgress: ProgressState = progress;
    setProgressState((prev) => {
      const masteries = applySessionToMasteries(prev.masteries, session);
      const sessions = [...prev.sessions, session];
      const streak = bumpStreak(prev);
      nextProgress = { masteries, sessions, ...streak };
      writeJSON(PROGRESS_KEY, nextProgress);
      return nextProgress;
    });
    return nextProgress;
  }, [progress]);

  const saveNudge = useCallback((newNudge: AdaptiveNudge | null) => {
    setNudgeState(newNudge);
    writeJSON(NUDGE_KEY, newNudge);
  }, []);

  const resetAll = useCallback(() => {
    setDiagnosticState(null);
    setPlanState(null);
    setProgressState(emptyProgress);
    setNudgeState(null);
    writeJSON(DIAGNOSTIC_KEY, null);
    writeJSON(PLAN_KEY, null);
    writeJSON(PROGRESS_KEY, null);
    writeJSON(NUDGE_KEY, null);
  }, []);

  return {
    diagnostic,
    plan,
    progress,
    nudge,
    recordDiagnostic,
    savePlan,
    recordPracticeSession,
    saveNudge,
    resetAll,
  };
}
