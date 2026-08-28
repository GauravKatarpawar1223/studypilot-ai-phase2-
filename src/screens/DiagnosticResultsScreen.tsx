import { useState } from 'react';
import { ChevronLeft, TrendingDown, TrendingUp, Minus, Sparkles } from 'lucide-react';
import type { Language, MasteryStatus, TopicMastery } from '@/types';

interface Props {
  masteries: TopicMastery[];
  language: Language;
  title?: string;
  onBuildPlan: () => Promise<void>;
  onBack: () => void;
}

const INTRO_TEXT: Record<Language, string> = {
  English:
    "Here's what your diagnostic showed. StudyPilot will use this to build a plan focused on where you need it most.",
  Hindi:
    'यह आपके डायग्नोस्टिक का परिणाम है। StudyPilot इसका उपयोग आपके लिए सबसे ज़रूरी जगह पर केंद्रित योजना बनाने के लिए करेगा।',
  Marathi:
    'हा तुमच्या डायग्नोस्टिकचा निकाल आहे. StudyPilot याचा वापर तुम्हाला सर्वात जास्त गरज असलेल्या ठिकाणी लक्ष केंद्रित करणारी योजना तयार करण्यासाठी करेल.',
};

const GROUP_LABELS: Record<Language, Record<MasteryStatus, string>> = {
  English: {
    weak: 'Needs the most work',
    developing: "You're getting there",
    strong: 'Strong topics',
  },
  Hindi: {
    weak: 'सबसे ज़्यादा ध्यान चाहिए',
    developing: 'आप आगे बढ़ रहे हैं',
    strong: 'मजबूत विषय',
  },
  Marathi: {
    weak: 'सर्वात जास्त लक्ष हवे',
    developing: 'तुम्ही प्रगती करत आहात',
    strong: 'मजबूत विषय',
  },
};

const CTA_LABEL: Record<Language, string> = {
  English: 'Build My Study Plan',
  Hindi: 'मेरी योजना बनाएं',
  Marathi: 'माझी योजना तयार करा',
};

const CTA_LOADING_LABEL: Record<Language, string> = {
  English: 'Building Your Plan…',
  Hindi: 'आपकी योजना बन रही है…',
  Marathi: 'तुमची योजना तयार होत आहे…',
};

const GROUPS: { status: MasteryStatus; icon: typeof TrendingDown; tone: string }[] = [
  { status: 'weak', icon: TrendingDown, tone: 'text-red-600 bg-red-50' },
  { status: 'developing', icon: Minus, tone: 'text-accent-600 bg-accent-50' },
  { status: 'strong', icon: TrendingUp, tone: 'text-green-600 bg-green-50' },
];

export default function DiagnosticResultsScreen({
  masteries,
  language,
  title = 'Your Results',
  onBuildPlan,
  onBack,
}: Props) {
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

      <p className="mt-4 text-sm text-ink-600">{INTRO_TEXT[language]}</p>

      <div className="mt-6 flex-1 space-y-6">
        {GROUPS.map(({ status, icon: Icon, tone }) => {
          const topics = masteries.filter((m) => m.status === status);
          if (topics.length === 0) return null;
          return (
            <div key={status}>
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg grid place-items-center ${tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-ink-800">{GROUP_LABELS[language][status]}</p>
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
        {loading ? CTA_LOADING_LABEL[language] : CTA_LABEL[language]}
      </button>
    </div>
  );
}
