import { useMemo, useState } from 'react';
import { ChevronLeft, Trophy, Target } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';
import { QUESTION_BANK, TOPIC_BANK } from '@/data/questionBank';
import type { DiagnosticAnswer, Language, PracticeSession, SkillDifficulty } from '@/types';

interface Props {
  topicCode: string;
  mode: 'practice' | 'quiz';
  language: Language;
  /** Deterministic recommendation (from lib/mastery.ts's recommendedDifficulty)
   * based on current mastery. When set, questions matching this difficulty
   * are surfaced first. Purely a local re-ordering — never depends on the
   * AI endpoint, so it always works. */
  recommendedDifficulty?: SkillDifficulty;
  onComplete: (session: PracticeSession) => void;
  onBack: () => void;
}

const DIFFICULTY_LABEL: Record<Language, Record<SkillDifficulty, string>> = {
  English: { easy: 'Easier', medium: 'Standard', hard: 'Harder' },
  Hindi: { easy: 'आसान', medium: 'सामान्य', hard: 'कठिन' },
  Marathi: { easy: 'सोपे', medium: 'सर्वसाधारण', hard: 'अवघड' },
};

export default function PracticeScreen({
  topicCode,
  mode,
  language,
  recommendedDifficulty,
  onComplete,
  onBack,
}: Props) {
  const topicInfo = TOPIC_BANK[topicCode];

  const questions = useMemo(() => {
    const bank = QUESTION_BANK[topicCode] ?? [];
    if (!recommendedDifficulty) return bank;
    // Stable partition: matching-difficulty questions first, rest keep their order.
    return [...bank].sort((a, b) => {
      const aMatch = a.difficulty === recommendedDifficulty ? 0 : 1;
      const bMatch = b.difficulty === recommendedDifficulty ? 0 : 1;
      return aMatch - bMatch;
    });
  }, [topicCode, recommendedDifficulty]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const title = mode === 'quiz' ? 'Quiz Me' : 'Practice';

  const handleSelect = (i: number) => {
    setSelected(i);
    setRevealed(true);
  };

  const handleNext = () => {
    if (selected === null || !q) return;
    const answer: DiagnosticAnswer = {
      questionId: q.id,
      topicCode: q.topicCode,
      selectedIndex: selected,
      correct: selected === q.correctIndex,
    };
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    setSelected(null);
    setRevealed(false);

    if (isLast) {
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
  };

  const correctCount = answers.filter((a) => a.correct).length;
  const scorePct = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

  const handleFinish = () => {
    const session: PracticeSession = {
      id: `${topicCode}-${Date.now()}`,
      topicCode,
      mode,
      answers,
      scorePct,
      completedAt: Date.now(),
    };
    onComplete(session);
  };

  if (finished) {
    return (
      <div className="flex min-h-full flex-col items-center px-5 pt-16 pb-6 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-50">
          <Trophy className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-ink-900">
          {correctCount}/{questions.length} Correct
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {topicInfo?.topic ?? 'This topic'} · {scorePct}% score
        </p>
        <p className="mt-6 text-sm text-ink-600">
          {scorePct >= 80
            ? "Great job! You're mastering this topic."
            : scorePct >= 50
            ? "Good progress — a bit more practice will help."
            : "That's okay — this topic needs more focus. It's staying in your plan."}
        </p>
        <button onClick={handleFinish} className="btn-primary mt-auto w-full">
          Done
        </button>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-5 text-center">
        <p className="text-ink-600">No practice questions are available for this topic yet.</p>
        <button onClick={onBack} className="btn-secondary mt-6">
          Go Back
        </button>
      </div>
    );
  }

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
        <div className="flex-1">
          <h1 className="text-lg font-bold text-ink-900">{title}</h1>
          <p className="text-xs text-ink-500">
            {topicInfo?.topic} · Question {index + 1} of {questions.length}
          </p>
        </div>
        {recommendedDifficulty && (
          <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">
            <Target className="h-3 w-3" />
            {DIFFICULTY_LABEL[language][recommendedDifficulty]}
          </span>
        )}
      </header>

      <div className="mt-4 flex gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition ${
              i <= index ? 'bg-primary-600' : 'bg-ink-200'
            }`}
          />
        ))}
      </div>

      <div className="mt-8 flex-1">
        <QuestionCard
          question={q.question}
          options={q.options}
          selectedIndex={selected}
          correctIndex={revealed ? q.correctIndex : null}
          revealed={revealed}
          onSelect={handleSelect}
          explanation={q.explanation[language]}
        />
      </div>

      <button onClick={handleNext} disabled={selected === null} className="btn-primary mt-6">
        {isLast ? 'Finish' : 'Next Question'}
      </button>
    </div>
  );
}
