import type { TopicInfo } from '@/types';

export const GRADES = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Hindi',
  'Marathi',
  'Physics',
  'Chemistry',
  'Biology',
];

export const LANGUAGES = ['English', 'Hindi', 'Marathi'] as const;

export const STUDY_TIMES = ['15 min', '30 min', '60 min', '90+ min'] as const;

export const DEMO_TOPIC: TopicInfo = {
  subject: 'Mathematics',
  grade: 'Class 10',
  chapter: 'Quadratic Equations',
  topic: 'Solving Quadratic Equations by Factorization',
  code: 'MATH10-QE-01',
};

export const DEMO_CODES: Record<string, TopicInfo> = {
  'MATH10-QE-01': DEMO_TOPIC,
  'SCI10-LIGHT-02': {
    subject: 'Science',
    grade: 'Class 10',
    chapter: 'Light — Reflection and Refraction',
    topic: 'Laws of Reflection',
    code: 'SCI10-LIGHT-02',
  },
  'ENG9-POEM-03': {
    subject: 'English',
    grade: 'Class 9',
    chapter: 'Poetry',
    topic: 'The Road Not Taken',
    code: 'ENG9-POEM-03',
  },
};
