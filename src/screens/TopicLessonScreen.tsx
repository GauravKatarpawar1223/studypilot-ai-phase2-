import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ListChecks,
  BookOpen,
  Info,
  Pencil,
  Sparkles,
  BookMarked,
} from 'lucide-react';
import { getLessonContent } from '@/data/lessonContent';
import { getTopicMeta } from '@/data/questionBank';
import { getResourcesForTopic } from '@/lib/resources';
import type { Language, LearningResource, TopicInfo } from '@/types';

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
    whatYoullLearn: string;
    concept: string;
    keyPoints: string;
    example: string;
    commonMistake: string;
    recap: string;
    resources: string;
    resourcesEmpty: string;
    resourcesError: string;
    practiceButton: string;
  }
> = {
  English: {
    screenTitle: 'Learn',
    whatYoullLearn: "What you'll learn",
    concept: 'The Idea',
    keyPoints: 'Key Points',
    example: 'Example',
    commonMistake: 'Common Mistake',
    recap: 'Quick Recap',
    resources: 'Resources',
    resourcesEmpty: "No extra resources for this topic yet — the lesson above covers everything you need.",
    resourcesError: "Couldn't check for resources right now. You can still continue with the lesson.",
    practiceButton: 'Practice this topic',
  },
  Hindi: {
    screenTitle: 'सीखें',
    whatYoullLearn: 'आप क्या सीखेंगे',
    concept: 'मुख्य विचार',
    keyPoints: 'मुख्य बिंदु',
    example: 'उदाहरण',
    commonMistake: 'सामान्य गलती',
    recap: 'त्वरित पुनरावृत्ति',
    resources: 'संसाधन',
    resourcesEmpty: 'इस विषय के लिए अभी कोई अतिरिक्त संसाधन नहीं है — ऊपर दिया गया पाठ ही काफी है।',
    resourcesError: 'अभी संसाधन जांचे नहीं जा सके। आप पाठ के साथ आगे बढ़ सकते हैं।',
    practiceButton: 'इस विषय का अभ्यास करें',
  },
  Marathi: {
    screenTitle: 'शिका',
    whatYoullLearn: 'तुम्ही काय शिकाल',
    concept: 'मुख्य कल्पना',
    keyPoints: 'मुख्य मुद्दे',
    example: 'उदाहरण',
    commonMistake: 'सामान्य चूक',
    recap: 'द्रुत उजळणी',
    resources: 'संसाधने',
    resourcesEmpty: 'या विषयासाठी सध्या अतिरिक्त संसाधने नाहीत — वरील धडा पुरेसा आहे.',
    resourcesError: 'सध्या संसाधने तपासता आली नाहीत. तुम्ही धड्यासोबत पुढे जाऊ शकता.',
    practiceButton: 'या विषयाचा सराव करा',
  },
};

/**
 * Loads resources for this exact topic through the Phase 3 foundation
 * (lib/resources.ts). Always resolves quickly since no live provider is
 * connected yet, but is written as a real async load — with loading/empty/
 * error states — so a future real provider drops in with no UI changes.
 * The lesson itself never depends on this: it renders immediately and
 * works fully even if this section stays empty or fails.
 */
function useTopicResources(topic: TopicInfo) {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    getResourcesForTopic(topic)
      .then((r) => {
        if (!cancelled) setResources(r);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [topic.code]);

  return { resources, loading, failed };
}

export default function TopicLessonScreen({ topic, language, onBack, onPractice }: Props) {
  const lesson = getLessonContent(topic.code);
  const meta = getTopicMeta(topic.code);
  const labels = SECTION_LABELS[language];
  const { resources, loading, failed } = useTopicResources(topic);

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
          <p className="text-xs text-ink-500">
            {topic.subject}
            {topic.board ? ` · ${topic.grade}` : ''} → {topic.chapter} → {topic.topic}
          </p>
        </div>
      </header>

      <div className="mt-6 flex-1 space-y-4">
        <section className="rounded-2xl bg-primary-50 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <p className="text-sm font-semibold text-primary-700">{labels.whatYoullLearn}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-primary-800">{meta.summary[language]}</p>
        </section>

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

        <section className="card">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-primary-600" />
            <p className="text-sm font-semibold text-ink-800">{labels.recap}</p>
          </div>
          <ul className="mt-2 space-y-1">
            {lesson.keyPoints[language].map((point, i) => (
              <li key={i} className="text-xs text-ink-500">
                {i + 1}. {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <div className="flex items-center gap-2">
            <BookMarked className="h-4 w-4 text-primary-600" />
            <p className="text-sm font-semibold text-ink-800">{labels.resources}</p>
          </div>
          {loading ? (
            <div className="mt-2 space-y-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-ink-100" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-ink-100" />
            </div>
          ) : failed ? (
            <div className="mt-2 flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
              <p className="text-sm text-ink-500">{labels.resourcesError}</p>
            </div>
          ) : resources.length === 0 ? (
            <p className="mt-2 text-sm text-ink-500">{labels.resourcesEmpty}</p>
          ) : (
            <div className="mt-2 space-y-2">
              {resources.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2.5 text-sm text-ink-700 active:bg-ink-50"
                >
                  <span className="truncate">{r.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />
                </a>
              ))}
            </div>
          )}
        </section>
      </div>

      <button onClick={onPractice} className="btn-primary mt-6 flex items-center justify-center gap-2">
        <Pencil className="h-5 w-5" />
        {labels.practiceButton}
      </button>
    </div>
  );
}
