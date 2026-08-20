import { Home, BookOpen, BarChart3, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Tab = 'home' | 'learn' | 'progress' | 'profile';

export const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
];

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-ink-200 bg-white/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary navigation"
    >
      <div className="flex items-stretch justify-around px-2 pt-1.5 pb-1.5">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition"
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
            >
              <Icon
                className={isActive ? 'h-6 w-6 text-primary-600' : 'h-6 w-6 text-ink-400'}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span
                className={
                  isActive
                    ? 'text-[11px] font-semibold text-primary-700'
                    : 'text-[11px] font-medium text-ink-500'
                }
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
