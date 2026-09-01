/**
 * StudyPilot learning agent.
 *
 * This is the single place where "AI decision making" happens:
 *  - generateStudyPlan(): turns diagnostic results into an ordered,
 *    justified study plan.
 *  - adaptPlan(): after a practice session, re-evaluates and reorders the
 *    remaining plan and produces a short proactive message for the student.
 *
 * Both functions try a server-side AI proxy first (see lib/aiClient.ts) and
 * always fall back to deterministic, rule-based logic if that call is not
 * configured, fails, or times out. The rest of the app never needs to know
 * which path was used — every result carries a `source: 'ai' | 'fallback'`
 * flag for transparency.
 */

import { TOPIC_BANK, getTopicsForSubjects } from '@/data/questionBank';
import { applySessionToMasteries } from '@/lib/mastery';
import { callAgent } from '@/lib/aiClient';
import type {
  AdaptiveNudge,
  Language,
  PracticeSession,
  StudentProfile,
  StudyPlan,
  StudyPlanItem,
  TopicMastery,
} from '@/types';

/* ------------------------------------------------------------------ */
/* Fallback copy (used when the AI call is unavailable)                */
/* ------------------------------------------------------------------ */

const REASON_TEMPLATES: Record<Language, Record<TopicMastery['status'], string>> = {
  English: {
    weak: "This topic was difficult in your diagnostic — let's build it up first.",
    developing: "You're getting there on this one — a bit more practice will help.",
    strong: "You're doing well here — a quick review to stay sharp.",
  },
  Hindi: {
    weak: 'डायग्नोस्टिक में यह विषय कठिन लगा — पहले इसे मजबूत करते हैं।',
    developing: 'आप इसमें आगे बढ़ रहे हैं — थोड़ा और अभ्यास मदद करेगा।',
    strong: 'यह विषय अच्छा चल रहा है — तेज़ बने रहने के लिए एक त्वरित समीक्षा।',
  },
  Marathi: {
    weak: 'डायग्नोस्टिकमध्ये हा विषय अवघड वाटला — आधी हा मजबूत करूया.',
    developing: 'तुम्ही यात प्रगती करत आहात — थोडा अधिक सराव मदत करेल.',
    strong: 'हा विषय चांगला चालला आहे — तयारी टिकवण्यासाठी एक द्रुत उजळणी.',
  },
};

const NUDGE_COPY: Record<
  Language,
  {
    whatChangedImproved: string;
    whatChangedStayed: string;
    whyImproved: string;
    whyStayed: string;
    nextImproved: string;
    nextStayed: string;
    nextNone: string;
    messageImproved: string;
    messageStayed: string;
  }
> = {
  English: {
    whatChangedImproved: '{topic} moved down your priority list.',
    whatChangedStayed: '{topic} stays at the top of your plan.',
    whyImproved: 'You answered {correct}/{total} correctly this time, improving to {scorePct}%.',
    whyStayed: 'You answered {correct}/{total} correctly — this skill still needs more work.',
    nextImproved: 'Next up: {next}.',
    nextStayed: 'Practice {topic} again to strengthen it.',
    nextNone: 'Keep practicing {topic} a little more.',
    messageImproved: 'Nice work on {topic}! Moving {next} up next.',
    messageStayed: "Let's keep practicing {topic} a little more before moving on.",
  },
  Hindi: {
    whatChangedImproved: '{topic} अब आपकी प्राथमिकता सूची में नीचे चला गया है।',
    whatChangedStayed: '{topic} अभी भी आपकी योजना में सबसे ऊपर है।',
    whyImproved: 'आपने इस बार {correct}/{total} सही उत्तर दिए, {scorePct}% तक सुधार हुआ।',
    whyStayed: 'आपने {correct}/{total} सही उत्तर दिए — इस विषय पर अभी और काम चाहिए।',
    nextImproved: 'अब आगे: {next}।',
    nextStayed: '{topic} को मजबूत करने के लिए फिर से अभ्यास करें।',
    nextNone: '{topic} का थोड़ा और अभ्यास करते रहें।',
    messageImproved: 'बढ़िया! {topic} में अच्छा किया। अब {next} पर आगे बढ़ते हैं।',
    messageStayed: 'आगे बढ़ने से पहले {topic} का थोड़ा और अभ्यास करते हैं।',
  },
  Marathi: {
    whatChangedImproved: '{topic} आता तुमच्या प्राधान्य यादीत खाली गेला आहे.',
    whatChangedStayed: '{topic} अजूनही तुमच्या योजनेत सर्वात वर आहे.',
    whyImproved: 'यावेळी तुम्ही {correct}/{total} बरोबर उत्तरे दिली, {scorePct}% पर्यंत सुधारणा झाली.',
    whyStayed: 'तुम्ही {correct}/{total} बरोबर उत्तरे दिली — या कौशल्यावर अजून काम हवे.',
    nextImproved: 'पुढे: {next}.',
    nextStayed: '{topic} मजबूत करण्यासाठी पुन्हा सराव करा.',
    nextNone: '{topic} चा थोडा अधिक सराव सुरू ठेवा.',
    messageImproved: 'छान! {topic} मध्ये चांगली कामगिरी. आता पुढे {next} घेऊया.',
    messageStayed: 'पुढे जाण्यापूर्वी {topic} चा थोडा अधिक सराव करूया.',
  },
};

