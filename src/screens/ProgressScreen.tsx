import { TrendingUp, Clock, Target, Award, Sparkles, BarChart3, type LucideIcon } from 'lucide-react';
import { TOPIC_BANK, isSatSubject } from '@/data/questionBank';
import type { ProgressState, StudentProfile, TopicMastery } from '@/types';

interface Props {
  profile: StudentProfile;
  progress: ProgressState;
  onStartDiagnostic: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  weak: 'Needs work',
  developing: 'Developing',
  strong: 'Strong',
};

const STATUS_COLOR: Record<string, string> = {
  weak: 'bg-red-500',
  developing: 'bg-accent-500',
  strong: 'bg-green-500',
};

function average(scores: number[]): number {
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
}

/** A single topic/skill's mastery bar, with a "before vs after" line shown
 * only once genuine practice data exists beyond the initial diagnostic. */
function MasteryRow({ mastery }: { mastery: TopicMastery }) {
  const hasBaseline = mastery.diagnosticScorePct !== undefined && mastery.attempts > 1;
  const delta = hasBaseline ? mastery.scorePct - (mastery.diagnosticScorePct as number) : 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-700">{mastery.topic}</span>
        <span className="text-xs font-medium text-ink-400">
          {STATUS_LABEL[mastery.status]} · {mastery.scorePct}%
        </span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-ink-100">
        <div
          className={`h-2 rounded-full ${STATUS_COLOR[mastery.status]}`}
          style={{ width: `${mastery.scorePct}%` }}
        />
      </div>
      {hasBaseline && (
        <p className="mt-1 text-[11px] text-ink-400">
          Before: {mastery.diagnosticScorePct}% → Now: {mastery.scorePct}%{' '}
          <span className={delta >= 0 ? 'font-semibold text-green-600' : 'font-semibold text-red-500'}>
            {delta >= 0 ? '+' : ''}
            {delta}%
          </span>
        </p>
      )}
    </div>
  );
}

