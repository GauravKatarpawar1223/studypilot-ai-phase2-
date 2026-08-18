import { ChevronLeft, BookOpen, Pencil, HelpCircle, CalendarCheck, BookMarked, Clock, Sparkles } from 'lucide-react';
import { getTopicMeta, QUESTION_BANK } from '@/data/questionBank';
import type { Language, MasteryStatus, TopicInfo, TopicMastery } from '@/types';

interface Props {
  topic: TopicInfo;
  language: Language;
  /** The student's current mastery for this topic, if it's been diagnosed/practiced. */
  mastery?: TopicMastery;
  /** The study plan's stated reason for this topic, if it's part of the active plan. */
  planReason?: string;
  onBack: () => void;
  onPractice: (mode: 'practice' | 'quiz') => void;
  onMakeStudyPlan: () => void;
}

const STATUS_LABEL: Record<Language, Record<MasteryStatus, string>> = {
  English: { weak: 'Needs work', developing: 'Developing', strong: 'Strong' },
  Hindi: { weak: 'कमजोर', developing: 'विकासशील', strong: 'मजबूत' },
  Marathi: { weak: 'कमकुवत', developing: 'विकसनशील', strong: 'मजबूत' },
};

const NOT_ASSESSED_LABEL: Record<Language, string> = {
  English: 'Not yet assessed',
  Hindi: 'अभी तक मूल्यांकित नहीं',
  Marathi: 'अद्याप मूल्यांकन नाही',
};

const GENERIC_WHY: Record<Language, string> = {
  English: 'Take the diagnostic assessment from Home to get a recommendation tailored to you for this topic.',
  Hindi: 'इस विषय के लिए व्यक्तिगत सिफारिश पाने के लिए होम से डायग्नोस्टिक असेसमेंट लें।',
  Marathi: 'या विषयासाठी वैयक्तिक शिफारस मिळवण्यासाठी होम वरून डायग्नोस्टिक असेसमेंट घ्या.',
};

const NEXT_STEP: Record<Language, Record<MasteryStatus | 'unknown', string>> = {
  English: {
    weak: 'Start with Practice to build the basics, then try Quiz Me.',
    developing: 'Try Quiz Me to check how much you remember.',
    strong: 'A quick Quiz Me will help you stay sharp.',
    unknown: 'Practice a few questions to see where you stand.',
  },
  Hindi: {
    weak: 'आधार मजबूत करने के लिए Practice से शुरू करें, फिर Quiz Me आज़माएं।',
    developing: 'आपको कितना याद है यह जांचने के लिए Quiz Me आज़माएं।',
    strong: 'तेज़ बने रहने के लिए एक त्वरित Quiz Me मदद करेगा।',
    unknown: 'आप कहां खड़े हैं यह देखने के लिए कुछ सवालों का अभ्यास करें।',
  },
  Marathi: {
    weak: 'पाया मजबूत करण्यासाठी Practice ने सुरुवात करा, नंतर Quiz Me करून पहा.',
    developing: 'तुम्हाला किती लक्षात आहे हे तपासण्यासाठी Quiz Me करून पहा.',
    strong: 'तयारी टिकवण्यासाठी एक द्रुत Quiz Me मदत करेल.',
    unknown: 'तुम्ही कुठे आहात हे पाहण्यासाठी काही प्रश्नांचा सराव करा.',
  },
};

const STATUS_BADGE_CLASSES: Record<MasteryStatus, string> = {
  weak: 'bg-red-50 text-red-600',
  developing: 'bg-accent-50 text-accent-600',
  strong: 'bg-green-50 text-green-600',
};

export default function TopicDetails({
  topic,
  language,
  mastery,
  planReason,
  onBack,
  onPractice,
  onMakeStudyPlan,
}: Props) {
  const meta = getTopicMeta(topic.code);
  const questionCount = QUESTION_BANK[topic.code]?.length ?? 0;
  const nextStep = NEXT_STEP[language][mastery?.status ?? 'unknown'];
  const why = planReason ?? GENERIC_WHY[language];

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

      <div className="mt-4 card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-700">Why this topic</p>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              mastery ? STATUS_BADGE_CLASSES[mastery.status] : 'bg-ink-100 text-ink-500'
            }`}
          >
            {mastery ? STATUS_LABEL[language][mastery.status] : NOT_ASSESSED_LABEL[language]}
          </span>
        </div>
        <p className="mt-2 text-sm text-ink-600">{why}</p>
        <p className="mt-3 text-sm text-ink-600">{meta.summary[language]}</p>

        <div className="mt-3 flex items-center gap-4 text-xs text-ink-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {meta.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Pencil className="h-3.5 w-3.5" />
            {questionCount} questions
          </span>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-accent-50 p-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
          <p className="text-sm text-accent-700">{nextStep}</p>
        </div>
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
