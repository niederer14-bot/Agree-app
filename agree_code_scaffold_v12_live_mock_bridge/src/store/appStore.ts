import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { feedRepository } from '@/services/feedRepository';
import { backendService } from '@/services/backendService';
import { sessionService } from '@/services/sessionService';
import { buildSessionResult } from '@/utils/scoring';
import { mockCircles } from '@/data/mockCircles';
import {
  AppSettings,
  Circle,
  FeedItem,
  Mode,
  SearchState,
  SessionHistoryEntry,
  SessionKind,
  SessionParticipant,
  SessionResult,
  SwipeRecord,
  SwipeValue,
  UserProfile,
  ActiveSessionMeta
} from '@/types';

type AppState = {
  hydrated: boolean;
  hasCompletedOnboarding: boolean;
  activeMode: Mode;
  sessionKind: SessionKind;
  selectedCircleId: string | null;
  currentTimerSeconds: number;
  participants: SessionParticipant[];
  swipes: SwipeRecord[];
  result: SessionResult | null;
  history: SessionHistoryEntry[];
  currentUser: UserProfile | null;
  search: SearchState;
  pinnedSearchResult: FeedItem | null;
  circles: Circle[];
  settings: AppSettings;
  activeSessionMeta: ActiveSessionMeta;
  setHydrated: () => void;
  setOnboardingComplete: () => void;
  setMode: (mode: Mode) => void;
  setSessionKind: (kind: SessionKind) => void;
  setSelectedCircleId: (circleId: string | null) => void;
  configureParticipantsForSession: () => Promise<void>;
  setTimerSeconds: (seconds: number) => void;
  setSearch: (payload: Partial<SearchState>) => void;
  setPinnedSearchResult: (item: FeedItem | null) => void;
  updateSettings: (payload: Partial<AppSettings>) => void;
  ensureActiveSession: () => Promise<ActiveSessionMeta>;
  joinSessionByCode: (sessionCode: string) => Promise<ActiveSessionMeta>;
  getFeed: (mode?: Mode) => Promise<FeedItem[]>;
  primeCurrentUser: () => Promise<void>;
  setCurrentUser: (user: UserProfile | null) => void;
  recordSwipe: (participantId: string, itemId: string, value: SwipeValue) => Promise<void>;
  finalizeSession: (items: FeedItem[]) => Promise<void>;
  resetSession: () => void;
};

const defaultParticipants: SessionParticipant[] = [
  { id: 'u1', name: 'Rachel', avatar: 'R' },
  { id: 'u2', name: 'Jeff', avatar: 'J' },
  { id: 'u3', name: 'Sam', avatar: 'S' }
];

