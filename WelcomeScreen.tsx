import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import Logo from '@/components/Logo';
import type { StudentProfile } from '@/types';

interface Props {
  profile: StudentProfile | null;
  onStart: () => void;
  onContinue: () => void;
}

export default function WelcomeScreen({ profile, onStart, onContinue }: Props) {
  const hasSetup = !!profile;

  return (
    <div className="flex min-h-full flex-col px-5 pt-10 pb-6">
      <header className="flex items-center gap-3">
        <Logo />
        <div>
          <p className="text-lg font-bold leading-tight text-ink-900">StudyPilot AI</p>
          <p className="text-xs font-medium text-primary-600">Learning Companion</p>
        </div>
      </header>

      <div className="mt-12 flex flex-1 flex-col">
        <h1 className="text-[28px] font-bold leading-tight text-ink-900">
          Your free,
          <br />
          personalized
          <br />
          <span className="text-primary-600">learning companion.</span>
        </h1>
        <p className="mt-4 text-base text-ink-600">
          Learn at your own pace, in your own language. Simple lessons designed to work
          on any phone, even on slow internet.
        </p>

        <div className="mt-10 space-y-4">
          <button onClick={onStart} className="btn-primary flex items-center justify-center gap-2">
            {hasSetup ? 'Start New Setup' : 'Start Learning'}
            <ArrowRight className="h-5 w-5" />
          </button>

          {hasSetup && (
            <button onClick={onContinue} className="btn-secondary">
              Continue Learning
            </button>
          )}
        </div>
      </div>

      {hasSetup && profile && (
        <div className="mt-8 rounded-2xl bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Continue where you left off
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-50 grid place-items-center">
              <BookOpen className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-900">{profile.grade}</p>
              <p className="text-xs text-ink-500">
                {profile.subjects.length} subjects · {profile.language}
              </p>
            </div>
            <div className="flex items-center gap-1 text-ink-400">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">{profile.studyTime}</span>
            </div>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-[11px] text-ink-400">
        Free for all students · Works on basic phones
      </p>
    </div>
  );
}
