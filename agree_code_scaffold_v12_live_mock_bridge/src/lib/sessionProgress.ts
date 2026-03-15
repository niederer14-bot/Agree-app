import { FeedItem, SessionParticipant, SwipeRecord } from '@/types';

export function getParticipantProgress(items: FeedItem[], participants: SessionParticipant[], swipes: SwipeRecord[]) {
  return participants.map((participant) => {
    const count = swipes.filter((entry) => entry.participantId === participant.id).length;
    const total = items.length || 1;
    return {
      participantId: participant.id,
      participantName: participant.name,
      completed: count,
      total,
      percent: Math.round((count / total) * 100)
    };
  });
}
