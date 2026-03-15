# AGREE mock-first scaffold v10

This pass pushes the codebase further toward a realistic MVP while still avoiding paid restaurant APIs.

## New in v10
- Mock auth screen and sign-out flow
- Account-required shell now enforced in the app flow
- Preference-aware provider scoring moved into a reusable utility
- Feed descriptions now explain *why* an option was ranked highly
- Profile expanded with dietary notes / bias words
- Search tags now include cuisines and content tags together

## Development posture
This remains a mock-first Expo + React Native scaffold. The purpose is to complete as much product logic as possible before turning on live providers.

## Next high-value build targets
1. Replace mock auth with Supabase email magic link
2. Replace local session repository with Supabase tables + realtime
3. Add richer group progress and round completion logic
4. Add seeded solo recommendation history and favorites
5. Initialize the GitHub repo with this codebase as the true base repo
