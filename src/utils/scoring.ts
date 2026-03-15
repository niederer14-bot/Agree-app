import { FeedItem, SessionParticipant, SessionResult, SwipeRecord } from '@/types';

const weights: Record<SwipeRecord['value'], number> = {
  really_want: 3,
  like: 2,
  skip: 0,
  dislike: -1,
  never: -3
};

function summarizeWinner(
  winner: FeedItem,
  score: { reallyWantCount: number; likeCount: number; vetoCount: number; consensusPercent: number },
  participantCount: number
) {
  const bullets: string[] = [];

  if (score.consensusPercent >= 75) {
    bullets.push(`Strong consensus: ${score.consensusPercent}% of the available sentiment landed positive.`);
  } else if (score.consensusPercent >= 50) {
    bullets.push(`Best overall compromise: ${score.consensusPercent}% positive sentiment beat the rest of the field.`);
  } else {
    bullets.push(`It won on balance, not perfection — still the least controversial option in the stack.`);
  }

  if (score.reallyWantCount > 0) {
    bullets.push(`${score.reallyWantCount} ${score.reallyWantCount === 1 ? 'person marked it as a' : 'people marked it as'} “really want.”`);
  }

  if (winner.mode === 'eat') {
    if (winner.distanceMiles !== undefined) bullets.push(`Distance stayed reasonable at about ${winner.distanceMiles.toFixed(1)} miles.`);
    if (winner.priceLevel) bullets.push(`Price fit the current preference band at ${'$'.repeat(winner.priceLevel)}.`);
  } else {
    if (winner.streamingService) bullets.push(`It is available on ${winner.streamingService}, which reduces the usual “where is it streaming?” failure mode.`);
    bullets.push(`Its ranking stayed high because taste match and rating both held up.`);
  }

  if (score.vetoCount === 0 && participantCount > 1) {
    bullets.push('No hard vetoes. That alone is practically a civic achievement.');
  }

  return {
    headline: winner.mode === 'eat' ? 'Best dinner compromise' : 'Best watch-night compromise',
    bullets,
    consensusPercent: score.consensusPercent,
    vetoCount: score.vetoCount
  };
}

export function buildSessionResult(
  items: FeedItem[],
  swipes: SwipeRecord[],
  participants: SessionParticipant[]
): SessionResult {
  const participantCount = Math.max(participants.length, 1);

  const scores = items
    .map((item) => {
      const itemSwipes = swipes.filter((s) => s.itemId === item.id);
      const baseScore = itemSwipes.reduce((sum, s) => sum + weights[s.value], 0);
      const reallyWantCount = itemSwipes.filter((s) => s.value === 'really_want').length;
      const likeCount = itemSwipes.filter((s) => s.value === 'like' || s.value === 'really_want').length;
      const vetoCount = itemSwipes.filter((s) => s.value === 'never').length;
      const dislikeCount = itemSwipes.filter((s) => s.value === 'dislike').length;
      const positiveCount = itemSwipes.filter((s) => s.value === 'like' || s.value === 'really_want').length;
      const consensusPercent = Math.round((positiveCount / participantCount) * 100);

      const consensusBonus = likeCount * 1.5;
      const vetoPenalty = vetoCount * 4;
      const softPenalty = dislikeCount * 1.5;
      const qualityBonus = item.tasteMatchPercent / 18 + item.rating / 3;
      const totalScore = Number((baseScore + consensusBonus - vetoPenalty - softPenalty + qualityBonus).toFixed(2));

      return { item, score: totalScore, reallyWantCount, likeCount, vetoCount, consensusPercent };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.vetoCount - b.vetoCount ||
        b.consensusPercent - a.consensusPercent ||
        b.reallyWantCount - a.reallyWantCount ||
        b.item.tasteMatchPercent - a.item.tasteMatchPercent
    );

  const winnerScore = scores[0];

  return {
    winner: winnerScore.item,
    backup: scores[1]?.item ?? null,
    reallyWantCount: winnerScore.reallyWantCount,
    participants,
    scores: scores.map((entry) => ({
      itemId: entry.item.id,
      score: entry.score,
      reallyWantCount: entry.reallyWantCount,
      likeCount: entry.likeCount,
      vetoCount: entry.vetoCount,
      consensusPercent: entry.consensusPercent
    })),
    explanation: summarizeWinner(winnerScore.item, winnerScore, participantCount)
  };
}
