import { useState } from 'react';
import { ChevronLeft, TrendingDown, TrendingUp, Minus, Sparkles } from 'lucide-react';
import type { TopicMastery } from '@/types';

interface Props {
  masteries: TopicMastery[];
  title?: string;
  onBuildPlan: () => Promise<void>;
  onBack: () => void;
}

const GROUPS: { status: TopicMastery['status']; label: string; icon: typeof TrendingDown; tone: string }[] = [
  { status: 'weak', label: 'Needs the most work', icon: TrendingDown, tone: 'text-red-600 bg-red-50' },
  { status: 'developing', label: "You're getting there", icon: Minus, tone: 'text-accent-600 bg-accent-50' },
  { status: 'strong', label: 'Strong topics', icon: TrendingUp, tone: 'text-green-600 bg-green-50' },
];

export default function DiagnosticResultsScreen({ masteries, title = 'Your Results', onBuildPlan, onBack }: Props) {
  const [loading, setLoading] = useState(false);

  const handleBuildPlan = async () => {
    setLoading(true);
    try {
      await onBuildPlan();
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-xl font-bold text-ink-900">{title}</h1>
      </header>

      <p className="mt-4 text-sm text-ink-600">
        Here's what your diagnostic showed. StudyPilot will use this to build a plan
        focused on where you need it most.
      </p>

      <div className="mt-6 flex-1 space-y-6">
        {GROUPS.map(({ status, label, icon: Icon, tone }) => {
          const topics = masteries.filter((m) => m.status === status);
          if (topics.length === 0) return null;
          return (
            <div key={status}>
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg grid place-items-center ${tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-ink-800">{label}</p>
              </div>
              <div className="mt-2.5 space-y-2">
                {topics.map((t) => (
                  <div key={t.topicCode} className="card flex items-center justify-between py-3.5">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{t.topic}</p>
                      <p className="text-xs text-ink-500">{t.subject} · {t.chapter}</p>
                    </div>
                    <span className="text-sm font-bold text-ink-700">{t.scorePct}%</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleBuildPlan}
        disabled={loading}
        className="btn-primary mt-6 flex items-center justify-center gap-2"
      >
        <Sparkles className="h-5 w-5" />
        {loading ? 'Building Your Plan…' : 'Build My Study Plan'}
      </button>
    </div>
  );
}
