import { useCallback, useState } from 'react';
import { scoreDiagnostic, applySessionToMasteries, mergeMasteries } from '@/lib/mastery';
import type {
  AdaptiveNudge,
  DailyGoals,
  DiagnosticAnswer,
  DiagnosticResult,
  PracticeSession,
  ProgressState,
  StudyPlan,
  StudyTime,
  TopicMastery,
} from '@/types';

const DIAGNOSTIC_KEY = 'studypilot_diagnostic_v1';
const PLAN_KEY = 'studypilot_plan_v1';
const PROGRESS_KEY = 'studypilot_progress_v1';
const NUDGE_KEY = 'studypilot_nudge_v1';
const DAILY_GOALS_KEY = 'studypilot_dailygoals_v1';
// Phase 4: SAT prep runs a parallel diagnostic/plan/nudge track so it never
// overwrites a student's general-subjects diagnostic/plan. Progress
// (masteries + sessions) stays shared — see mergeMasteries in lib/mastery.ts.
const SAT_DIAGNOSTIC_KEY = 'studypilot_sat_diagnostic_v1';
const SAT_PLAN_KEY = 'studypilot_sat_plan_v1';
const SAT_NUDGE_KEY = 'studypilot_sat_nudge_v1';

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

/** How many practice questions to target per day, scaled to the student's daily study time. */
function practiceTargetForStudyTime(studyTime: StudyTime): number {
  switch (studyTime) {
    case '15 min':
      return 3;
    case '30 min':
      return 5;
    case '60 min':
      return 8;
    case '90+ min':
      return 12;
    default:
      return 5;
  }
}

function freshDailyGoals(studyTime: StudyTime): DailyGoals {
  return {
    date: todayStr(),
    practiceTarget: practiceTargetForStudyTime(studyTime),
    practiceCount: 0,
    topicStudied: false,
    weakTopicPracticed: false,
    sessionCompleted: false,
  };
}

