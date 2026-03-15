export type ParsedSessionLink = {
  code: string | null;
  raw: string;
};

export function parseSessionCode(input: string): ParsedSessionLink {
  const raw = input.trim();
  if (!raw) return { code: null, raw };

  const direct = raw.match(/^[A-Za-z0-9]{4,8}$/);
  if (direct) return { code: direct[0].toUpperCase(), raw };

  const prefixed = raw.match(/join\/([A-Za-z0-9]{4,8})/i);
  if (prefixed?.[1]) return { code: prefixed[1].toUpperCase(), raw };

  const codeParam = raw.match(/[?&]code=([A-Za-z0-9]{4,8})/i);
  if (codeParam?.[1]) return { code: codeParam[1].toUpperCase(), raw };

  return { code: null, raw };
}
