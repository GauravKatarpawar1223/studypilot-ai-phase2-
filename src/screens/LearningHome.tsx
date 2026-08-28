import {
  BookOpen,
  Clock,
  QrCode,
  TrendingUp,
  Play,
  ChevronRight,
  Sparkles,
  X,
  CheckCircle2,
  Circle,
  ListChecks,
  Pencil,
  Award,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { TOPIC_BANK, getTopicMeta, QUESTION_BANK } from '@/data/questionBank';
import type { AdaptiveNudge, DailyGoals, Language, StudentProfile, StudyPlan, TopicInfo } from '@/types';

interface Props {
  profile: StudentProfile;
  diagnosticDone: boolean;
  plan: StudyPlan | null;
  nudge: AdaptiveNudge | null;
  dailyGoals: DailyGoals | null;
  buildingPlan: boolean;
  onScan: () => void;
  onProgress: () => void;
  onTopic: (t: TopicInfo) => void;
  onStartDiagnostic: () => void;
  onBuildPlan: () => void;
  onViewPlan: () => void;
  onDismissNudge: () => void;
  // Phase 4: SAT prep runs as a parallel track alongside the general flow above.
  satDiagnosticDone: boolean;
  satPlan: StudyPlan | null;
  satNudge: AdaptiveNudge | null;
  buildingSatPlan: boolean;
  onStartSatDiagnostic: () => void;
  onBuildSatPlan: () => void;
  onViewSatPlan: () => void;
  onDismissSatNudge: () => void;
}

const GOAL_LABELS: Record<
  Language,
  { studyTopic: string; practice: string; weakTopic: string; session: string }
> = {
  English: {
    studyTopic: "Study today's topic",
    practice: 'Practice {n} questions',
    weakTopic: 'Work on a weak topic',
    session: "Finish today's session",
  },
  Hindi: {
    studyTopic: 'आज का विषय पढ़ें',
    practice: '{n} सवालों का अभ्यास करें',
    weakTopic: 'एक कमजोर विषय पर काम करें',
    session: 'आज का सत्र पूरा करें',
  },
  Marathi: {
    studyTopic: 'आजचा विषय अभ्यासा',
    practice: '{n} प्रश्नांचा सराव करा',
    weakTopic: 'एका कमकुवत विषयावर काम करा',
    session: 'आजचे सत्र पूर्ण करा',
  },
};

const GOALS_HEADING: Record<Language, string> = {
  English: "Today's Goals",
  Hindi: 'आज के लक्ष्य',
  Marathi: 'आजची उद्दिष्टे',
};

const PLAN_CHANGED_HEADING: Record<Language, string> = {
  English: 'Your plan changed',
  Hindi: 'आपकी योजना बदल गई',
  Marathi: 'तुमची योजना बदलली',
};

const WHAT_CHANGED_LABEL: Record<Language, string> = {
  English: 'What changed',
  Hindi: 'क्या बदला',
  Marathi: 'काय बदलले',
};

const WHY_LABEL: Record<Language, string> = { English: 'Why', Hindi: 'क्यों', Marathi: 'का' };
const NEXT_LABEL: Record<Language, string> = { English: 'Next', Hindi: 'आगे क्या', Marathi: 'पुढे काय' };

const SAT_LABELS: Record<
  Language,
  {
    heading: string;
    findHelp: string;
    findHelpDesc: string;
    startDiagnostic: string;
    readyTitle: string;
    readyDesc: string;
    buildPlan: string;
    buildingPlan: string;
    recommendedSkill: string;
    planComplete: string;
    planCompleteDesc: string;
    viewPlan: string;
  }
> = {
  English: {
    heading: 'SAT Prep',
    findHelp: 'Find your SAT strengths and weaknesses',
    findHelpDesc: 'Take a short SAT diagnostic across Math and Reading & Writing.',
    startDiagnostic: 'Start SAT Diagnostic',
    readyTitle: 'Your SAT diagnostic is ready',
    readyDesc: 'Build your personalized SAT study plan based on your results.',
    buildPlan: 'Build My SAT Plan',
    buildingPlan: 'Building Your SAT Plan…',
    recommendedSkill: "Today's recommended SAT skill",
    planComplete: 'SAT plan complete!',
    planCompleteDesc: "You've worked through every skill in your SAT plan.",
    viewPlan: 'View SAT Plan',
  },
  Hindi: {
    heading: 'SAT तैयारी',
    findHelp: 'अपनी SAT ताकत और कमजोरियां जानें',
    findHelpDesc: 'गणित और Reading & Writing में एक छोटा SAT डायग्नोस्टिक लें।',
    startDiagnostic: 'SAT डायग्नोस्टिक शुरू करें',
    readyTitle: 'आपका SAT डायग्नोस्टिक तैयार है',
    readyDesc: 'अपने परिणामों के आधार पर व्यक्तिगत SAT योजना बनाएं।',
    buildPlan: 'मेरी SAT योजना बनाएं',
    buildingPlan: 'आपकी SAT योजना बन रही है…',
    recommendedSkill: 'आज का अनुशंसित SAT कौशल',
    planComplete: 'SAT योजना पूरी हुई!',
    planCompleteDesc: 'आपने अपनी SAT योजना के हर कौशल पर काम कर लिया है।',
    viewPlan: 'SAT योजना देखें',
  },
  Marathi: {
    heading: 'SAT तयारी',
    findHelp: 'तुमची SAT ताकद आणि कमकुवतपणा शोधा',
    findHelpDesc: 'गणित आणि Reading & Writing मध्ये एक छोटी SAT डायग्नोस्टिक घ्या.',
    startDiagnostic: 'SAT डायग्नोस्टिक सुरू करा',
    readyTitle: 'तुमची SAT डायग्नोस्टिक तयार आहे',
    readyDesc: 'तुमच्या निकालांवर आधारित वैयक्तिक SAT योजना तयार करा.',
    buildPlan: 'माझी SAT योजना तयार करा',
    buildingPlan: 'तुमची SAT योजना तयार होत आहे…',
    recommendedSkill: 'आजचे शिफारस केलेले SAT कौशल्य',
    planComplete: 'SAT योजना पूर्ण झाली!',
    planCompleteDesc: 'तुम्ही तुमच्या SAT योजनेतील प्रत्येक कौशल्यावर काम केले आहे.',
    viewPlan: 'SAT योजना पहा',
  },
};

function GoalRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      {done ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-ink-300" />
      )}
      <span className={`text-sm ${done ? 'text-ink-400 line-through' : 'text-ink-700'}`}>{label}</span>
    </div>
  );
}

