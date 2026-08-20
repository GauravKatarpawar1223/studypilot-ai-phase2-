import { useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';
import { getDiagnosticQuestions, getSatDiagnosticQuestions } from '@/data/questionBank';
import type { DiagnosticAnswer, Language } from '@/types';

interface Props {
  subjects: string[];
  language: Language;
  /** 'sat' pulls the SAT skill bank regardless of `subjects`; 'subjects' (default) is the Phase 2/3 behavior. */
  mode?: 'subjects' | 'sat';
  title?: string;
  onComplete: (answers: DiagnosticAnswer[]) => void;
  onBack: () => void;
}

export default function DiagnosticScreen({
  subjects,
  language,
  mode = 'subjects',
  title = 'Diagnostic Assessment',
  onComplete,
  onBack,
}: Props) {
  const questions = useMemo(
    () => (mode === 'sat' ? getSatDiagnosticQuestions() : getDiagnosticQuestions(subjects)),
    [mode, subjects]
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const q = questions[index];
  const isLast = index === questions.length - 1;

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
      onComplete(nextAnswers);
    } else {
      setIndex(index + 1);
    }
  };

  if (!q) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-5 text-center">
        <p className="text-ink-600">No diagnostic questions are available yet.</p>
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
        <div>
          <h1 className="text-lg font-bold text-ink-900">{title}</h1>
          <p className="text-xs text-ink-500">
            Question {index + 1} of {questions.length}
          </p>
        </div>
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

      <button
        onClick={handleNext}
        disabled={selected === null}
        className="btn-primary mt-6"
      >
        {isLast ? 'See My Results' : 'Next Question'}
      </button>
    </div>
  );
}
