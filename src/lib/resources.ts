import type { LearningResource, TopicInfo } from '@/types';

/**
 * Phase 3 foundation ONLY — there is no real resource provider/search API
 * connected yet, and this file must never fabricate one. Every call
 * resolves to an empty list. This is deliberate, not a placeholder bug:
 * showing a fake video/article link would be worse than showing nothing.
 *
 * Why this is shaped as an async function returning a Promise even though
 * it currently resolves instantly: so that a later phase can swap this
 * function's implementation for a real network call to a resource
 * provider/search API — keyed off the same `TopicInfo` (which already
 * carries the full Board -> Class -> Subject -> Chapter -> Topic identity)
 * — without needing to change anything in TopicLessonScreen.tsx or any
 * other caller. The UI is already written against this async contract.
 *
 * Consciously excluded from this call: any hardcoded/guessed URL for
 * YouTube, an article, or any other site. If that's ever added here
 * instead of via a real provider, it would violate the project's explicit
 * "never fabricate content" rule that has held since Phase 1.
 */
export async function getResourcesForTopic(_topic: TopicInfo): Promise<LearningResource[]> {
  return [];
}