const STATUS_ORDER: Record<TopicMastery['status'], number> = {
  weak: 0,
  developing: 1,
  strong: 2,
};

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (acc, [key, val]) => acc.replace(`{${key}}`, val),
    template
  );
}

/* ------------------------------------------------------------------ */
/* Deterministic fallback logic                                        */
/* ------------------------------------------------------------------ */

function buildFallbackPlan(
  profile: StudentProfile,
  masteries: TopicMastery[]
): StudyPlan {
  // Build the plan from exactly the topics the student was diagnosed on, so
  // the plan can never reference a topic they were never assessed on. If no
  // diagnostic exists yet (defensive; the UI normally prevents this), fall
  // back to the student's subject-matched topics so the app still produces
  // a reasonable plan rather than an empty one.
  const topicSource =
    masteries.length > 0
      ? masteries.map((m) => ({
          code: m.topicCode,
          subject: m.subject,
          topic: m.topic,
          chapter: m.chapter,
        }))
      : getTopicsForSubjects(profile.subjects, profile.board, profile.grade).map((t) => ({
          code: t.code,
          subject: t.subject,
          topic: t.topic,
          chapter: t.chapter,
        }));

  const masteryByCode = new Map(masteries.map((m): [string, TopicMastery] => [m.topicCode, m]));

  const sorted = [...topicSource].sort((a, b) => {
    const ma = masteryByCode.get(a.code);
    const mb = masteryByCode.get(b.code);
    const statusA = ma ? STATUS_ORDER[ma.status] : 0;
    const statusB = mb ? STATUS_ORDER[mb.status] : 0;
    if (statusA !== statusB) return statusA - statusB;
    return (ma?.scorePct ?? 0) - (mb?.scorePct ?? 0);
  });

  const items: StudyPlanItem[] = sorted.map((t, i): StudyPlanItem => {
    const m = masteryByCode.get(t.code);
    const status = m?.status ?? 'weak';
    return {
      topicCode: t.code,
      subject: t.subject,
      topic: t.topic,
      chapter: t.chapter,
      reason: REASON_TEMPLATES[profile.language][status],
      order: i,
      status: 'pending',
    };
  });

  return {
    generatedAt: Date.now(),
    language: profile.language,
    items,
    source: 'fallback' as const,
  };
}

