import type { TopicInfo } from '@/types';

export interface BankQuestion {
  id: string;
  topicCode: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

/**
 * Small, curated demo topic set. Each topic here has a matching question
 * set in QUESTION_BANK below. This is intentionally compact — Phase 2 goal
 * is a working, honest diagnose→plan→practice→progress loop, not a full
 * curriculum. Expanding this list is a Phase 3 content task.
 */
export const TOPIC_BANK: Record<string, TopicInfo> = {
  'MATH10-QE-01': {
    subject: 'Mathematics',
    grade: 'Class 10',
    chapter: 'Quadratic Equations',
    topic: 'Solving Quadratic Equations by Factorization',
    code: 'MATH10-QE-01',
  },
  'MATH9-LE-01': {
    subject: 'Mathematics',
    grade: 'Class 9',
    chapter: 'Linear Equations',
    topic: 'Linear Equations in Two Variables',
    code: 'MATH9-LE-01',
  },
  'SCI10-LIGHT-02': {
    subject: 'Science',
    grade: 'Class 10',
    chapter: 'Light — Reflection and Refraction',
    topic: 'Laws of Reflection',
    code: 'SCI10-LIGHT-02',
  },
  'SCI10-ACID-01': {
    subject: 'Science',
    grade: 'Class 10',
    chapter: 'Acids, Bases and Salts',
    topic: 'Properties of Acids and Bases',
    code: 'SCI10-ACID-01',
  },
  'ENG9-POEM-03': {
    subject: 'English',
    grade: 'Class 9',
    chapter: 'Poetry',
    topic: 'The Road Not Taken',
    code: 'ENG9-POEM-03',
  },
  'ENG8-GRAM-01': {
    subject: 'English',
    grade: 'Class 8',
    chapter: 'Grammar',
    topic: 'Tenses',
    code: 'ENG8-GRAM-01',
  },
};

export const QUESTION_BANK: Record<string, BankQuestion[]> = {
  'MATH10-QE-01': [
    {
      id: 'MATH10-QE-01-Q1',
      topicCode: 'MATH10-QE-01',
      question: 'What is the standard form of a quadratic equation?',
      options: ['ax + b = 0', 'ax² + bx + c = 0', 'ax³ + bx² + c = 0', 'a/x + b = 0'],
      correctIndex: 1,
    },
    {
      id: 'MATH10-QE-01-Q2',
      topicCode: 'MATH10-QE-01',
      question: 'The roots of x² - 5x + 6 = 0 are:',
      options: ['1, 6', '2, 3', '-2, -3', '2, -3'],
      correctIndex: 1,
    },
    {
      id: 'MATH10-QE-01-Q3',
      topicCode: 'MATH10-QE-01',
      question: 'How many roots does a quadratic equation have (counting repeats)?',
      options: ['1', '2', '3', '0'],
      correctIndex: 1,
    },
    {
      id: 'MATH10-QE-01-Q4',
      topicCode: 'MATH10-QE-01',
      question: 'Factorization of x² - 9 is:',
      options: ['(x-3)(x-3)', '(x+3)(x+3)', '(x-3)(x+3)', '(x-9)(x+1)'],
      correctIndex: 2,
    },
  ],
  'MATH9-LE-01': [
    {
      id: 'MATH9-LE-01-Q1',
      topicCode: 'MATH9-LE-01',
      question: 'A linear equation in two variables can be written as:',
      options: ['ax + b = 0', 'ax + by + c = 0', 'ax² + b = 0', 'a/x + b/y = 0'],
      correctIndex: 1,
    },
    {
      id: 'MATH9-LE-01-Q2',
      topicCode: 'MATH9-LE-01',
      question: 'How many solutions does a single linear equation in two variables have?',
      options: ['Exactly one', 'Exactly two', 'Infinitely many', 'None'],
      correctIndex: 2,
    },
    {
      id: 'MATH9-LE-01-Q3',
      topicCode: 'MATH9-LE-01',
      question: 'If x = 2 and y = 3 satisfy 2x + y = 7, this point lies:',
      options: ['On the line', 'Above the line', 'Below the line', 'Cannot say'],
      correctIndex: 0,
    },
    {
      id: 'MATH9-LE-01-Q4',
      topicCode: 'MATH9-LE-01',
      question: 'The graph of a linear equation in two variables is a:',
      options: ['Curve', 'Straight line', 'Parabola', 'Circle'],
      correctIndex: 1,
    },
  ],
  'SCI10-LIGHT-02': [
    {
      id: 'SCI10-LIGHT-02-Q1',
      topicCode: 'SCI10-LIGHT-02',
      question: 'The angle of incidence is always equal to the:',
      options: ['Angle of refraction', 'Angle of reflection', 'Angle of deviation', 'Critical angle'],
      correctIndex: 1,
    },
    {
      id: 'SCI10-LIGHT-02-Q2',
      topicCode: 'SCI10-LIGHT-02',
      question: 'The incident ray, reflected ray, and normal all lie:',
      options: ['On different planes', 'In the same plane', 'Perpendicular to each other', 'Parallel to the mirror'],
      correctIndex: 1,
    },
    {
      id: 'SCI10-LIGHT-02-Q3',
      topicCode: 'SCI10-LIGHT-02',
      question: 'A plane mirror forms an image that is:',
      options: ['Real and inverted', 'Virtual and erect', 'Real and erect', 'Virtual and inverted'],
      correctIndex: 1,
    },
    {
      id: 'SCI10-LIGHT-02-Q4',
      topicCode: 'SCI10-LIGHT-02',
      question: 'The normal at the point of incidence is drawn:',
      options: ['Parallel to the mirror', 'At 45° to the mirror', 'Perpendicular to the mirror', 'At 60° to the mirror'],
      correctIndex: 2,
    },
  ],
  'SCI10-ACID-01': [
    {
      id: 'SCI10-ACID-01-Q1',
      topicCode: 'SCI10-ACID-01',
      question: 'An acid turns blue litmus paper:',
      options: ['Blue', 'Red', 'Green', 'Colorless'],
      correctIndex: 1,
    },
    {
      id: 'SCI10-ACID-01-Q2',
      topicCode: 'SCI10-ACID-01',
      question: 'The pH of a neutral solution is:',
      options: ['0', '7', '14', '1'],
      correctIndex: 1,
    },
    {
      id: 'SCI10-ACID-01-Q3',
      topicCode: 'SCI10-ACID-01',
      question: 'A base turns red litmus paper:',
      options: ['Red', 'Blue', 'Yellow', 'Colorless'],
      correctIndex: 1,
    },
    {
      id: 'SCI10-ACID-01-Q4',
      topicCode: 'SCI10-ACID-01',
      question: 'Which of these is a common laboratory base?',
      options: ['Hydrochloric acid', 'Sodium hydroxide', 'Acetic acid', 'Sulphuric acid'],
      correctIndex: 1,
    },
  ],
  'ENG9-POEM-03': [
    {
      id: 'ENG9-POEM-03-Q1',
      topicCode: 'ENG9-POEM-03',
      question: '"The Road Not Taken" was written by:',
      options: ['William Wordsworth', 'Robert Frost', 'John Keats', 'Rudyard Kipling'],
      correctIndex: 1,
    },
    {
      id: 'ENG9-POEM-03-Q2',
      topicCode: 'ENG9-POEM-03',
      question: 'The poem is mainly about:',
      options: ['A journey by train', 'Choices in life', 'A walk in the rain', 'A conversation with a friend'],
      correctIndex: 1,
    },
    {
      id: 'ENG9-POEM-03-Q3',
      topicCode: 'ENG9-POEM-03',
      question: 'How many roads diverge in the poem?',
      options: ['One', 'Two', 'Three', 'Four'],
      correctIndex: 1,
    },
    {
      id: 'ENG9-POEM-03-Q4',
      topicCode: 'ENG9-POEM-03',
      question: 'The tone of the poem is best described as:',
      options: ['Angry', 'Reflective', 'Comic', 'Fearful'],
      correctIndex: 1,
    },
  ],
  'ENG8-GRAM-01': [
    {
      id: 'ENG8-GRAM-01-Q1',
      topicCode: 'ENG8-GRAM-01',
      question: 'Choose the correct present continuous form: "She ___ to school now."',
      options: ['go', 'goes', 'is going', 'went'],
      correctIndex: 2,
    },
    {
      id: 'ENG8-GRAM-01-Q2',
      topicCode: 'ENG8-GRAM-01',
      question: 'The past tense of "write" is:',
      options: ['writed', 'wrote', 'writen', 'writing'],
      correctIndex: 1,
    },
    {
      id: 'ENG8-GRAM-01-Q3',
      topicCode: 'ENG8-GRAM-01',
      question: 'Which sentence uses future tense correctly?',
      options: ['I will went home', 'I will go home', 'I will going home', 'I go home tomorrow will'],
      correctIndex: 1,
    },
    {
      id: 'ENG8-GRAM-01-Q4',
      topicCode: 'ENG8-GRAM-01',
      question: '"They have finished their homework" is an example of:',
      options: ['Present perfect', 'Past continuous', 'Future perfect', 'Simple past'],
      correctIndex: 0,
    },
  ],
};

/** Topics matching the student's chosen subjects; falls back to the full bank if none match. */
export function getTopicsForSubjects(subjects: string[]): TopicInfo[] {
  const matched = Object.values(TOPIC_BANK).filter((t) => subjects.includes(t.subject));
  return matched.length > 0 ? matched : Object.values(TOPIC_BANK);
}

/** Builds a compact diagnostic question set spanning the student's matched topics.
 * maxTopics defaults to the full bank size so a student's diagnostic always
 * covers every topic matching their selected subjects (important so the
 * later study plan, which is built from diagnosed topics, never has to
 * silently drop a subject the student picked).
 */
export function getDiagnosticQuestions(
  subjects: string[],
  maxTopics = 6,
  perTopic = 3
): BankQuestion[] {
  const topics = getTopicsForSubjects(subjects).slice(0, maxTopics);
  const questions: BankQuestion[] = [];
  topics.forEach((t) => {
    const bank = QUESTION_BANK[t.code] ?? [];
    questions.push(...bank.slice(0, perTopic));
  });
  return questions;
}
