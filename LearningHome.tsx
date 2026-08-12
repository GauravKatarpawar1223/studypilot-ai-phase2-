import { BookOpen, Clock, QrCode, TrendingUp, Play, ChevronRight, Sparkles, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { TOPIC_BANK } from '@/data/questionBank';
import type { AdaptiveNudge, StudentProfile, StudyPlan, TopicInfo } from '@/types';

interface Props {
  profile: StudentProfile;
  diagnosticDone: boolean;
  plan: StudyPlan | null;
  nudge: AdaptiveNudge | null;
  buildingPlan: boolean;
  onScan: () => void;
  onProgress: () => void;
  onTopic: (t: TopicInfo) => void;
  onStartDiagnostic: () => void;
  onBuildPlan: () => void;
  onViewPlan: () => void;
  onDismissNudge: () => void;
}

export default function LearningHome({
  profile,
  diagnosticDone,
  plan,
  nudge,
  buildingPlan,
  onScan,
  onProgress,
  onTopic,
  onStartDiagnostic,
  onBuildPlan,
  onViewPlan,
  onDismissNudge,
}: Props) {
  const nextItem = plan?.items
    .filter((i) => i.status !== 'done')
    .sort((a, b) => a.order - b.order)[0];
  const nextTopic = nextItem ? TOPIC_BANK[nextItem.topicCode] : undefined;

  return (
    <div className="px-5 pt-8 pb-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div>
            <p className="text-xs text-ink-500">Welcome back,</p>
            <p className="text-base font-bold text-ink-900">{profile.name}</p>
          </div>
        </div>
        <div className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
          {profile.language}
        </div>
      </header>

      <section className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">My Learning</p>
        <h1 className="mt-1 text-2xl font-bold text-ink-900">{profile.grade}</h1>
      </section>

      <section className="mt-5">
        <p className="mb-2.5 text-sm font-semibold text-ink-700">Subjects</p>
        <div className="flex flex-wrap gap-2">
          {profile.subjects.map((s) => (
            <span
              key={s}
              className="rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-ink-700 shadow-card"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {nudge && (
        <section className="mt-5">
          <div className="flex items-start gap-2.5 rounded-2xl bg-accent-50 p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
            <p className="flex-1 text-sm text-accent-700">{nudge.message}</p>
            <button
              onClick={onDismissNudge}
              className="shrink-0 rounded-lg p-1 text-accent-500 active:bg-accent-100"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {!diagnosticDone ? (
        <section className="mt-5">
          <div className="card">
            <p className="text-sm font-bold text-ink-900">Find out where you need help</p>
            <p className="mt-1.5 text-sm text-ink-600">
              Take a short diagnostic assessment so StudyPilot can build a study plan just
              for you.
            </p>
            <button
              onClick={onStartDiagnostic}
              className="btn-primary mt-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Start Diagnostic
            </button>
          </div>
        </section>
      ) : !plan ? (
        <section className="mt-5">
          <div className="card">
            <p className="text-sm font-bold text-ink-900">Your diagnostic is ready</p>
            <p className="mt-1.5 text-sm text-ink-600">
              Build your personalized study plan based on your results.
            </p>
            <button
              onClick={onBuildPlan}
              disabled={buildingPlan}
              className="btn-primary mt-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              {buildingPlan ? 'Building Your Plan…' : 'Build My Study Plan'}
            </button>
          </div>
        </section>
      ) : (
        <section className="mt-5">
          <p className="mb-2.5 text-sm font-semibold text-ink-700">Current topic</p>
          {nextTopic ? (
            <button
              onClick={() => onTopic(nextTopic)}
              className="card flex w-full items-center gap-4 text-left active:scale-[0.99]"
            >
              <div className="h-12 w-12 shrink-0 rounded-xl bg-primary-600 grid place-items-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink-900">{nextTopic.chapter}</p>
                <p className="text-xs text-ink-500">{nextTopic.subject} · {nextTopic.grade}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-ink-300" />
            </button>
          ) : (
            <div className="card">
              <p className="text-sm font-semibold text-ink-900">Plan complete!</p>
              <p className="mt-1 text-xs text-ink-500">
                You've worked through every topic in your plan. Check Progress for details.
              </p>
            </div>
          )}
        </section>
      )}

      <section className="mt-5">
        <p className="mb-2.5 text-sm font-semibold text-ink-700">Today's study time</p>
        <div className="card flex items-center gap-4">
          <div className="h-12 w-12 shrink-0 rounded-xl bg-accent-100 grid place-items-center">
            <Clock className="h-6 w-6 text-accent-600" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-ink-900">{profile.studyTime}</p>
            <p className="text-xs text-ink-500">Your daily goal</p>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        {plan && nextTopic && (
          <button
            onClick={() => onTopic(nextTopic)}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5 fill-current" />
            Start Session
          </button>
        )}
        {plan && (
          <button onClick={onViewPlan} className="btn-secondary flex items-center justify-center gap-2">
            <BookOpen className="h-5 w-5" />
            View Full Plan
          </button>
        )}
        <button onClick={onScan} className="btn-secondary flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          Scan QR / Learning Material
        </button>
        <button onClick={onProgress} className="btn-ghost flex items-center justify-center gap-2">
          <TrendingUp className="h-5 w-5" />
          My Progress
        </button>
      </section>
    </div>
  );
}
