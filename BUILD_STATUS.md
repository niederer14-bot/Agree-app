# AGREE Build Status

This package advances the codebase from the v10 auth-shell state.

## What changed
- Added real Supabase client creation using `@supabase/supabase-js`
- Added live backend environment variables using `EXPO_PUBLIC_*`
- Reworked auth screen for:
  - mock sign-in
  - Supabase email magic link
  - anonymous test entry
- Added a first-pass `supabaseSessionRepository`
- Switched backend service to live or mock repositories by environment flag
- Improved local session repository so the host is added immediately and updates publish through the in-app session channel
- Upgraded `useSessionSync` so mock sessions update instantly and live sessions can poll

## Remaining gaps
- `supabaseSessionRepository` expects these tables:
  - sessions
  - session_members
  - swipes
  - session_candidates
- Deep-link callback handling is still incomplete
- Live watch and restaurant providers are still mock-first
- No device-tested verification is included in this package

## Recommended next step
Initialize the GitHub repo with this package, then continue development from the repo rather than from zip handoffs.
