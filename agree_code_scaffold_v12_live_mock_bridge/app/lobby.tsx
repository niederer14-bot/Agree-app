import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { useAppStore } from '@/store/appStore';
import { getParticipantProgress } from '@/lib/sessionProgress';
import { useSessionSync } from '@/hooks/useSessionSync';

export default function LobbyScreen() {
  const participants = useAppStore((s) => s.participants);
  const swipes = useAppStore((s) => s.swipes);
  const getFeed = useAppStore((s) => s.getFeed);
  const activeSessionMeta = useAppStore((s) => s.activeSessionMeta);
  const { state: liveState } = useSessionSync(activeSessionMeta?.sessionId ?? null);
  const [progress, setProgress] = React.useState<ReturnType<typeof getParticipantProgress>>([]);

  React.useEffect(() => {
    getFeed().then((items) => setProgress(getParticipantProgress(items, participants, swipes)));
  }, [getFeed, participants, swipes]);

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Session lobby</Text>
            <Text style={styles.subtitle}>Everyone gets the same pool, different order, independent pace. Miracles do happen.</Text>
            {activeSessionMeta?.sessionCode ? <Text style={styles.code}>Code {activeSessionMeta.sessionCode}</Text> : null}
          </View>
          <Pressable onPress={() => router.back()}><Text style={styles.back}>Back</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {liveState?.session ? <View style={styles.statusCard}><Text style={styles.statusTitle}>Session status</Text><Text style={styles.statusText}>{liveState.session.status.toUpperCase()} • {liveState.members.length} joined</Text></View> : null}
          {progress.map((row) => (
            <View key={row.participantId} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.name}>{row.participantName}</Text>
                <Text style={styles.percent}>{row.percent}%</Text>
              </View>
              <Text style={styles.meta}>{row.completed} of {row.total} cards completed</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${row.percent}%` }]} />
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  title: { color: theme.colors.white, fontSize: 28, fontWeight: '800' },
  subtitle: { color: theme.colors.softGray, marginTop: 8, maxWidth: '84%' },
  code: { color: theme.colors.white, marginTop: 8, fontWeight: '700', letterSpacing: 2 },
  back: { color: theme.colors.white, fontWeight: '700' },
  content: { gap: 14, paddingBottom: 30 },
  statusCard: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: 16, gap: 6 },
  statusTitle: { color: theme.colors.softGray, textTransform: 'uppercase', letterSpacing: 2, fontSize: 12 },
  statusText: { color: theme.colors.white, fontWeight: '800' },
  card: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 22, padding: 18, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: theme.colors.white, fontWeight: '800', fontSize: 18 },
  percent: { color: theme.colors.white, fontWeight: '800' },
  meta: { color: theme.colors.softGray },
  progressTrack: { height: 10, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: 10, backgroundColor: theme.colors.white, borderRadius: 999 }
});

