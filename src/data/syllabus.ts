import { TOPIC_BANK } from '@/data/questionBank';
import type { Board, TopicInfo } from '@/types';

/**
 * This module is a derived VIEW over TOPIC_BANK (data/questionBank.ts) — it
 * introduces no new content store and duplicates no data. TOPIC_BANK
 * remains the single source of truth for every topic's board, class,
 * subject, chapter, and topic name; this file just exposes a clean
 * Board -> Class -> Subject -> Chapter -> Topic query surface over it, so
 * more real content (more classes, boards, subjects, chapters) can be
 * added later purely by extending TOPIC_BANK, with zero changes needed
 * anywhere else in the app.
 *
 * Import direction is intentionally one-way: this file imports from
 * questionBank.ts, never the reverse, so Phase 1's getTopicsForSubjects()/
 * getDiagnosticQuestions() are completely untouched by this addition.
 *
 * SAT topics are always excluded here — SAT is a separate track (see
 * isSatSubject in questionBank.ts) and never appears in the school
 * syllabus tree. A topic belongs to the school syllabus if and only if it
 * has a `board` set (SAT topics leave `board` undefined).
 */

export interface SyllabusChapter {
  chapter: string;
  topics: TopicInfo[];
}

function schoolTopics(): TopicInfo[] {
  return Object.values(TOPIC_BANK).filter((t): t is TopicInfo & { board: Board } => t.board !== undefined);
}

/** Every board that currently has at least one school topic. */
export function getAvailableBoards(): Board[] {
  const boards = new Set<Board>();
  schoolTopics().forEach((t) => {
    if (t.board) boards.add(t.board);
  });
  return Array.from(boards);
}

/** Every class/grade that has content for a given board. */
export function getAvailableGrades(board: Board): string[] {
  const grades = new Set<string>();
  schoolTopics()
    .filter((t) => t.board === board)
    .forEach((t) => grades.add(t.grade));
  return Array.from(grades);
}

/** Every subject that has content for a given board + class. */
export function getAvailableSubjects(board: Board, grade: string): string[] {
  const subjects = new Set<string>();
  schoolTopics()
    .filter((t) => t.board === board && t.grade === grade)
    .forEach((t) => subjects.add(t.subject));
  return Array.from(subjects);
}

/**
 * The full syllabus tree for one board + class + subject, grouped into
 * chapters (in the order topics were added). Returns an empty array —
 * never content from a different class or board — if nothing exists for
 * this exact combination; callers must show the existing honest empty
 * state rather than substitute anything else.
 */
export function getSyllabus(board: Board, grade: string, subject: string): SyllabusChapter[] {
  const topics = schoolTopics().filter(
    (t) => t.board === board && t.grade === grade && t.subject === subject
  );

  const byChapter = new Map<string, TopicInfo[]>();
  topics.forEach((t) => {
    const list = byChapter.get(t.chapter) ?? [];
    list.push(t);
    byChapter.set(t.chapter, list);
  });

  return Array.from(byChapter.entries()).map(([chapter, chapterTopics]) => ({
    chapter,
    topics: chapterTopics,
  }));
}

/** Whether the student's exact board + class + subject has any content at all. */
export function hasSyllabusContent(board: Board, grade: string, subject: string): boolean {
  return getSyllabus(board, grade, subject).length > 0;
}

/**
 * Full Board -> Class -> Subject -> Chapter -> Topic context for one topic
 * code, resolved from TOPIC_BANK. This is what the Learn flow uses to know
 * exactly where a topic sits in the syllabus the moment it's opened.
 * Returns undefined for SAT topics (no board) or unknown codes.
 */
export function getTopicSyllabusContext(
  topicCode: string
): { board: Board; grade: string; subject: string; chapter: string; topic: TopicInfo } | undefined {
  const topic = TOPIC_BANK[topicCode];
  if (!topic || !topic.board) return undefined;
  return { board: topic.board, grade: topic.grade, subject: topic.subject, chapter: topic.chapter, topic };
}
