import { CreateSessionInput, SessionRepository, SessionState, SessionSummary } from '@/services/contracts/backend';
import { feedRepository } from '@/services/feedRepository';
import { SessionParticipant, SwipeRecord } from '@/types';
import { loadStoredSessions, saveStoredSessions } from '@/services/storage/sessionStorage';
import { sessionChannel } from '@/services/realtime/sessionChannel';

let sessionsCache: Record<string, SessionState> | null = null;

function createCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function nowIso() {
  return new Date().toISOString();
}

async function getSessionsRecord() {
  if (!sessionsCache) {
    sessionsCache = await loadStoredSessions();
  }
  return sessionsCache;
}

async function persist(record: Record<string, SessionState>, sessionId?: string) {
  sessionsCache = record;
  await saveStoredSessions(record);
  if (sessionId && record[sessionId]) {
    sessionChannel.publish(sessionId, record[sessionId]);
  }
}

export const localSessionRepository: SessionRepository = {
  async createSession(input: CreateSessionInput): Promise<SessionSummary> {
    const record = await getSessionsRecord();
    const id = `sess_${Date.now()}`;
    const code = createCode();
    const allItems = await feedRepository.list(input.mode);
    const candidatePool = input.seededItemId
      ? [
          ...allItems.filter((item) => item.id === input.seededItemId),
          ...allItems.filter((item) => item.id !== input.seededItemId)
        ]
      : allItems;
    const summary: SessionSummary = {
      id,
      code,
      mode: input.mode,
      hostUserId: input.hostUserId,
      status: 'draft',
      timerSeconds: input.timerSeconds,
      createdAt: nowIso(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString()
    };
    record[id] = {
      session: summary,
      members: [{
        id: input.hostUserId,
        name: 'You',
        avatar: 'Y',
        joinedAt: nowIso(),
        isHost: true,
        hasFinished: false
      }],
      candidatePool,
      swipes: [],
      me: null
    };
    await persist(record, id);
    return summary;
  },
  async getSession(sessionId) {
    const record = await getSessionsRecord();
    return record[sessionId] ?? null;
  },
  async joinSession(sessionCode: string, participant: SessionParticipant) {
    const record = await getSessionsRecord();
    const state = Object.values(record).find((entry) => entry.session.code === sessionCode.toUpperCase());
    if (!state) {
      throw new Error('Session not found');
    }
    const exists = state.members.some((member) => member.id === participant.id);
    if (!exists) {
      state.members.push({ ...participant, joinedAt: nowIso(), isHost: state.session.hostUserId === participant.id, hasFinished: false });
    }
    state.session.status = 'active';
    state.me = {
      id: participant.id,
      displayName: participant.name,
      firstName: participant.name,
      initials: participant.avatar
    };
    await persist(record, state.session.id);
    return state;
  },
  async recordSwipe(sessionId: string, swipe: SwipeRecord) {
    const record = await getSessionsRecord();
    const state = record[sessionId];
    if (!state) return;
    state.swipes = [
      ...state.swipes.filter((entry) => !(entry.itemId === swipe.itemId && entry.participantId === swipe.participantId)),
      swipe
    ];
    await persist(record, sessionId);
  },
  async markParticipantFinished(sessionId: string, participantId: string) {
    const record = await getSessionsRecord();
    const state = record[sessionId];
    if (!state) return;
    state.members = state.members.map((member) => member.id === participantId ? { ...member, hasFinished: true } : member);
    if (state.members.length > 0 && state.members.every((member) => member.hasFinished)) {
      state.session.status = 'revealed';
    }
    await persist(record, sessionId);
  }
};
