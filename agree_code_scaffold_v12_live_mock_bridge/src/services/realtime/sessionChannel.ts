import { SessionState } from '@/services/contracts/backend';

type Listener = (payload: SessionState) => void;

const channels = new Map<string, Set<Listener>>();

export const sessionChannel = {
  subscribe(sessionId: string, listener: Listener) {
    const bucket = channels.get(sessionId) ?? new Set<Listener>();
    bucket.add(listener);
    channels.set(sessionId, bucket);
    return () => {
      const current = channels.get(sessionId);
      current?.delete(listener);
      if (current && current.size === 0) channels.delete(sessionId);
    };
  },
  publish(sessionId: string, state: SessionState) {
    channels.get(sessionId)?.forEach((listener) => listener(state));
  }
};