/** The proactive "agent took action" card: what changed, why, and what's next.
 * Used for both the general nudge and the SAT nudge — same shape, same UI. */
function PlanChangedCard({
  nudge,
  language,
  onDismiss,
}: {
  nudge: AdaptiveNudge;
  language: Language;
  onDismiss: () => void;
}) {
  return (
    <div className="rounded-2xl bg-accent-50 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-accent-600" />
          <p className="text-sm font-bold text-accent-700">{PLAN_CHANGED_HEADING[language]}</p>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 text-accent-500 active:bg-accent-100"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 space-y-2.5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-600">
            {WHAT_CHANGED_LABEL[language]}
          </p>
          <p className="text-sm text-accent-700">{nudge.whatChanged}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-600">
            {WHY_LABEL[language]}
          </p>
          <p className="text-sm text-accent-700">{nudge.why}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-600">
            {NEXT_LABEL[language]}
          </p>
          <p className="text-sm text-accent-700">{nudge.next}</p>
        </div>
      </div>
    </div>
  );
}

export default function LearningHome({
  profile,
  diagnosticDone,
  plan,
  nudge,
  dailyGoals,
  buildingPlan,
  onScan,
  onProgress,
  onTopic,
  onStartDiagnostic,
  onBuildPlan,
  onViewPlan,
  onDismissNudge,
  satDiagnosticDone,
  satPlan,
  satNudge,
  buildingSatPlan,
  onStartSatDiagnostic,
  onBuildSatPlan,
  onViewSatPlan,
  onDismissSatNudge,
}: Props) {
  const nextItem = plan?.items
    .filter((i) => i.status !== 'done')
    .sort((a, b) => a.order - b.order)[0];
  const nextTopic = nextItem ? TOPIC_BANK[nextItem.topicCode] : undefined;
  const nextTopicMeta = nextItem ? getTopicMeta(nextItem.topicCode) : undefined;
  const nextTopicQuestionCount = nextItem ? QUESTION_BANK[nextItem.topicCode]?.length ?? 0 : 0;

  const satNextItem = satPlan?.items
    .filter((i) => i.status !== 'done')
    .sort((a, b) => a.order - b.order)[0];
  const satNextTopic = satNextItem ? TOPIC_BANK[satNextItem.topicCode] : undefined;
  const satNextTopicMeta = satNextItem ? getTopicMeta(satNextItem.topicCode) : undefined;
  const satNextTopicQuestionCount = satNextItem
    ? QUESTION_BANK[satNextItem.topicCode]?.length ?? 0
    : 0;

  const labels = GOAL_LABELS[profile.language];
  const satLabels = SAT_LABELS[profile.language];

  return (
    <div className="px-5 pt-8 pb-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div>
            <p className="text-xs text-ink-500">Welcome back,</p>
            <p className="text-base font-bold text-ink-900">{profile.name}</p>
          </div>
        </div>
        <div className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
          {profile.language}
        </div>
      </header>

      <section className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">My Learning</p>
        <h1 className="mt-1 text-2xl font-bold text-ink-900">{profile.grade}</h1>
      </section>

      <section className="mt-5">
        <p className="mb-2.5 text-sm font-semibold text-ink-700">Subjects</p>
        <div className="flex flex-wrap gap-2">
          {profile.subjects.map((s) => (
            <span
              key={s}
              className="rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-ink-700 shadow-card"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {nudge && (
        <section className="mt-5">
          <PlanChangedCard nudge={nudge} language={profile.language} onDismiss={onDismissNudge} />
        </section>
      )}

      {satNudge && (
        <section className="mt-5">
          <PlanChangedCard nudge={satNudge} language={profile.language} onDismiss={onDismissSatNudge} />
        </section>
      )}

      {dailyGoals && (
        <section className="mt-5">
          <div className="card">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary-600" />
              <p className="text-sm font-semibold text-ink-800">{GOALS_HEADING[profile.language]}</p>
            </div>
            <div className="mt-2 divide-y divide-ink-100">
              <GoalRow label={labels.studyTopic} done={dailyGoals.topicStudied} />
              <GoalRow
                label={labels.practice.replace(
                  '{n}',
                  `${Math.min(dailyGoals.practiceCount, dailyGoals.practiceTarget)}/${dailyGoals.practiceTarget}`
                )}
                done={dailyGoals.practiceCount >= dailyGoals.practiceTarget}
              />
              <GoalRow label={labels.weakTopic} done={dailyGoals.weakTopicPracticed} />
              <GoalRow label={labels.session} done={dailyGoals.sessionCompleted} />
            </div>
          </div>
        </section>
      )}

      {!diagnosticDone ? (
        <section className="mt-5">
          <div className="card">
            <p className="text-sm font-bold text-ink-900">Find out where you need help</p>
            <p className="mt-1.5 text-sm text-ink-600">
              Take a short diagnostic assessment so StudyPilot can build a study plan just
              for you.
            </p>
            <button
              onClick={onStartDiagnostic}
              className="btn-primary mt-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Start Diagnostic
            </button>
          </div>
        </section>
      ) : !plan ? (
        <section className="mt-5">
          <div className="card">
            <p className="text-sm font-bold text-ink-900">Your diagnostic is ready</p>
            <p className="mt-1.5 text-sm text-ink-600">
              Build your personalized study plan based on your results.
            </p>
            <button
              onClick={onBuildPlan}
              disabled={buildingPlan}
              className="btn-primary mt-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              {buildingPlan ? 'Building Your Plan…' : 'Build My Study Plan'}
            </button>
          </div>
        </section>
      ) : (
        <section className="mt-5">
          <p className="mb-2.5 text-sm font-semibold text-ink-700">Today's recommended topic</p>
          {nextTopic ? (
            <button
              onClick={() => onTopic(nextTopic)}
              className="card flex w-full flex-col text-left active:scale-[0.99]"
            >
              <div className="flex w-full items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-primary-600 grid place-items-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink-900">{nextTopic.chapter}</p>
                  <p className="text-xs text-ink-500">{nextTopic.subject} · {nextTopic.grade}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-ink-300" />
              </div>
              {nextTopicMeta && (
                <div className="mt-3 flex items-center gap-4 border-t border-ink-100 pt-3 text-xs text-ink-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {nextTopicMeta.estimatedMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Pencil className="h-3.5 w-3.5" />
                    {nextTopicQuestionCount} questions
                  </span>
                </div>
              )}
            </button>
          ) : (
            <div className="card">
              <p className="text-sm font-semibold text-ink-900">Plan complete!</p>
              <p className="mt-1 text-xs text-ink-500">
                You've worked through every topic in your plan. Check Progress for details.
              </p>
            </div>
          )}
        </section>
      )}

      {/* --- Phase 4: SAT Prep, a parallel track alongside general subjects --- */}
      <section className="mt-5">
        <div className="mb-2.5 flex items-center gap-2">
          <Award className="h-4 w-4 text-primary-600" />
          <p className="text-sm font-semibold text-ink-700">{satLabels.heading}</p>
        </div>

        {!satDiagnosticDone ? (
          <div className="card">
            <p className="text-sm font-bold text-ink-900">{satLabels.findHelp}</p>
            <p className="mt-1.5 text-sm text-ink-600">{satLabels.findHelpDesc}</p>
            <button
              onClick={onStartSatDiagnostic}
              className="btn-secondary mt-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              {satLabels.startDiagnostic}
            </button>
          </div>
        ) : !satPlan ? (
          <div className="card">
            <p className="text-sm font-bold text-ink-900">{satLabels.readyTitle}</p>
            <p className="mt-1.5 text-sm text-ink-600">{satLabels.readyDesc}</p>
            <button
              onClick={onBuildSatPlan}
              disabled={buildingSatPlan}
              className="btn-secondary mt-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              {buildingSatPlan ? satLabels.buildingPlan : satLabels.buildPlan}
            </button>
          </div>
        ) : satNextTopic ? (
          <div>
            <p className="mb-2 text-xs font-medium text-ink-500">{satLabels.recommendedSkill}</p>
            <button
              onClick={() => onTopic(satNextTopic)}
              className="card flex w-full flex-col text-left active:scale-[0.99]"
            >
              <div className="flex w-full items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-accent-500 grid place-items-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink-900">{satNextTopic.topic}</p>
                  <p className="text-xs text-ink-500">{satNextTopic.subject} · {satNextTopic.chapter}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-ink-300" />
              </div>
              {satNextTopicMeta && (
                <div className="mt-3 flex items-center gap-4 border-t border-ink-100 pt-3 text-xs text-ink-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {satNextTopicMeta.estimatedMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Pencil className="h-3.5 w-3.5" />
                    {satNextTopicQuestionCount} questions
                  </span>
                </div>
              )}
            </button>
          </div>
        ) : (
          <div className="card">
            <p className="text-sm font-semibold text-ink-900">{satLabels.planComplete}</p>
            <p className="mt-1 text-xs text-ink-500">{satLabels.planCompleteDesc}</p>
          </div>
        )}
        {satPlan && (
          <button
            onClick={onViewSatPlan}
            className="btn-ghost mt-3 flex items-center justify-center gap-2"
          >
            <Award className="h-4 w-4" />
            {satLabels.viewPlan}
          </button>
        )}
      </section>

      <section className="mt-5">
        <p className="mb-2.5 text-sm font-semibold text-ink-700">Today's study time</p>
        <div className="card flex items-center gap-4">
          <div className="h-12 w-12 shrink-0 rounded-xl bg-accent-100 grid place-items-center">
            <Clock className="h-6 w-6 text-accent-600" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-ink-900">{profile.studyTime}</p>
            <p className="text-xs text-ink-500">Your daily goal</p>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        {plan && nextTopic && (
          <button
            onClick={() => onTopic(nextTopic)}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5 fill-current" />
            Start Session
          </button>
        )}
        {plan && (
          <button onClick={onViewPlan} className="btn-secondary flex items-center justify-center gap-2">
            <BookOpen className="h-5 w-5" />
            View Full Plan
          </button>
        )}
        <button onClick={onScan} className="btn-secondary flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          Scan QR / Learning Material
        </button>
        <button onClick={onProgress} className="btn-ghost flex items-center justify-center gap-2">
          <TrendingUp className="h-5 w-5" />
          My Progress
        </button>
      </section>
    </div>
  );
}