export function useStudyData(initialStudyTime: StudyTime | null = null) {
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
  const [dailyGoals, setDailyGoalsState] = useState<DailyGoals | null>(() => {
    const stored = readJSON(DAILY_GOALS_KEY, null as DailyGoals | null);
    if (!initialStudyTime) return stored;
    const today = todayStr();
    const target = practiceTargetForStudyTime(initialStudyTime);
    if (stored && stored.date === today && stored.practiceTarget === target) return stored;
    const fresh = freshDailyGoals(initialStudyTime);
    writeJSON(DAILY_GOALS_KEY, fresh);
    return fresh;
  });

  // --- Phase 4: SAT prep state (parallel to the general slots above) ---
  const [satDiagnostic, setSatDiagnosticState] = useState<DiagnosticResult | null>(() =>
    readJSON(SAT_DIAGNOSTIC_KEY, null as DiagnosticResult | null)
  );
  const [satPlan, setSatPlanState] = useState<StudyPlan | null>(() =>
    readJSON(SAT_PLAN_KEY, null as StudyPlan | null)
  );
  const [satNudge, setSatNudgeState] = useState<AdaptiveNudge | null>(() =>
    readJSON(SAT_NUDGE_KEY, null as AdaptiveNudge | null)
  );

  /** Shared implementation for both the general and SAT diagnostics: scores
   * the answers, then MERGES the resulting masteries into progress.masteries
   * (rather than replacing it), so the two diagnostics can coexist. */
  const recordDiagnosticInto = useCallback(
    (
      answers: DiagnosticAnswer[],
      setSlot: (r: DiagnosticResult) => void,
      slotKey: string
    ): TopicMastery[] => {
      const result: DiagnosticResult = { completedAt: Date.now(), answers };
      const freshMasteries = scoreDiagnostic(answers);

      setSlot(result);
      writeJSON(slotKey, result);

      setProgressState((prev) => {
        const masteries = mergeMasteries(prev.masteries, freshMasteries);
        const streak = bumpStreak(prev);
        const next: ProgressState = { ...prev, masteries, ...streak };
        writeJSON(PROGRESS_KEY, next);
        return next;
      });

      return freshMasteries;
    },
    []
  );

  const recordDiagnostic = useCallback(
    (answers: DiagnosticAnswer[]): TopicMastery[] =>
      recordDiagnosticInto(answers, setDiagnosticState, DIAGNOSTIC_KEY),
    [recordDiagnosticInto]
  );

  const recordSatDiagnostic = useCallback(
    (answers: DiagnosticAnswer[]): TopicMastery[] =>
      recordDiagnosticInto(answers, setSatDiagnosticState, SAT_DIAGNOSTIC_KEY),
    [recordDiagnosticInto]
  );

  const savePlan = useCallback((newPlan: StudyPlan) => {
    setPlanState(newPlan);
    writeJSON(PLAN_KEY, newPlan);
  }, []);

  const saveSatPlan = useCallback((newPlan: StudyPlan) => {
    setSatPlanState(newPlan);
    writeJSON(SAT_PLAN_KEY, newPlan);
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

  const saveSatNudge = useCallback((newNudge: AdaptiveNudge | null) => {
    setSatNudgeState(newNudge);
    writeJSON(SAT_NUDGE_KEY, newNudge);
  }, []);

  /**
   * Ensures today's daily goals exist and match the student's current study
   * time (rolling over to a fresh checklist if the date has changed since
   * they were last computed). Safe to call on every render — it only
   * updates state (and therefore only re-renders) when something actually
   * needs to change.
   */
  const ensureDailyGoals = useCallback((studyTime: StudyTime): DailyGoals => {
    const today = todayStr();
    const target = practiceTargetForStudyTime(studyTime);
    let result!: DailyGoals;
    setDailyGoalsState((prev) => {
      if (prev && prev.date === today && prev.practiceTarget === target) {
        result = prev;
        return prev;
      }
      const next = freshDailyGoals(studyTime);
      writeJSON(DAILY_GOALS_KEY, next);
      result = next;
      return next;
    });
    return result;
  }, []);

  const markTopicStudied = useCallback((studyTime: StudyTime) => {
    setDailyGoalsState((prev) => {
      const base = prev && prev.date === todayStr() ? prev : freshDailyGoals(studyTime);
      const next: DailyGoals = { ...base, topicStudied: true };
      writeJSON(DAILY_GOALS_KEY, next);
      return next;
    });
  }, []);

  const recordDailyPractice = useCallback(
    (studyTime: StudyTime, questionCount: number, wasWeakTopic: boolean) => {
      setDailyGoalsState((prev) => {
        const base = prev && prev.date === todayStr() ? prev : freshDailyGoals(studyTime);
        const next: DailyGoals = {
          ...base,
          practiceCount: base.practiceCount + questionCount,
          sessionCompleted: true,
          weakTopicPracticed: base.weakTopicPracticed || wasWeakTopic,
        };
        writeJSON(DAILY_GOALS_KEY, next);
        return next;
      });
    },
    []
  );

  const resetAll = useCallback(() => {
    setDiagnosticState(null);
    setPlanState(null);
    setProgressState(emptyProgress);
    setNudgeState(null);
    setDailyGoalsState(null);
    setSatDiagnosticState(null);
    setSatPlanState(null);
    setSatNudgeState(null);
    writeJSON(DIAGNOSTIC_KEY, null);
    writeJSON(PLAN_KEY, null);
    writeJSON(PROGRESS_KEY, null);
    writeJSON(NUDGE_KEY, null);
    writeJSON(DAILY_GOALS_KEY, null);
    writeJSON(SAT_DIAGNOSTIC_KEY, null);
    writeJSON(SAT_PLAN_KEY, null);
    writeJSON(SAT_NUDGE_KEY, null);
  }, []);

  return {
    diagnostic,
    plan,
    progress,
    nudge,
    dailyGoals,
    satDiagnostic,
    satPlan,
    satNudge,
    recordDiagnostic,
    recordSatDiagnostic,
    savePlan,
    saveSatPlan,
    recordPracticeSession,
    saveNudge,
    saveSatNudge,
    ensureDailyGoals,
    markTopicStudied,
    recordDailyPractice,
    resetAll,
  };
}
