import { FeedItem, SessionParticipant, SwipeRecord, SwipeValue } from '@/types';

const labels: Record<SwipeValue, string> = {
  really_want: 'Really want',
  like: 'Like',
  skip: 'Skip',
  dislike: 'No',
  never: 'Absolutely not'
};

export function buildParticipantMatrix(items: FeedItem[], participants: SessionParticipant[], swipes: SwipeRecord[]) {
  return items.map((item) => ({
    itemId: item.id,
    title: item.title,
    rows: participants.map((participant) => {
      const swipe = swipes.find((entry) => entry.itemId === item.id && entry.participantId === participant.id);
      return {
        participantId: participant.id,
        participantName: participant.name,
        value: swipe?.value ?? 'skip',
        label: labels[swipe?.value ?? 'skip']
      };
    })
  }));
}
