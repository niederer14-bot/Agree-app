import { FeedItem, Mode } from '@/types';
import { eatProvider } from '@/providers/eatProvider';
import { watchProvider } from '@/providers/watchProvider';
import { authService } from '@/services/authService';

function scoreQuery(item: FeedItem, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const haystack = [item.title, item.subtitle, item.description, ...(item.tags ?? []), ...(item.cuisines ?? []), item.streamingService]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  if (!haystack.includes(q)) return -1;
  let score = 1;
  if (item.title.toLowerCase().includes(q)) score += 3;
  if ((item.tags ?? []).some((tag) => tag.toLowerCase().includes(q))) score += 2;
  if ((item.subtitle ?? '').toLowerCase().includes(q)) score += 1;
  if ((item.cuisines ?? []).some((cuisine) => cuisine.toLowerCase().includes(q))) score += 2;
  if ((item.streamingService ?? '').toLowerCase().includes(q)) score += 2;
  return score;
}

export const feedRepository = {
  async list(mode: Mode): Promise<FeedItem[]> {
    const user = await authService.getCurrentUser();
    const prefs = user?.preferences;
    return mode === 'eat' ? eatProvider.list(prefs) : watchProvider.list(prefs);
  },
  async search(mode: Mode, query: string, tag?: string | null): Promise<FeedItem[]> {
    const items = await this.list(mode);
    return items
      .filter((item) => !tag || (item.tags ?? []).includes(tag) || (item.cuisines ?? []).includes(tag))
      .map((item) => ({ item, score: scoreQuery(item, query) }))
      .filter((entry) => query.trim() ? entry.score >= 0 : true)
      .sort((a, b) => b.score - a.score || b.item.tasteMatchPercent - a.item.tasteMatchPercent || b.item.rating - a.item.rating)
      .map((entry) => entry.item);
  },
  async listTags(mode: Mode): Promise<string[]> {
    const items = await this.list(mode);
    return Array.from(new Set(items.flatMap((item) => [...(item.tags ?? []), ...(item.cuisines ?? [])]))).sort();
  }
};
