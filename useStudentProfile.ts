import { useState, useEffect, useCallback } from 'react';
import type { StudentProfile } from '@/types';

const STORAGE_KEY = 'studypilot_profile_v1';

const emptyProfile: StudentProfile | null = null;

function read(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProfile;
    const parsed = JSON.parse(raw) as StudentProfile;
    if (typeof parsed?.language === 'string') return parsed;
    return emptyProfile;
  } catch {
    return emptyProfile;
  }
}

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(() => read());

  useEffect(() => {
    try {
      if (profile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* storage may be unavailable; ignore */
    }
  }, [profile]);

  const save = useCallback((p: StudentProfile) => {
    setProfile(p);
  }, []);

  const clear = useCallback(() => {
    setProfile(null);
  }, []);

  return { profile, save, clear };
}
