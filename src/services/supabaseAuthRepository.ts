import { AuthRepository, UpdateProfileInput } from '@/services/contracts/backend';
import { UserProfile } from '@/types';
import { getSupabaseClient } from '@/services/supabase/client';

function buildInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2) || 'AG';
}

function toProfile(user: { id: string; email?: string; user_metadata?: Record<string, unknown>  } | any): UserProfile {
  const displayName = String(user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? 'AGREE User');
  const [firstName, ...rest] = displayName.split(' ');
  return {
    id: user.id,
    firstName: firstName || 'AGREE',
    lastName: rest.join(' ') || undefined,
    displayName,
    email: user.email,
    initials: buildInitials(displayName),
    homeCity: String(user?.user_metadata?.home_city ?? 'Atlanta')
  };
}

export const supabaseAuthRepository: AuthRepository = {
  async getCurrentUser() {
    const client = getSupabaseClient();
    const { data } = await client.auth.getUser();
    return data.user ? toProfile(data.user) : null;
  },
  async signInAnonymously(displayName) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signInAnonymously({
      options: displayName ? { data: { display_name: displayName } } : undefined
    });
    if (error) throw error;
    if (!data.user) throw new Error('Anonymous sign-in did not return a user.');
    return toProfile(data.user);
  },
  async signOut() {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },
  async updateProfile(profile: UpdateProfileInput) {
    const client = getSupabaseClient();
    const displayName = profile.displayName ?? [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() || undefined;
    const { data, error } = await client.auth.updateUser({
      data: {
        display_name: displayName,
        home_city: profile.homeCity
      }
    });
    if (error) throw error;
    if (!data.user) {
      const current = await this.getCurrentUser();
      if (!current) throw new Error('No authenticated user found.');
      return { ...current, ...profile, displayName: displayName ?? current.displayName };
    }
    return toProfile(data.user);
  }
};
