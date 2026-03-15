import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '@/store/appStore';
import { theme } from '@/constants/theme';

export default function HistoryScreen() {
  const history = useAppStore((s) => s.history);

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Decision history</Text>
        <Text style={styles.subtitle}>Recent winners, because somebody will absolutely claim the app picked badly last time.</Text>
        <ScrollView contentContainerStyle={styles.content}>
          {history.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No sessions yet</Text>
              <Text style={styles.emptyBody}>Run one round and the history will show here.</Text>
            </View>
          ) : history.map((entry) => (
            <View key={entry.id} style={styles.card}>
              <Text style={styles.mode}>{entry.mode === 'eat' ? 'EAT' : 'WATCH'}</Text>
              <Text style={styles.winner}>{entry.winnerTitle}</Text>
              <Text style={styles.meta}>{entry.participantCount} participants • {new Date(entry.createdAt).toLocaleString()}</Text>
              {entry.backupTitle ? <Text style={styles.backup}>Backup: {entry.backupTitle}</Text> : null}
            </View>
          ))}
        </ScrollView>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, padding: 24 },
  title: { color: theme.colors.white, fontSize: 30, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: theme.colors.softGray, lineHeight: 22, marginBottom: 18 },
  content: { gap: 12, paddingBottom: 16 },
  emptyCard: { padding: 18, borderRadius: theme.radius.lg, backgroundColor: 'rgba(255,255,255,0.08)' },
  emptyTitle: { color: theme.colors.white, fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptyBody: { color: theme.colors.softGray },
  card: { padding: 18, borderRadius: theme.radius.lg, backgroundColor: 'rgba(255,255,255,0.08)' },
  mode: { color: theme.colors.accentBlue, fontWeight: '800', fontSize: 12, marginBottom: 8 },
  winner: { color: theme.colors.white, fontSize: 22, fontWeight: '800', marginBottom: 6 },
  meta: { color: theme.colors.softGray, marginBottom: 6 },
  backup: { color: theme.colors.softGray },
  button: { marginTop: 14, backgroundColor: theme.colors.white, borderRadius: theme.radius.pill, padding: 16, alignItems: 'center' },
  buttonText: { color: theme.colors.midnight, fontWeight: '800' }
});
