import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupabaseClient } from '@/services/supabase/client';
import { UserProfile } from '@/types';

const USER_KEY = 'agree_mock_user';
const SESSION_KEY = 'agree_mock_session';

const defaultUser: UserProfile = {
  id: 'user_local_1',
  firstName: 'Rachel',
  displayName: 'Rachel',
  initials: 'R',
  email: 'rachel@example.com',
  homeCity: 'Atlanta',
  preferences: {
    homeCity: 'Atlanta',
    cuisinePreferences: ['american', 'mediterranean', 'italian'],
    dietaryNotes: '',
    priceLevel: 2,
    radiusMiles: 10,
    openNowOnly: false,
    streamingServices: ['Netflix', 'HBO Max', 'Prime Video']
  }
};

function buildInitials(name: string) {
  const bits = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return bits.map((bit) => bit[0]?.toUpperCase() ?? '').join('') || 'A';
}

async function ensureStoredUser() {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  }
  return { ...defaultUser, ...JSON.parse(raw) } as UserProfile;
}

export const authService = {
  async getCurrentUser(): Promise<UserProfile | null> {
    const signedIn = (await AsyncStorage.getItem(SESSION_KEY)) === 'true';
    if (!signedIn) return null;
    return ensureStoredUser();
  },
  async signInMock(input: { name: string; email?: string }): Promise<UserProfile> {
    const base = await ensureStoredUser();
    const profile: UserProfile = {
      ...base,
      firstName: input.name.trim().split(/\s+/)[0] || 'AGREE',
      displayName: input.name.trim() || 'AGREE User',
      email: input.email?.trim() || base.email,
      initials: buildInitials(input.name)
    };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile));
    await AsyncStorage.setItem(SESSION_KEY, 'true');
    return profile;
  },
  async sendMagicLink(email: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: undefined
      }
    });
    if (error) throw error;
  },
  async updateMockUser(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = (await ensureStoredUser()) as UserProfile;
    const next = { ...current, ...profile, preferences: { ...current.preferences, ...profile.preferences } } as UserProfile;
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(next));
    return next;
  },
  async signOut(): Promise<void> {
    await AsyncStorage.setItem(SESSION_KEY, 'false');
  },
  async ensureDevSignedIn(): Promise<UserProfile> {
    const current = await this.getCurrentUser();
    if (current) return current;
    return this.signInMock({ name: defaultUser.displayName, email: defaultUser.email });
  }
};
