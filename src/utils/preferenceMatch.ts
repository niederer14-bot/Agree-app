import { FeedItem, UserPreferences } from '@/types';

export function computeEatPreferenceScore(item: FeedItem, prefs?: UserPreferences) {
  let score = item.tasteMatchPercent;
  const reasons: string[] = [];

  if (prefs?.cuisinePreferences?.length && item.cuisines?.length) {
    const overlap = item.cuisines.filter((c) => prefs.cuisinePreferences.includes(c));
    if (overlap.length) {
      score += overlap.length * 8;
      reasons.push(`matches ${overlap.join(', ')}`);
    }
  }

  if (prefs?.priceLevel && item.priceLevel) {
    const delta = Math.abs(item.priceLevel - prefs.priceLevel);
    score -= delta * 4;
    if (delta === 0) reasons.push('price fits');
  }

  if (prefs?.radiusMiles && item.distanceMiles !== undefined) {
    const overage = Math.max(0, item.distanceMiles - prefs.radiusMiles);
    score -= overage * 2.25;
    if (overage === 0) reasons.push('distance fits');
  }

  if (prefs?.openNowOnly) {
    if (item.isOpenNow === false) score -= 25;
    if (item.isOpenNow) reasons.push('open now');
  }

  if (prefs?.dietaryNotes?.toLowerCase().includes('vegetarian') && item.cuisines?.includes('vegetarian')) {
    score += 8;
    reasons.push('vegetarian friendly');
  }

  if (prefs?.dietaryNotes?.toLowerCase().includes('healthy') && (item.tags ?? []).includes('healthy')) {
    score += 6;
    reasons.push('healthy leaning');
  }

  score += item.rating * 2.2;
  if (item.etaMinutes) score -= item.etaMinutes / 8;

  return { score, reasons };
}

export function computeWatchPreferenceScore(item: FeedItem, prefs?: UserPreferences) {
  let score = item.tasteMatchPercent + item.rating;
  const reasons: string[] = [];

  if (prefs?.streamingServices?.length) {
    if (item.streamingService && prefs.streamingServices.includes(item.streamingService)) {
      score += 16;
      reasons.push(`on ${item.streamingService}`);
    } else {
      score -= 18;
    }
  }

  if ((item.tags ?? []).includes('movie')) {
    score += 1;
  }

  const tagMatches = (item.tags ?? []).filter((tag) =>
    (prefs?.cuisinePreferences ?? []).includes(tag)
  );
  if (tagMatches.length) {
    score += tagMatches.length * 2;
  }

  return { score, reasons };
}
