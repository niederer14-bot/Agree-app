import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionState } from '@/services/contracts/backend';

const KEY = 'agree-local-sessions-v1';

export async function loadStoredSessions(): Promise<Record<string, SessionState>> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, SessionState>;
  } catch {
    return {};
  }
}

export async function saveStoredSessions(sessions: Record<string, SessionState>): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(sessions));
}
