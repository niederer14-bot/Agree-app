# Codex build prompt

Continue implementation from the included scaffold as the base repo. Do not discard or regenerate the app from scratch.

## Source of truth
Use the attached handoff docs as product source of truth. The locked decisions override any assumptions.

## Already implemented in the scaffold
- Expo Router shell
- Cinematic home screen with exactly two top-level choices
- Onboarding
- Gesture-based swipe cards with fallback action buttons
- Mock provider abstraction for eat/watch feeds
- Mock auth/profile layer
- Persisted Zustand store
- Local session history
- Winner + exactly one backup reveal

## Non-negotiables
- Brand name: AGREE
- Tone: smart, witty, slightly sarcastic, confident
- Home entry: exactly two top-level choices
  - Agree on what to eat
  - Agree on what to watch
- Visual style: cinematic, dramatic, clean, uncluttered
- Restaurant cards must NOT show cuisine
- Full-screen swipe-first cards
- Compatibility display is percentage only
- Session model: same candidate pool for everyone, different order per user, independent pace
- Default timer: 120 seconds
- Quickie timer: 30 seconds
- Winner plus exactly one backup
- Anonymous “really want” signal allowed, but no identity reveal
- Watch source: TMDB only
- Restaurant launch scope: restaurants only
- Ring-based CTA on home, press-and-hold expands radial actions

## Next engineering tasks
1. Keep current repo structure and enhance it in place
2. Replace mock auth with Supabase auth and profile persistence
3. Add backend contracts and repository layer under `src/services`
4. Replace mock providers with live restaurant cache model and TMDB watch feed
5. Upgrade swipe gestures to `react-native-gesture-handler` + Reanimated if needed
6. Add realtime session state so participants can swipe independently
7. Build true radial hold menu and action routes
8. Add share cards, comparison pages, and search-to-session flow
9. Wire the included Supabase SQL migrations and replace local session repository with a real Postgres implementation
10. Add deep-link handling for `/join/:code` and session resume
11. Replace local realtime event bus with Supabase Realtime channels

## Guardrails
- Preserve theme tokens
- Preserve dark cinematic home layout
- Preserve result reveal pattern
- Preserve scoring semantics unless explicitly improving them without changing product behavior
- Keep code modular, production-oriented, and easy to swap from mock to live services
