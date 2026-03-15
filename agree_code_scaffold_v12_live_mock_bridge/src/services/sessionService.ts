import { Mode, SessionHistoryEntry, SessionResult } from '@/types';

export const sessionService = {
  async createLocalHistoryEntry(payload: { mode: Mode; result: SessionResult }): Promise<SessionHistoryEntry> {
    return {
      id: `session_${Date.now()}`,
      mode: payload.mode,
      createdAt: new Date().toISOString(),
      winnerTitle: payload.result.winner.title,
      backupTitle: payload.result.backup?.title,
      participantCount: payload.result.participants.length
    };
  }
};