const defaultSettings: AppSettings = {
  allowAnonymousReallyWant: true,
  defaultTimerSeconds: 120,
  quickieTimerSeconds: 30
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      hasCompletedOnboarding: false,
      activeMode: 'eat',
      sessionKind: 'solo',
      selectedCircleId: null,
      currentTimerSeconds: 120,
      participants: defaultParticipants,
      swipes: [],
      result: null,
      history: [],
      currentUser: null,
      search: { query: '', selectedTag: null },
      pinnedSearchResult: null,
      circles: mockCircles,
      settings: defaultSettings,
      activeSessionMeta: null,
      setHydrated: () => set({ hydrated: true }),
      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
      setMode: (mode) => set({ activeMode: mode, swipes: [], result: null, search: { query: '', selectedTag: null }, pinnedSearchResult: null, activeSessionMeta: null }),
      setSessionKind: (kind) => set({ sessionKind: kind, activeSessionMeta: null }),
      setSelectedCircleId: (circleId) => set({ selectedCircleId: circleId, activeSessionMeta: null }),
      configureParticipantsForSession: async () => {
        const me = get().currentUser ?? await backendService.auth.getCurrentUser();
        const self: SessionParticipant = {
          id: me?.id ?? 'user_local_1',
          name: me?.displayName ?? 'You',
          avatar: me?.initials?.slice(0, 1) ?? 'Y'
        };

        if (get().sessionKind === 'solo') {
          set({ participants: [self], currentUser: me ?? null });
          return;
        }

        const circleId = get().selectedCircleId ?? get().circles[0]?.id ?? null;
        const circle = get().circles.find((item) => item.id === circleId);
        if (!circle) {
          set({ participants: [self, ...defaultParticipants.slice(1)], currentUser: me ?? null });
          return;
        }

        const others = circle.memberIds
          .filter((id) => id !== self.id)
          .map((id, index) => {
            const fallback = defaultParticipants[(index + 1) % defaultParticipants.length];
            return { id, name: fallback?.name ?? `Member ${index + 1}`, avatar: fallback?.avatar ?? 'M' };
          });

        set({
          selectedCircleId: circle.id,
          participants: [self, ...others].slice(0, 6),
          currentUser: me ?? null
        });
      },
      setTimerSeconds: (seconds) => set({ currentTimerSeconds: seconds }),
      setSearch: (payload) => set((state) => ({ search: { ...state.search, ...payload } })),
      setPinnedSearchResult: (item) => set({ pinnedSearchResult: item }),
      updateSettings: (payload) => set((state) => ({ settings: { ...state.settings, ...payload } })),
      ensureActiveSession: async () => {
        const current = get().activeSessionMeta;
        if (current) return current;
        await get().configureParticipantsForSession();
        const host = get().currentUser ?? { id: 'user_local_1' };
        const created = await backendService.sessions.createSession({
          mode: get().activeMode,
          timerSeconds: get().currentTimerSeconds,
          hostUserId: host.id,
          seededItemId: get().pinnedSearchResult?.id ?? null
        });
        const meta = { sessionId: created.id, sessionCode: created.code, createdAt: created.createdAt, joined: false };
        set({ activeSessionMeta: meta });
        return meta;
      },
      joinSessionByCode: async (sessionCode) => {
        const me = get().currentUser ?? await backendService.auth.getCurrentUser();
        const participant: SessionParticipant = {
          id: me?.id ?? 'user_local_1',
          name: me?.displayName ?? 'AGREE User',
          avatar: me?.initials?.slice(0, 1) ?? 'A'
        };
        const state = await backendService.sessions.joinSession(sessionCode, participant);
        const meta = { sessionId: state.session.id, sessionCode: state.session.code, createdAt: state.session.createdAt, joined: true };
        set({
          activeMode: state.session.mode,
          sessionKind: 'group',
          currentUser: me ?? null,
          activeSessionMeta: meta,
          participants: state.members.length ? state.members.map(({ id, name, avatar }) => ({ id, name, avatar })) : defaultParticipants
        });
        return meta;
      },
      primeCurrentUser: async () => {
        const user = await backendService.auth.getCurrentUser();
        set({ currentUser: user });
      },
      setCurrentUser: (user) => set({ currentUser: user }),
      getFeed: async (mode) => {
        const resolvedMode = mode ?? get().activeMode;
        const items = await feedRepository.list(resolvedMode);
        const pinned = get().pinnedSearchResult;
        if (pinned && pinned.mode === resolvedMode) {
          return [pinned, ...items.filter((item) => item.id !== pinned.id)];
        }
        return items;
      },
      recordSwipe: async (participantId, itemId, value) => {
        const swipe = { participantId, itemId, value, createdAt: new Date().toISOString() };
        const meta = get().activeSessionMeta;
        if (meta?.sessionId) {
          await backendService.sessions.recordSwipe(meta.sessionId, swipe);
        }
        set((state) => ({
          swipes: [
            ...state.swipes.filter((s) => !(s.participantId === participantId && s.itemId === itemId)),
            swipe
          ]
        }));
      },
      finalizeSession: async (items) => {
        const result = buildSessionResult(items, get().swipes, get().participants);
        const historyEntry = await sessionService.createLocalHistoryEntry({ mode: get().activeMode, result });
        const meta = get().activeSessionMeta;
        const me = get().currentUser;
        if (meta?.sessionId && me?.id) {
          await backendService.sessions.markParticipantFinished(meta.sessionId, me.id);
        }
        set((state) => ({ result, history: [historyEntry, ...state.history].slice(0, 12) }));
      },
      resetSession: () => set((state) => ({
        swipes: [],
        result: null,
        currentTimerSeconds: state.settings.defaultTimerSeconds,
        pinnedSearchResult: null,
        activeSessionMeta: null
      }))
    }),
    {
      name: 'agree-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => state?.setHydrated()
    }
  )
);
