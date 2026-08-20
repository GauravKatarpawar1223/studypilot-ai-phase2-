import { ChevronLeft, ChevronRight, CheckCircle2, CircleDashed, PlayCircle } from 'lucide-react';
import type { StudyPlan, StudyPlanItem } from '@/types';

interface Props {
  plan: StudyPlan;
  onOpenTopic: (topicCode: string) => void;
  onBack: () => void;
}

function StatusIcon({ status }: { status: StudyPlanItem['status'] }) {
  if (status === 'done') return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  if (status === 'in_progress') return <PlayCircle className="h-5 w-5 text-accent-600" />;
  return <CircleDashed className="h-5 w-5 text-ink-300" />;
}

export default function StudyPlanScreen({ plan, onOpenTopic, onBack }: Props) {
  const sorted = [...plan.items].sort((a, b) => a.order - b.order);

  return (
    <div className="flex min-h-full flex-col px-5 pt-8 pb-6">
      <header className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-600 active:bg-ink-100"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-ink-900">Your Study Plan</h1>
      </header>

      <p className="mt-3 text-xs font-medium text-ink-400">
        {plan.source === 'ai' ? 'Personalized by StudyPilot AI' : 'Personalized using StudyPilot’s built-in guide'}
      </p>

      <div className="mt-5 flex-1 space-y-3">
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
              <p className="mt-1.5 text-xs text-ink-600">{item.reason}</p>
            </div>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-ink-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
