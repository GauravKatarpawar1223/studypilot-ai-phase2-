import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Logo from '@/components/Logo';
import { BOARDS, GRADES, SUBJECTS, LANGUAGES, STUDY_TIMES } from '@/data/demoData';
import type { Board, Language, StudentProfile, StudyTime } from '@/types';

interface Props {
  existing: StudentProfile | null;
  onComplete: (p: StudentProfile) => void;
  onCancel: () => void;
}

const STEPS = ['Name', 'Board', 'Class', 'Subjects', 'Language', 'Study time'] as const;

export default function SetupScreen({ existing, onComplete, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(existing?.name ?? '');
  const [board, setBoard] = useState<Board | ''>(existing?.board ?? '');
  const [grade, setGrade] = useState(existing?.grade ?? '');
  const [subjects, setSubjects] = useState<string[]>(existing?.subjects ?? []);
  const [language, setLanguage] = useState<Language>(existing?.language ?? 'English');
  const [studyTime, setStudyTime] = useState<StudyTime>(existing?.studyTime ?? '30 min');

  const toggleSubject = (s: string) => {
    setSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const canProceed = (() => {
    switch (step) {
      case 0:
        return name.trim().length > 0;
      case 1:
        return !!board;
      case 2:
        return !!grade;
      case 3:
        return subjects.length > 0;
      case 4:
        return !!language;
      case 5:
        return !!studyTime;
      default:
        return false;
    }
  })();

  const next = () => {
    if (!canProceed) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    if (!board) return;
    onComplete({
      name: name.trim(),
      board,
      grade,
      subjects,
      language,
      studyTime,
      createdAt: existing?.createdAt ?? Date.now(),
    });
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
    else onCancel();
  };

  return (
    <div className="flex min-h-full flex-col px-5 pt-8 pb-6">
      <header className="flex items-center justify-between">
        <button onClick={back} className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-600 active:bg-ink-100">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <p className="text-sm font-semibold text-ink-500">
          Step {step + 1} of {STEPS.length}
        </p>
        <div className="h-10 w-10">
          <Logo size="sm" />
        </div>
      </header>

      <div className="mt-4 flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition ${i <= step ? 'bg-primary-600' : 'bg-ink-200'}`}
          />
        ))}
      </div>

      <div className="mt-8 flex-1">
        {step === 0 && (
          <StepShell
            title="What should we call you?"
            subtitle="So we can greet you when you learn."
          >
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input-field pl-12"
                maxLength={30}
              />
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell title="Select your board" subtitle="We'll match your curriculum exactly.">
            <div className="space-y-3">
              {BOARDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBoard(b)}
                  className={`chip ${board === b ? 'chip-on' : 'chip-off'} flex w-full items-center justify-between px-5`}
                >
                  <span className="text-left text-base">{b}</span>
                  {board === b && <Check className="h-5 w-5" />}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell title="Select your class" subtitle="We'll match lessons to your level.">
            <div className="grid grid-cols-2 gap-3">
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`chip ${grade === g ? 'chip-on' : 'chip-off'} flex items-center justify-center`}
                >
                  {g}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            title="Pick your subjects"
            subtitle="Choose all the subjects you want to study."
          >
            <div className="grid grid-cols-2 gap-3">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s)}
                  className={`chip ${subjects.includes(s) ? 'chip-on' : 'chip-off'} flex items-center justify-center gap-1.5`}
                >
                  {subjects.includes(s) && <Check className="h-4 w-4" />}
                  {s}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell
            title="Preferred language"
            subtitle="Lessons and explanations in your language."
          >
            <div className="space-y-3">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`chip ${language === l ? 'chip-on' : 'chip-off'} flex w-full items-center justify-between px-5`}
                >
                  <span className="text-left text-base">{l}</span>
                  {language === l && <Check className="h-5 w-5" />}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell
            title="Daily study time"
            subtitle="We'll plan sessions that fit your day."
          >
            <div className="space-y-3">
              {STUDY_TIMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setStudyTime(t)}
                  className={`chip ${studyTime === t ? 'chip-on' : 'chip-off'} flex w-full items-center justify-between px-5`}
                >
                  <span className="text-base">{t}</span>
                  {studyTime === t && <Check className="h-5 w-5" />}
                </button>
              ))}
            </div>
          </StepShell>
        )}
      </div>

      <button onClick={next} disabled={!canProceed} className="btn-primary mt-6 flex items-center justify-center gap-2">
        {step === STEPS.length - 1 ? 'Finish Setup' : 'Continue'}
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900">{title}</h2>
      <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
