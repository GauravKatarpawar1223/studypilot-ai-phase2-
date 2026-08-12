import { ChevronLeft, BookOpen, Pencil, HelpCircle, CalendarCheck, BookMarked } from 'lucide-react';
import type { TopicInfo } from '@/types';

interface Props {
  topic: TopicInfo;
  onBack: () => void;
  onPractice: (mode: 'practice' | 'quiz') => void;
  onMakeStudyPlan: () => void;
}

export default function TopicDetails({ topic, onBack, onPractice, onMakeStudyPlan }: Props) {
  const actions = [
    {
      label: 'Learn',
      desc: 'Read the lesson for this topic',
      icon: BookOpen,
      onClick: () =>
        alert('Full lesson content is coming in a later phase of StudyPilot AI.'),
      soon: true,
    },
    {
      label: 'Practice',
      desc: 'Solve practice problems',
      icon: Pencil,
      onClick: () => onPractice('practice'),
      soon: false,
    },
    {
      label: 'Quiz Me',
      desc: 'Test yourself with quick questions',
      icon: HelpCircle,
      onClick: () => onPractice('quiz'),
      soon: false,
    },
    {
      label: 'Make Study Plan',
      desc: 'Build a plan around this topic',
      icon: CalendarCheck,
      onClick: onMakeStudyPlan,
      soon: false,
    },
  ] as const;

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
        <h1 className="text-xl font-bold text-ink-900">Topic Details</h1>
      </header>

      <div className="mt-6 card">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 shrink-0 rounded-xl bg-primary-600 grid place-items-center">
            <BookMarked className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold leading-snug text-ink-900">{topic.topic}</p>
            <p className="mt-1 text-sm text-ink-500">{topic.chapter}</p>
          </div>
        </div>

        <dl className="mt-5 divide-y divide-ink-100">
          <Row label="Subject" value={topic.subject} />
          <Row label="Class" value={topic.grade} />
          <Row label="Chapter" value={topic.chapter} />
          <Row label="Topic" value={topic.topic} />
          <Row label="Topic code" value={topic.code} />
        </dl>
      </div>

      <p className="mt-7 text-sm font-semibold text-ink-700">What would you like to do?</p>
      <div className="mt-3 space-y-3">
        {actions.map(({ label, desc, icon: Icon, onClick, soon }) => (
          <button
            key={label}
            onClick={onClick}
            className="card flex w-full items-center gap-4 text-left active:scale-[0.99]"
          >
            <div className="h-11 w-11 shrink-0 rounded-xl bg-primary-50 grid place-items-center">
              <Icon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-ink-900">{label}</p>
              <p className="text-xs text-ink-500">{desc}</p>
            </div>
            {soon && (
              <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                Soon
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="text-sm font-semibold text-ink-900 text-right">{value}</dd>
    </div>
  );
}
