import { CreateSessionInput, SessionRepository, SessionState, SessionSummary } from '@/services/contracts/backend';
import { getSupabaseClient } from '@/services/supabase/client';
import { FeedItem, SessionParticipant, SwipeRecord } from '@/types';

function createCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function fromSessionRow(row: any): SessionSummary {
  return {
    id: row.id,
    code: row.code,
    mode: row.mode,
    hostUserId: row.host_user_id,
    status: row.status,
    timerSeconds: row.timer_seconds,
    createdAt: row.created_at,
    expiresAt: row.expires_at ?? undefined
  };
}

function toParticipant(row: any) {
  return {
    id: row.user_id,
    name: row.display_name,
    avatar: row.avatar,
    joinedAt: row.joined_at,
    isHost: Boolean(row.is_host),
    hasFinished: Boolean(row.has_finished)
  };
}

export const supabaseSessionRepository: SessionRepository = {
  async createSession(input: CreateSessionInput): Promise<SessionSummary> {
    const client = getSupabaseClient();
    const code = createCode();
    const payload = {
      code,
      mode: input.mode,
      host_user_id: input.hostUserId,
      status: 'draft',
      timer_seconds: input.timerSeconds,
      circle_id: input.circleId ?? null,
      seeded_item_id: input.seededItemId ?? null
    };
    const { data, error } = await client.from('sessions').insert(payload).select('*').single();
    if (error) throw error;
    await client.from('session_members').insert({
      session_id: data.id,
      user_id: input.hostUserId,
      display_name: 'You',
      avatar: 'Y',
      is_host: true,
      has_finished: false
    });
    return fromSessionRow(data);
  },
  async getSession(sessionId: string): Promise<SessionState | null> {
    const client = getSupabaseClient();
    const [{ data: session }, { data: members }, { data: swipes }, { data: items }] = await Promise.all([
      client.from('sessions').select('*').eq('id', sessionId).single(),
      client.from('session_members').select('*').eq('session_id', sessionId),
      client.from('swipes').select('*').eq('session_id', sessionId),
      client.from('session_candidates').select('*').eq('session_id', sessionId)
    ]);

    if (!session) return null;

    return {
      session: fromSessionRow(session),
      members: (members ?? []).map(toParticipant),
      candidatePool: (items ?? []).map((row: any) => row.payload as FeedItem),
      swipes: (swipes ?? []).map((row: any) => ({
        itemId: row.item_id,
        participantId: row.participant_id,
        value: row.value,
        createdAt: row.created_at
      })) as SwipeRecord[],
      me: null
    };
  },
  async joinSession(sessionCode: string, participant: SessionParticipant): Promise<SessionState> {
    const client = getSupabaseClient();
    const { data: session, error } = await client.from('sessions').select('*').eq('code', sessionCode.toUpperCase()).single();
    if (error || !session) throw error ?? new Error('Session not found');
    await client.from('session_members').upsert({
      session_id: session.id,
      user_id: participant.id,
      display_name: participant.name,
      avatar: participant.avatar,
      is_host: participant.id === session.host_user_id,
      has_finished: false
    }, { onConflict: 'session_id,user_id' });
    await client.from('sessions').update({ status: 'active' }).eq('id', session.id);
    const next = await this.getSession(session.id);
    if (!next) throw new Error('Unable to load joined session.');
    return next;
  },
  async recordSwipe(sessionId: string, swipe: SwipeRecord): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client.from('swipes').upsert({
      session_id: sessionId,
      participant_id: swipe.participantId,
      item_id: swipe.itemId,
      value: swipe.value,
      created_at: swipe.createdAt
    }, { onConflict: 'session_id,participant_id,item_id' });
    if (error) throw error;
  },
  async markParticipantFinished(sessionId: string, participantId: string): Promise<void> {
    const client = getSupabaseClient();
    await client.from('session_members').update({ has_finished: true }).eq('session_id', sessionId).eq('user_id', participantId);
    const { data: members } = await client.from('session_members').select('has_finished').eq('session_id', sessionId);
    if ((members ?? []).length > 0 && (members ?? []).every((member: any) => member.has_finished)) {
      await client.from('sessions').update({ status: 'revealed' }).eq('id', sessionId);
    }
  }
};
