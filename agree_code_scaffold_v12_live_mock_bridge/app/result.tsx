import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { useAppStore } from '@/store/appStore';
import { theme } from '@/constants/theme';

export default function ResultScreen() {
  const result = useAppStore((s) => s.result);
  const mode = useAppStore((s) => s.activeMode);
  const sessionKind = useAppStore((s) => s.sessionKind);
  const resetSession = useAppStore((s) => s.resetSession);
  const activeSessionMeta = useAppStore((s) => s.activeSessionMeta);

  if (!result) {
    return (
      <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.empty}>No result yet.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.kicker}>Reveal</Text>
          <Text style={styles.title}>{mode === 'eat' ? 'Dinner is settled.' : 'Movie night is settled.'}</Text>
          <Text style={styles.subtitle}>{sessionKind === 'solo' ? 'Your saved preferences shaped the final ranking.' : 'Anonymous group voting picked one winner and one backup.'}</Text>

          <View style={styles.card}>
            <Image source={{ uri: result.winner.imageUrl }} style={styles.image} />
            <Text style={styles.cardKicker}>Winner</Text>
            <Text style={styles.cardTitle}>{result.winner.title}</Text>
            <Text style={styles.cardMeta}>{result.winner.subtitle ?? 'Top-ranked option'}</Text>
          </View>

          {result.backup ? (
            <View style={styles.backupCard}>
              <Text style={styles.cardKicker}>Backup</Text>
              <Text style={styles.backupTitle}>{result.backup.title}</Text>
            </View>
          ) : null}

          <View style={styles.explainCard}>
            <Text style={styles.explainTitle}>{result.explanation.headline}</Text>
            <Text style={styles.metric}>Consensus {result.explanation.consensusPercent}% • Vetoes {result.explanation.vetoCount}</Text>
            {result.explanation.bullets.map((bullet) => (
              <Text key={bullet} style={styles.bullet}>• {bullet}</Text>
            ))}
          </View>

          {activeSessionMeta?.sessionCode ? <Text style={styles.code}>Session {activeSessionMeta.sessionCode}</Text> : null}
        </ScrollView>

        <View style={styles.row}>
          <Pressable style={styles.secondary} onPress={() => router.push('/compare')}>
            <Text style={styles.secondaryText}>Why it won</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={() => router.push('/share-card')}>
            <Text style={styles.secondaryText}>Share</Text>
          </Pressable>
          <Pressable style={styles.primary} onPress={() => { resetSession(); router.replace('/'); }}>
            <Text style={styles.primaryText}>Done</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, padding: 24, gap: 16 },
  content: { gap: 16, paddingBottom: 20 },
  kicker: { color: theme.colors.accentBlue, fontWeight: '800', letterSpacing: 1.5, fontSize: 12 },
  title: { color: theme.colors.white, fontSize: 30, fontWeight: '800' },
  subtitle: { color: theme.colors.softGray, lineHeight: 22 },
  card: { padding: 16, borderRadius: theme.radius.xl, backgroundColor: 'rgba(255,255,255,0.08)', gap: 10 },
  image: { width: '100%', height: 220, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)' },
  cardKicker: { color: theme.colors.accentBlue, fontWeight: '800', fontSize: 12 },
  cardTitle: { color: theme.colors.white, fontSize: 24, fontWeight: '800' },
  cardMeta: { color: theme.colors.softGray },
  backupCard: { padding: 16, borderRadius: theme.radius.xl, backgroundColor: 'rgba(255,255,255,0.05)', gap: 8 },
  backupTitle: { color: theme.colors.white, fontSize: 18, fontWeight: '800' },
  explainCard: { padding: 16, borderRadius: theme.radius.xl, backgroundColor: 'rgba(255,255,255,0.06)', gap: 8 },
  explainTitle: { color: theme.colors.white, fontSize: 18, fontWeight: '800' },
  metric: { color: theme.colors.softGray, fontWeight: '700' },
  bullet: { color: theme.colors.softGray, lineHeight: 20 },
  code: { color: theme.colors.softGray, letterSpacing: 1.4, fontSize: 12 },
  row: { flexDirection: 'row', gap: 10 },
  primary: { flex: 1, padding: 16, borderRadius: theme.radius.pill, backgroundColor: theme.colors.white, alignItems: 'center' },
  primaryText: { color: theme.colors.midnight, fontWeight: '800' },
  secondary: { flex: 1, padding: 16, borderRadius: theme.radius.pill, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  secondaryText: { color: theme.colors.white, fontWeight: '800' },
  empty: { color: theme.colors.white, fontSize: 20, fontWeight: '800' }
});
