import { User, GraduationCap, BookOpen, Languages, Clock, RefreshCw, LogOut, type LucideIcon } from 'lucide-react';
import Logo from '@/components/Logo';
import type { StudentProfile } from '@/types';

interface Props {
  profile: StudentProfile;
  onEditSetup: () => void;
  onSignOut: () => void;
}

export default function ProfileScreen({ profile, onEditSetup, onSignOut }: Props) {
  return (
    <div className="px-5 pt-8 pb-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-primary-600 grid place-items-center shadow-soft">
          <User className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink-900">{profile.name}</h1>
          <p className="text-sm text-ink-500">{profile.grade}</p>
        </div>
      </div>

      <div className="mt-6 card divide-y divide-ink-100">
        <InfoRow icon={GraduationCap} label="Class" value={profile.grade} />
        <InfoRow
          icon={BookOpen}
          label="Subjects"
          value={profile.subjects.join(', ')}
        />
        <InfoRow icon={Languages} label="Language" value={profile.language} />
        <InfoRow icon={Clock} label="Daily study time" value={profile.studyTime} />
      </div>

      <div className="mt-6 space-y-3">
        <button onClick={onEditSetup} className="btn-secondary flex items-center justify-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Edit My Setup
        </button>
        <button
          onClick={onSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-semibold text-red-600 active:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Reset & Start Over
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-ink-300">
        <Logo size="sm" />
        <div>
          <p className="text-xs font-semibold text-ink-500">StudyPilot AI</p>
          <p className="text-[10px] text-ink-400">Phase 1 · Foundation</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5">
      <div className="h-9 w-9 shrink-0 rounded-xl bg-ink-100 grid place-items-center">
        <Icon className="h-4 w-4 text-ink-600" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-ink-500">{label}</p>
        <p className="text-sm font-semibold text-ink-900">{value}</p>
      </div>
    </div>
  );
}
