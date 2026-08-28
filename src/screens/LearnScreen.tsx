import { BookOpen, Award, Sparkles, ChevronRight, CheckCircle2, CircleDashed, PlayCircle } from 'lucide-react';
import type { StudyPlan, StudyPlanItem } from '@/types';

interface Props {
  plan: StudyPlan | null;
  satPlan: StudyPlan | null;
  diagnosticDone: boolean;
  satDiagnosticDone: boolean;
  onOpenTopic: (topicCode: string) => void;
  onGoHome: () => void;
}

function StatusIcon({ status }: { status: StudyPlanItem['status'] }) {
  if (status === 'done') return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  if (status === 'in_progress') return <PlayCircle className="h-5 w-5 text-accent-600" />;
  return <CircleDashed className="h-5 w-5 text-ink-300" />;
}

function PlanSection({
  title,
  icon: Icon,
  plan,
  onOpenTopic,
}: {
  title: string;
  icon: typeof BookOpen;
  plan: StudyPlan | null;
  onOpenTopic: (topicCode: string) => void;
}) {
  if (!plan) return null;
  const sorted = [...plan.items].sort((a, b) => a.order - b.order);

  return (
    <section className="mt-6">
      <div className="mb-2.5 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-600" />
        <p className="text-sm font-semibold text-ink-700">{title}</p>
      </div>
      <div className="space-y-3">
        {sorted.map((item, i) => (
          <button
            key={item.topicCode}
            onClick={() => onOpenTopic(item.topicCode)}
            className="card flex w-full items-start gap-3 text-left active:scale-[0.99]"
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-600">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-ink-900">{item.topic}</p>
                <StatusIcon status={item.status} />
              </div>
              <p className="text-xs text-ink-500">{item.subject} · {item.chapter}</p>
            </div>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-ink-300" />
          </button>
        ))}
      </div>
    </section>
  );
}

export default function LearnScreen({
  plan,
  satPlan,
  diagnosticDone,
  satDiagnosticDone,
  onOpenTopic,
  onGoHome,
}: Props) {
  const hasAnyPlan = !!plan || !!satPlan;
  const anyDiagnosticDone = diagnosticDone || satDiagnosticDone;

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-ink-900">Learn</h1>
      <p className="mt-1 text-sm text-ink-500">Everything in your study plans, in one place.</p>

      {!hasAnyPlan ? (
        <div className="mt-6 card">
          {anyDiagnosticDone ? (
            <>
              <p className="text-sm font-bold text-ink-900">Your plan isn't built yet</p>
              <p className="mt-1.5 text-sm text-ink-600">
                You've already completed a diagnostic — go to Home and tap "Build My Study Plan"
                (or "Build My SAT Plan") to see your personalized plan here.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-ink-900">No study plan yet</p>
              <p className="mt-1.5 text-sm text-ink-600">
                Take a diagnostic assessment from Home and StudyPilot will build a personalized
                plan you can browse here.
              </p>
            </>
          )}
          <button
            onClick={onGoHome}
            className="btn-primary mt-4 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-5 w-5" />
            Go to Home
          </button>
        </div>
      ) : (
        <>
          <PlanSection title="Study Plan" icon={BookOpen} plan={plan} onOpenTopic={onOpenTopic} />
          <PlanSection title="SAT Plan" icon={Award} plan={satPlan} onOpenTopic={onOpenTopic} />
        </>
      )}
    </div>
  );
}
