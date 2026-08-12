import { TrendingUp, Clock, Target, Award, Sparkles, type LucideIcon } from 'lucide-react';
import type { ProgressState, StudentProfile } from '@/types';

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

export default function ProgressScreen({ profile, progress, onStartDiagnostic }: Props) {
  const hasDiagnostic = progress.masteries.length > 0;
  const topicsMastered = progress.masteries.filter((m) => m.status === 'strong').length;

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-ink-900">My Progress</h1>
      <p className="mt-1 text-sm text-ink-500">Hi {profile.name}, here's your learning overview.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard icon={Clock} label="Daily goal" value={profile.studyTime} tone="accent" />
        <StatCard icon={Target} label="Subjects" value={`${profile.subjects.length}`} tone="primary" />
        <StatCard icon={Award} label="Topics mastered" value={hasDiagnostic ? `${topicsMastered}` : '—'} tone="primary" />
        <StatCard icon={TrendingUp} label="Day streak" value={hasDiagnostic ? `${progress.streakDays}` : '—'} tone="accent" />
      </div>

      <div className="mt-6 card">
        <p className="text-sm font-semibold text-ink-900">Topic mastery</p>
        {hasDiagnostic ? (
          <div className="mt-4 space-y-3">
            {progress.masteries.map((m) => (
              <div key={m.topicCode}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-700">{m.topic}</span>
                  <span className="text-xs font-medium text-ink-400">
                    {STATUS_LABEL[m.status]} · {m.scorePct}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-ink-100">
                  <div
                    className={`h-2 rounded-full ${STATUS_COLOR[m.status]}`}
                    style={{ width: `${m.scorePct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-500">
            Take your diagnostic assessment to see per-topic mastery here.
          </p>
        )}
      </div>

      <div className="mt-6 card">
        <p className="text-sm font-semibold text-ink-900">Sessions completed</p>
        <p className="mt-1 text-xs text-ink-500">
          {progress.sessions.length === 0
            ? 'No practice sessions yet.'
            : `${progress.sessions.length} practice session${progress.sessions.length > 1 ? 's' : ''} so far.`}
        </p>
      </div>

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