export default function ProgressScreen({ profile, progress, onStartDiagnostic }: Props) {
  const generalMasteries = progress.masteries.filter((m) => !isSatSubject(m.subject));
  const hasDiagnostic = generalMasteries.length > 0;
  const topicsMastered = generalMasteries.filter((m) => m.status === 'strong').length;
  const totalQuestions = progress.sessions.reduce((sum, s) => sum + s.answers.length, 0);
  const totalCorrect = progress.sessions.reduce(
    (sum, s) => sum + s.answers.filter((a) => a.correct).length,
    0
  );

  // --- Phase 4: SAT-specific progress, derived from the same shared progress state ---
  const satMasteries = progress.masteries.filter((m) => isSatSubject(m.subject));
  const hasSatData = satMasteries.length > 0;
  const satMathMasteries = satMasteries.filter((m) => m.subject === 'SAT Math');
  const satRwMasteries = satMasteries.filter((m) => m.subject === 'SAT Reading & Writing');
  const satOverallMastery = average(satMasteries.map((m) => m.scorePct));
  const satMathMastery = average(satMathMasteries.map((m) => m.scorePct));
  const satRwMastery = average(satRwMasteries.map((m) => m.scorePct));

  const satSessions = progress.sessions.filter((s) =>
    isSatSubject(TOPIC_BANK[s.topicCode]?.subject ?? '')
  );
  const satQuestionsAttempted = satSessions.reduce((sum, s) => sum + s.answers.length, 0);
  const satQuestionsCorrect = satSessions.reduce(
    (sum, s) => sum + s.answers.filter((a) => a.correct).length,
    0
  );
  const satAccuracy =
    satQuestionsAttempted > 0 ? Math.round((satQuestionsCorrect / satQuestionsAttempted) * 100) : 0;

  const satWithBaseline = satMasteries.filter((m) => m.diagnosticScorePct !== undefined);
  const satImprovement =
    satWithBaseline.length > 0
      ? Math.round(
          satWithBaseline.reduce(
            (sum, m) => sum + (m.scorePct - (m.diagnosticScorePct as number)),
            0
          ) / satWithBaseline.length
        )
      : 0;

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-ink-900">My Progress</h1>
      <p className="mt-1 text-sm text-ink-500">Hi {profile.name}, here's your learning overview.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard icon={Clock} label="Daily goal" value={profile.studyTime} tone="accent" />
        <StatCard icon={Target} label="Subjects" value={`${profile.subjects.length}`} tone="primary" />
        <StatCard icon={Award} label="Topics mastered" value={hasDiagnostic ? `${topicsMastered}` : '—'} tone="primary" />
        <StatCard icon={TrendingUp} label="Day streak" value={`${progress.streakDays}`} tone="accent" />
      </div>

      <div className="mt-6 card">
        <p className="text-sm font-semibold text-ink-900">Topic mastery</p>
        {hasDiagnostic ? (
          <div className="mt-4 space-y-3">
            {generalMasteries.map((m) => (
              <MasteryRow key={m.topicCode} mastery={m} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-500">
            Take your diagnostic assessment to see per-topic mastery here.
          </p>
        )}
      </div>

      <div className="mt-6 card">
        <p className="text-sm font-semibold text-ink-900">Practice activity</p>
        {progress.sessions.length === 0 ? (
          <p className="mt-1 text-xs text-ink-500">No practice sessions yet.</p>
        ) : (
          <>
            <p className="mt-1 text-xs text-ink-500">
              {progress.sessions.length} practice session{progress.sessions.length > 1 ? 's' : ''} so far.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-ink-50 py-3">
                <p className="text-lg font-bold text-ink-900">{totalQuestions}</p>
                <p className="text-xs text-ink-500">Questions attempted</p>
              </div>
              <div className="rounded-xl bg-ink-50 py-3">
                <p className="text-lg font-bold text-ink-900">{totalCorrect}</p>
                <p className="text-xs text-ink-500">Answered correctly</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- Phase 4: SAT Prep Progress --- */}
      {hasSatData && (
        <div className="mt-6 card">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary-600" />
            <p className="text-sm font-semibold text-ink-900">SAT Prep Progress</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-ink-50 py-3">
              <p className="text-lg font-bold text-ink-900">{satOverallMastery}%</p>
              <p className="text-[11px] text-ink-500">Overall SAT</p>
            </div>
            <div className="rounded-xl bg-ink-50 py-3">
              <p className="text-lg font-bold text-ink-900">{satMathMastery}%</p>
              <p className="text-[11px] text-ink-500">Math</p>
            </div>
            <div className="rounded-xl bg-ink-50 py-3">
              <p className="text-lg font-bold text-ink-900">{satRwMastery}%</p>
              <p className="text-[11px] text-ink-500">Reading &amp; Writing</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-ink-50 py-3">
              <p className="text-lg font-bold text-ink-900">
                {satQuestionsCorrect}/{satQuestionsAttempted}
              </p>
              <p className="text-xs text-ink-500">Correct ({satAccuracy}% accuracy)</p>
            </div>
            <div className="rounded-xl bg-ink-50 py-3">
              <p className="text-lg font-bold text-ink-900">{satSessions.length}</p>
              <p className="text-xs text-ink-500">SAT practice sessions</p>
            </div>
          </div>

          {satWithBaseline.length > 0 && (
            <div className="mt-4 rounded-xl bg-ink-50 py-3 text-center">
              <p className={`text-lg font-bold ${satImprovement >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {satImprovement >= 0 ? '+' : ''}
                {satImprovement}%
              </p>
              <p className="text-xs text-ink-500">Improvement since diagnostic</p>
            </div>
          )}

          <p className="mt-5 mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
            Skill-level mastery
          </p>
          <div className="space-y-3">
            {satMasteries.map((m) => (
              <MasteryRow key={m.topicCode} mastery={m} />
            ))}
          </div>
        </div>
      )}

      {!hasDiagnostic && (
        <button
          onClick={onStartDiagnostic}
          className="btn-primary mt-6 flex items-center justify-center gap-2"
        >
          <Sparkles className="h-5 w-5" />
          Take Diagnostic Assessment
        </button>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: 'primary' | 'accent';
}) {
  const bg = tone === 'primary' ? 'bg-primary-50' : 'bg-accent-50';
  const fg = tone === 'primary' ? 'text-primary-600' : 'text-accent-600';
  return (
    <div className="card">
      <div className={`h-10 w-10 rounded-xl ${bg} grid place-items-center`}>
        <Icon className={`h-5 w-5 ${fg}`} />
      </div>
      <p className="mt-3 text-lg font-bold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  );
}
