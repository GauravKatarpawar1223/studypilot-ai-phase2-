import { ChevronLeft, Lightbulb, ListChecks, BookOpen, Info, Pencil } from 'lucide-react';
import { getLessonContent } from '@/data/lessonContent';
import type { Language, TopicInfo } from '@/types';

interface Props {
  topic: TopicInfo;
  language: Language;
  onBack: () => void;
  /** Opens the existing Practice flow for this exact topic — no separate practice system. */
  onPractice: () => void;
}

const SECTION_LABELS: Record<
  Language,
  {
    screenTitle: string;
    concept: string;
    keyPoints: string;
    example: string;
    commonMistake: string;
    practiceButton: string;
  }
> = {
  English: {
    screenTitle: 'Learn',
    concept: 'The Idea',
    keyPoints: 'Key Points',
    example: 'Example',
    commonMistake: 'Common Mistake',
    practiceButton: 'Practice this topic',
  },
  Hindi: {
    screenTitle: 'सीखें',
    concept: 'मुख्य विचार',
    keyPoints: 'मुख्य बिंदु',
    example: 'उदाहरण',
    commonMistake: 'सामान्य गलती',
    practiceButton: 'इस विषय का अभ्यास करें',
  },
  Marathi: {
    screenTitle: 'शिका',
    concept: 'मुख्य कल्पना',
    keyPoints: 'मुख्य मुद्दे',
    example: 'उदाहरण',
    commonMistake: 'सामान्य चूक',
    practiceButton: 'या विषयाचा सराव करा',
  },
};

export default function TopicLessonScreen({ topic, language, onBack, onPractice }: Props) {
  const lesson = getLessonContent(topic.code);
  const labels = SECTION_LABELS[language];

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
          <h1 className="text-lg font-bold text-ink-900">{labels.screenTitle}</h1>
          <p className="text-xs text-ink-500">{topic.topic}</p>
        </div>
      </header>

      <div className="mt-6 flex-1 space-y-4">
        <section className="card">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary-600" />
            <p className="text-sm font-semibold text-ink-800">{labels.concept}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{lesson.concept[language]}</p>
        </section>

        <section className="card">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary-600" />
            <p className="text-sm font-semibold text-ink-800">{labels.keyPoints}</p>
          </div>
          <ul className="mt-2 space-y-1.5">
            {lesson.keyPoints[language].map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary-600" />
            <p className="text-sm font-semibold text-ink-800">{labels.example}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{lesson.example[language]}</p>
        </section>

        <section className="rounded-2xl bg-accent-50 p-4">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-accent-600" />
            <p className="text-sm font-semibold text-accent-700">{labels.commonMistake}</p>
          </div>
          <p className="mt-2 text-sm text-accent-700">{lesson.commonMistake[language]}</p>
        </section>
      </div>

      <button onClick={onPractice} className="btn-primary mt-6 flex items-center justify-center gap-2">
        <Pencil className="h-5 w-5" />
        {labels.practiceButton}
      </button>
    </div>
  );
}
