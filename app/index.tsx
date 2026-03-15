import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ModeTile } from '@/components/ModeTile';
import { SessionKindSwitch } from '@/components/SessionKindSwitch';
import { useAppStore } from '@/store/appStore';
import { theme } from '@/constants/theme';

export default function HomeScreen() {
  const setMode = useAppStore((s) => s.setMode);
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);
  const primeCurrentUser = useAppStore((s) => s.primeCurrentUser);
  const currentUser = useAppStore((s) => s.currentUser);
  const sessionKind = useAppStore((s) => s.sessionKind);
  const setSessionKind = useAppStore((s) => s.setSessionKind);
  const hydrated = useAppStore((s) => s.hydrated);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!hasCompletedOnboarding) {
      router.replace('/onboarding');
      return;
    }
    void primeCurrentUser();
  }, [hasCompletedOnboarding, hydrated, primeCurrentUser]);

  React.useEffect(() => {
    if (!hydrated || !hasCompletedOnboarding) return;
    if (currentUser === null) {
      router.replace('/auth');
    }
  }, [currentUser, hasCompletedOnboarding, hydrated]);

  const start = (mode: 'eat' | 'watch') => {
    setMode(mode);
    router.push('/session-setup');
  };

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.eyebrow}>AGREE</Text>
        <Text style={styles.title}>Pick the argument you want to end.</Text>
        <Text style={styles.subtitle}>Two choices. No clutter. A little dignity restored to dinner and movie night.</Text>
        {currentUser ? <Text style={styles.user}>Signed in as {currentUser.displayName}</Text> : <Text style={styles.user}>Sign in required</Text>}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Session type</Text>
          <Text style={styles.sectionText}>Run a fast solo decision or let a group anonymously swipe to a winner and one backup.</Text>
          <SessionKindSwitch value={sessionKind} onChange={setSessionKind} />
        </View>

        <ModeTile
          title="Agree on what to eat"
          subtitle="Dinner without the committee meeting"
          imageUrl="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
          onPress={() => start('eat')}
        />
        <ModeTile
          title="Agree on what to watch"
          subtitle="Movie night, now with less chaos"
          imageUrl="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"
          onPress={() => start('watch')}
        />

        <Pressable style={styles.actionsLink} onPress={() => router.push('/actions')}>
          <Text style={styles.actionsText}>More actions</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, padding: 20, gap: 14 },
  eyebrow: { color: theme.colors.accentBlue, fontSize: 14, fontWeight: '800', marginBottom: 4, letterSpacing: 1.6 },
  title: { color: theme.colors.white, fontSize: 34, fontWeight: '800', lineHeight: 38 },
  subtitle: { color: theme.colors.softGray, fontSize: 15, lineHeight: 22, marginBottom: 4 },
  user: { color: theme.colors.softGray, opacity: 0.8 },
  card: { padding: 16, borderRadius: theme.radius.xl, backgroundColor: 'rgba(255,255,255,0.06)', gap: 10 },
  sectionTitle: { color: theme.colors.white, fontWeight: '800', fontSize: 16 },
  sectionText: { color: theme.colors.softGray, lineHeight: 20 },
  actionsLink: { marginTop: 'auto', alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 16 },
  actionsText: { color: theme.colors.softGray, fontWeight: '700' }
});
