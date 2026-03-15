import React from 'react';
import { backendService } from '@/services/backendService';
import { SessionState } from '@/services/contracts/backend';
import { sessionChannel } from '@/services/realtime/sessionChannel';

export function useSessionSync(sessionId: string | null, intervalMs = 1500) {
  const [state, setState] = React.useState<SessionState | null>(null);
  const [loading, setLoading] = React.useState(false);

  const refresh = React.useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    const next = await backendService.sessions.getSession(sessionId);
    setState(next);
    setLoading(false);
  }, [sessionId]);

  React.useEffect(() => {
    void refresh();
    if (!sessionId) return;
    const unsubscribe = backendService.mode === 'mock'
      ? sessionChannel.subscribe(sessionId, setState)
      : () => undefined;
    const timer = setInterval(() => void refresh(), intervalMs);
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [intervalMs, refresh, sessionId]);

  return { state, loading, refresh };
}
