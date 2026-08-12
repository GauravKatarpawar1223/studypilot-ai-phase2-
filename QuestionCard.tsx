import { Check, X } from 'lucide-react';

interface Props {
  question: string;
  options: readonly [string, string, string, string];
  selectedIndex: number | null;
  correctIndex: number | null;
  revealed: boolean;
  onSelect: (index: number) => void;
}

export default function QuestionCard({
  question,
  options,
  selectedIndex,
  correctIndex,
  revealed,
  onSelect,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold leading-snug text-ink-900">{question}</h2>
      <div className="mt-6 space-y-3">
        {options.map((opt, i) => {
          const isSelected = selectedIndex === i;
          const isCorrect = revealed && correctIndex === i;
          const isWrongSelected = revealed && isSelected && correctIndex !== i;

          let stateClasses = 'border-ink-200 bg-white text-ink-700';
          if (isSelected && !revealed) stateClasses = 'border-primary-600 bg-primary-50 text-primary-700';
          if (isCorrect) stateClasses = 'border-green-600 bg-green-50 text-green-700';
          if (isWrongSelected) stateClasses = 'border-red-500 bg-red-50 text-red-700';

          return (
            <button
              key={i}
              onClick={() => !revealed && onSelect(i)}
              disabled={revealed}
              className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left text-base font-medium transition active:scale-[0.98] disabled:active:scale-100 ${stateClasses}`}
            >
              <span>{opt}</span>
              {isCorrect && <Check className="h-5 w-5 shrink-0 text-green-600" />}
              {isWrongSelected && <X className="h-5 w-5 shrink-0 text-red-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
