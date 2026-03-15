import { watchFeed } from '@/data/mockFeed';
import { FeedItem, UserPreferences } from '@/types';
import { computeWatchPreferenceScore } from '@/utils/preferenceMatch';

export const watchProvider = {
  async list(preferences?: UserPreferences): Promise<FeedItem[]> {
    return [...watchFeed]
      .map((item) => {
        const ranked = computeWatchPreferenceScore(item, preferences);
        return {
          ...item,
          description: [item.description, ranked.reasons.length ? `Why it fits: ${ranked.reasons.join(' • ')}` : null].filter(Boolean).join('\n\n'),
          tasteMatchPercent: Math.max(60, Math.min(98, Math.round(ranked.score)))
        };
      })
      .sort((a, b) => b.tasteMatchPercent - a.tasteMatchPercent || b.rating - a.rating);
  }
};
