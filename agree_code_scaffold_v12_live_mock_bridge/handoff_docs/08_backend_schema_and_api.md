Backend Schema and API

Recommended stack
- React Native / Expo
- Supabase Auth
- PostgreSQL
- Supabase Realtime or WebSocket layer

Core tables
- users
- user_settings
- followers
- circles
- circle_members
- favorite_circles
- sessions
- session_participants
- session_candidates
- session_candidate_orders
- swipes
- session_results
- session_backup_result
- saved_items
- user_taste_features
- circle_taste_features
- restaurants
- restaurant_provider_ids
- restaurant_menu_cache
- restaurant_refresh_status
- media_titles
- media_genres
- media_streaming
- media_trailers
- item_popularity
- item_social_proof
- city_trending
- analytics_events
- taste_events

Core endpoints
- POST /auth/register
- POST /auth/login
- GET /home
- GET /feed/eat
- GET /feed/watch
- GET /discover
- GET /search
- GET /restaurants/:id
- GET /media/:id
- POST /sessions
- GET /sessions/:id
- POST /sessions/:id/swipe
- POST /sessions/:id/finalize
- POST /follow
- GET /comparison/:otherUserId
- POST /items/save
- GET /history
