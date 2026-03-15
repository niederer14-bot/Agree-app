import { FeedItem, Mode, SessionParticipant, SwipeRecord, UserProfile } from '@/types';

export type SessionStatus = 'draft' | 'active' | 'revealed' | 'closed';

export type SessionSummary = {
  id: string;
  code: string;
  mode: Mode;
  hostUserId: string;
  status: SessionStatus;
  timerSeconds: number;
  createdAt: string;
  expiresAt?: string;
};

export type SessionMember = SessionParticipant & {
  joinedAt: string;
  isHost?: boolean;
  hasFinished?: boolean;
};

export type SessionState = {
  session: SessionSummary;
  members: SessionMember[];
  candidatePool: FeedItem[];
  swipes: SwipeRecord[];
  me?: UserProfile | null;
};

export type CreateSessionInput = {
  mode: Mode;
  timerSeconds: number;
  hostUserId: string;
  circleId?: string | null;
  seededItemId?: string | null;
};

export type UpdateProfileInput = Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'displayName' | 'homeCity'>>;

export interface AuthRepository {
  getCurrentUser(): Promise<UserProfile | null>;
  signInAnonymously(displayName?: string): Promise<UserProfile>;
  signOut(): Promise<void>;
  updateProfile(profile: UpdateProfileInput): Promise<UserProfile>;
}

export interface SessionRepository {
  createSession(input: CreateSessionInput): Promise<SessionSummary>;
  getSession(sessionId: string): Promise<SessionState | null>;
  joinSession(sessionCode: string, participant: SessionParticipant): Promise<SessionState>;
  recordSwipe(sessionId: string, swipe: SwipeRecord): Promise<void>;
  markParticipantFinished(sessionId: string, participantId: string): Promise<void>;
}
