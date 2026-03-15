# AGREE mock-first plan

This repo can continue development without Google Places, Yelp, or TripAdvisor keys.

## What is already testable
- account-shaped local profile
- preference-driven watch ranking
- preference-driven restaurant ranking
- local session creation
- anonymous swiping
- winner + one backup reveal
- history and search flows

## Recommended next paid cutover order
1. TMDB provider swap
2. Google Places or alternative restaurant provider
3. Yelp enrichment
4. Supabase realtime session sync

## Development note
Keep all provider access behind repository interfaces so the UI does not care whether data is mock or live.
