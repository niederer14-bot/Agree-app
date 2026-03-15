import { env } from '@/config/env';
import { Mode } from '@/types';

export function buildInviteLink(code: string) {
  return `${env.deepLinkBaseUrl}/${code}`;
}

export function buildInviteCopy(code: string, mode: Mode) {
  const label = mode === 'eat' ? 'what to eat' : 'what to watch';
  return `Join my AGREE session and help settle ${label}. Code: ${code}. ${buildInviteLink(code)}`;
}
