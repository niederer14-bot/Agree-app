import { env } from '@/config/env';
import { AuthRepository, SessionRepository } from '@/services/contracts/backend';
import { supabaseAuthRepository } from '@/services/supabaseAuthRepository';
import { supabaseSessionRepository } from '@/services/supabaseSessionRepository';
import { localSessionRepository } from '@/services/localSessionRepository';
import { authService } from '@/services/authService';

const mockAuthRepository: AuthRepository = {
  getCurrentUser: authService.getCurrentUser,
  signInAnonymously: async (displayName) => ({
    ...(await authService.getCurrentUser()),
    id: 'user_local_1',
    firstName: displayName ?? 'AGREE',
    displayName: displayName ?? 'AGREE User',
    initials: (displayName ?? 'AG').slice(0, 2).toUpperCase()
  }),
  signOut: authService.signOut,
  updateProfile: async (profile) => {
    const current = await authService.ensureDevSignedIn();
    return authService.updateMockUser({
      ...current,
      firstName: profile.firstName ?? current.firstName,
      lastName: profile.lastName ?? current.lastName,
      displayName: profile.displayName ?? current.displayName,
      homeCity: profile.homeCity ?? current.homeCity
    });
  }
};

export const backendService: {
  auth: AuthRepository;
  sessions: SessionRepository;
  mode: 'live' | 'mock';
} = {
  auth: env.useLiveBackend ? supabaseAuthRepository : mockAuthRepository,
  sessions: env.useLiveBackend ? supabaseSessionRepository : localSessionRepository,
  mode: env.useLiveBackend ? 'live' : 'mock'
};
