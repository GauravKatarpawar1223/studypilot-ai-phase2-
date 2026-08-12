import { GraduationCap } from 'lucide-react';

interface Props {
  size?: 'sm' | 'md';
}

export default function Logo({ size = 'md' }: Props) {
  const box = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  const icon = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';
  return (
    <div className={`${box} rounded-xl bg-primary-600 grid place-items-center shadow-soft`}>
      <GraduationCap className={`${icon} text-white`} strokeWidth={2.2} />
    </div>
  );
}