function buildFallbackAdaptation(
  plan: StudyPlan,
  masteries: TopicMastery[],
  session: PracticeSession,
  language: Language
): { plan: StudyPlan; nudge: AdaptiveNudge } {
  const masteryByCode = new Map(masteries.map((m): [string, TopicMastery] => [m.topicCode, m]));
  const practicedInfo = TOPIC_BANK[session.topicCode];
  const practicedMastery = masteryByCode.get(session.topicCode);
  const practicedTopicName = practicedInfo?.topic ?? session.topicCode;

  const updatedItems: StudyPlanItem[] = plan.items.map((item): StudyPlanItem => {
    if (item.topicCode !== session.topicCode) return item;
    const nowStrong = practicedMastery?.status === 'strong';
    return {
      ...item,
      status: nowStrong ? 'done' : 'in_progress',
      reason: practicedMastery
        ? REASON_TEMPLATES[language][practicedMastery.status]
        : item.reason,
    };
  });

  const reordered = [...updatedItems]
    .sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (b.status === 'done' && a.status !== 'done') return -1;
      const ma = masteryByCode.get(a.topicCode);
      const mb = masteryByCode.get(b.topicCode);
      const statusA = ma ? STATUS_ORDER[ma.status] : 1;
      const statusB = mb ? STATUS_ORDER[mb.status] : 1;
      if (statusA !== statusB) return statusA - statusB;
      return (ma?.scorePct ?? 0) - (mb?.scorePct ?? 0);
    })
    .map((item, i) => ({ ...item, order: i }));

  const nextPending = reordered.find(
    (i) => i.status !== 'done' && i.topicCode !== session.topicCode
  );

  const correct = session.answers.filter((a) => a.correct).length;
  const total = session.answers.length;
  const scorePct = practicedMastery?.scorePct ?? session.scorePct;
  const improved = scorePct >= 70;
  const copy = NUDGE_COPY[language];

  const values = {
    topic: practicedTopicName,
    next: nextPending?.topic ?? '',
    correct: String(correct),
    total: String(total),
    scorePct: String(scorePct),
  };

  const whatChanged = fill(improved ? copy.whatChangedImproved : copy.whatChangedStayed, values);
  const why = fill(improved ? copy.whyImproved : copy.whyStayed, values);
  const next = fill(
    improved ? (nextPending ? copy.nextImproved : copy.nextNone) : copy.nextStayed,
    values
  );
  const message = fill(improved ? copy.messageImproved : copy.messageStayed, values);

  return {
    plan: { ...plan, items: reordered, generatedAt: Date.now(), source: 'fallback' as const },
    nudge: {
      message,
      whatChanged,
      why,
      next,
      generatedAt: Date.now(),
      source: 'fallback' as const,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

interface AiPlanResponse {
  items: { topicCode: string; reason: string }[];
}

export async function generateStudyPlan(
  profile: StudentProfile,
  masteries: TopicMastery[]
): Promise<StudyPlan> {
  try {
    const res = await callAgent<AiPlanResponse>({
      task: 'generate_plan',
      profile: {
        name: profile.name,
        grade: profile.grade,
        subjects: profile.subjects,
        language: profile.language,
        studyTime: profile.studyTime,
      },
      masteries,
    });

    if (!res?.items?.length) throw new Error('Empty AI plan response');

    const items: StudyPlanItem[] = res.items
      .map((raw, i) => {
        const info = TOPIC_BANK[raw.topicCode];
        if (!info) return null;
        return {
          topicCode: info.code,
          subject: info.subject,
          topic: info.topic,
          chapter: info.chapter,
          reason: raw.reason || REASON_TEMPLATES[profile.language].weak,
          order: i,
          status: 'pending' as const,
        };
      })
      .filter((x): x is StudyPlanItem => x !== null);

    if (!items.length) throw new Error('AI plan contained no known topics');

    return { generatedAt: Date.now(), language: profile.language, items, source: 'ai' as const };
  } catch {
    return buildFallbackPlan(profile, masteries);
  }
}

interface AiAdaptResponse {
  items: { topicCode: string; reason: string; status: StudyPlanItem['status'] }[];
  nudge: { message: string; whatChanged: string; why: string; next: string };
}

export async function adaptPlan(
  plan: StudyPlan,
  masteries: TopicMastery[],
  session: PracticeSession,
  language: Language
): Promise<{ plan: StudyPlan; nudge: AdaptiveNudge }> {
  try {
    const res = await callAgent<AiAdaptResponse>({
      task: 'adapt_plan',
      plan: plan.items,
      masteries,
      latestSession: session,
      language,
    });

    if (!res?.items?.length || !res.nudge?.message) throw new Error('Incomplete AI adaptation response');

    const items: StudyPlanItem[] = res.items
      .map((raw, i) => {
        const info = TOPIC_BANK[raw.topicCode];
        if (!info) return null;
        return {
          topicCode: info.code,
          subject: info.subject,
          topic: info.topic,
          chapter: info.chapter,
          reason: raw.reason,
          order: i,
          status: raw.status,
        };
      })
      .filter((x): x is StudyPlanItem => x !== null);

    if (!items.length) throw new Error('AI adaptation contained no known topics');

    return {
      plan: { generatedAt: Date.now(), language, items, source: 'ai' as const },
      nudge: {
        message: res.nudge.message,
        whatChanged: res.nudge.whatChanged,
        why: res.nudge.why,
        next: res.nudge.next,
        generatedAt: Date.now(),
        source: 'ai' as const,
      },
    };
  } catch {
    return buildFallbackAdaptation(plan, masteries, session, language);
  }
}

/** Re-exported for callers that need to blend a session into mastery before adapting. */
export { applySessionToMasteries };
