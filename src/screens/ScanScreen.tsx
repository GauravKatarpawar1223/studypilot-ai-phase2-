import { useState } from 'react';
import { ChevronLeft, QrCode, Keyboard, Search, Info } from 'lucide-react';
import { DEMO_CODES, DEMO_TOPIC } from '@/data/demoData';
import type { TopicInfo } from '@/types';

interface Props {
  onBack: () => void;
  onTopic: (t: TopicInfo) => void;
}

export default function ScanScreen({ onBack, onTopic }: Props) {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleScan = () => {
    setError('');
    onTopic(DEMO_TOPIC);
  };

  const handleManual = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter a topic code.');
      return;
    }
    const match = DEMO_CODES[trimmed];
    if (match) {
      setError('');
      onTopic(match);
    } else {
      setError('Code not found. Try MATH10-QE-01 or tap a demo below.');
    }
  };

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
        <h1 className="text-xl font-bold text-ink-900">Scan / Learning Material</h1>
      </header>

      <div className="mt-6 flex rounded-2xl bg-ink-100 p-1">
        <button
          onClick={() => setMode('scan')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
            mode === 'scan' ? 'bg-white text-primary-700 shadow-card' : 'text-ink-500'
          }`}
        >
          <QrCode className="h-4 w-4" />
          Scan QR
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
            mode === 'manual' ? 'bg-white text-primary-700 shadow-card' : 'text-ink-500'
          }`}
        >
          <Keyboard className="h-4 w-4" />
          Enter Code
        </button>
      </div>

      {mode === 'scan' ? (
        <div className="mt-8 flex flex-1 flex-col">
          <div className="relative mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-3xl border-2 border-dashed border-primary-300 bg-primary-50">
            <div className="absolute inset-0 grid place-items-center">
              <QrCode className="h-24 w-24 text-primary-300" strokeWidth={1.5} />
            </div>
            <div className="absolute inset-x-6 top-1/2 h-0.5 -translate-y-1/2 bg-primary-600/70" />
            <span className="absolute left-3 top-3 h-6 w-6 border-l-4 border-t-4 border-primary-600 rounded-tl-lg" />
            <span className="absolute right-3 top-3 h-6 w-6 border-r-4 border-t-4 border-primary-600 rounded-tr-lg" />
            <span className="absolute left-3 bottom-3 h-6 w-6 border-l-4 border-b-4 border-primary-600 rounded-bl-lg" />
            <span className="absolute right-3 bottom-3 h-6 w-6 border-r-4 border-b-4 border-primary-600 rounded-br-lg" />
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-accent-50 p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
            <p className="text-xs text-accent-700">
              Live camera scanning isn't available in this version. Use the sample topic below
              or enter a code to explore the learning flow.
            </p>
          </div>

          <div className="mt-auto pt-6">
            <button onClick={handleScan} className="btn-primary">
              Open Demo Topic
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-1 flex-col">
          <p className="text-sm text-ink-600">
            Enter the topic code printed on your worksheet or shared by your teacher.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleManual()}
              placeholder="e.g. MATH10-QE-01"
              className="input-field flex-1 uppercase"
              autoCapitalize="characters"
            />
            <button
              onClick={handleManual}
              className="shrink-0 rounded-2xl bg-primary-600 px-5 py-3.5 text-white active:scale-[0.98] active:bg-primary-700"
              aria-label="Search code"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Try a demo code
            </p>
            <div className="mt-2.5 space-y-2">
              {Object.values(DEMO_CODES).map((t) => (
                <button
                  key={t.code}
                  onClick={() => onTopic(t)}
                  className="card flex w-full items-center justify-between text-left active:scale-[0.99]"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{t.topic}</p>
                    <p className="text-xs text-ink-500">{t.subject} · {t.grade}</p>
                  </div>
                  <span className="rounded-md bg-ink-100 px-2 py-1 text-[11px] font-semibold text-ink-600">
                    {t.code}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button onClick={handleManual} className="btn-primary">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
