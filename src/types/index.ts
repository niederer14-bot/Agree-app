export type Mode = 'eat' | 'watch';
export type SessionKind = 'solo' | 'group';

export type SwipeValue = 'like' | 'dislike' | 'really_want' | 'never' | 'skip';

export type FeedItem = {
  id: string;
  mode: Mode;
  title: string;
  imageUrl: string;
  rating: number;
  distanceMiles?: number;
  tasteMatchPercent: number;
  streamingService?: string;
  description?: string;
  subtitle?: string;
  etaMinutes?: number;
  tags?: string[];
  priceLevel?: number;
  isOpenNow?: boolean;
  cuisines?: string[];
  source?: 'mock' | 'tmdb' | 'google' | 'yelp' | 'tripadvisor';
};

export type SessionParticipant = {
  id: string;
  name: string;
  avatar: string;
};

export type SwipeRecord = {
  itemId: string;
  participantId: string;
  value: SwipeValue;
  createdAt: string;
};

export type SessionScore = {
  itemId: string;
  score: number;
  reallyWantCount: number;
  likeCount: number;
  vetoCount: number;
  consensusPercent: number;
};

export type SessionExplanation = {
  headline: string;
  bullets: string[];
  consensusPercent: number;
  vetoCount: number;
};

export type SessionResult = {
  winner: FeedItem;
  backup: FeedItem | null;
  reallyWantCount: number;
  participants: SessionParticipant[];
  scores: SessionScore[];
  explanation: SessionExplanation;
};

export type SessionHistoryEntry = {
  id: string;
  mode: Mode;
  createdAt: string;
  winnerTitle: string;
  backupTitle?: string;
  participantCount: number;
};

export type UserPreferences = {
  homeCity?: string;
  cuisinePreferences: string[];
  dietaryNotes?: string;
  priceLevel?: number;
  radiusMiles?: number;
  openNowOnly?: boolean;
  streamingServices: string[];
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName?: string;
  displayName: string;
  email?: string;
  initials: string;
  homeCity?: string;
  preferences?: UserPreferences;
};

export type SearchState = {
  query: string;
  selectedTag: string | null;
};

export type Circle = {
  id: string;
  name: string;
  memberIds: string[];
  note: string;
};

export type AppSettings = {
  allowAnonymousReallyWant: boolean;
  defaultTimerSeconds: number;
  quickieTimerSeconds: number;
};

export type ActiveSessionMeta = {
  sessionId: string;
  sessionCode: string;
  createdAt: string;
  joined: boolean;
} | null;
