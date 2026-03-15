const readBoolean = (value: string | undefined, fallback = false) => {
  if (typeof value !== 'string') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

export const env = {
  useLiveBackend: readBoolean(process.env.EXPO_PUBLIC_USE_LIVE_BACKEND, false),
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://YOUR_PROJECT.supabase.co',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'YOUR_SUPABASE_ANON_KEY',
  deepLinkBaseUrl: process.env.EXPO_PUBLIC_DEEP_LINK_BASE_URL ?? 'https://agree.app/join',
  tmdbApiKey: process.env.EXPO_PUBLIC_TMDB_API_KEY ?? 'TMDB_API_KEY',
  placesProvider: process.env.EXPO_PUBLIC_PLACES_PROVIDER ?? 'mock',
  placesApiKey: process.env.EXPO_PUBLIC_PLACES_API_KEY ?? '',
  yelpApiKey: process.env.EXPO_PUBLIC_YELP_API_KEY ?? ''
} as const;

export type AppEnv = typeof env;
