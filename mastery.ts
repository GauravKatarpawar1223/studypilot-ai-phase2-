import { TOPIC_BANK } from '@/data/questionBank';
import type { DiagnosticAnswer, PracticeSession, TopicMastery } from '@/types';

function statusFromScore(scorePct: number): TopicMastery['status'] {
  if (scorePct >= 80) return 'strong';
  if (scorePct >= 50) return 'developing';
  return 'weak';
}

/** Groups diagnostic answers by topic and produces initial mastery records. */
export function scoreDiagnostic(answers: DiagnosticAnswer[]): TopicMastery[] {
  const byTopic = new Map<string, DiagnosticAnswer[]>();
  answers.forEach((a) => {
    const list = byTopic.get(a.topicCode) ?? [];
    list.push(a);
    byTopic.set(a.topicCode, list);
  });

  const masteries: TopicMastery[] = [];
  byTopic.forEach((list, topicCode) => {
    const info = TOPIC_BANK[topicCode];
    if (!info) return;
    const correct = list.filter((a) => a.correct).length;
    const scorePct = Math.round((correct / list.length) * 100);
    masteries.push({
      topicCode,
      subject: info.subject,
      topic: info.topic,
      chapter: info.chapter,
      status: statusFromScore(scorePct),
      scorePct,
      attempts: 1,
    });
  });

  return masteries;
}

/** Blends a new practice session's score into existing mastery for that topic. */
export function applySessionToMasteries(
  masteries: TopicMastery[],
  session: PracticeSession
): TopicMastery[] {
  const info = TOPIC_BANK[session.topicCode];
  if (!info) return masteries;

  const existing = masteries.find((m) => m.topicCode === session.topicCode);

  if (!existing) {
    const fresh: TopicMastery = {
      topicCode: session.topicCode,
      subject: info.subject,
      topic: info.topic,
      chapter: info.chapter,
      status: statusFromScore(session.scorePct),
      scorePct: session.scorePct,
      attempts: 1,
      lastPracticedAt: session.completedAt,
    };
    return [...masteries, fresh];
  }

  const blendedScore = Math.round((existing.scorePct + session.scorePct) / 2);
  const updated: TopicMastery = {
    ...existing,
    scorePct: blendedScore,
    status: statusFromScore(blendedScore),
    attempts: existing.attempts + 1,
    lastPracticedAt: session.completedAt,
  };

  return masteries.map((m) => (m.topicCode === session.topicCode ? updated : m));
}
