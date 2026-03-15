import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { useAppStore } from '@/store/appStore';
import { buildParticipantMatrix } from '@/services/sessionInsights';

const tone: Record<string, string> = {
  really_want: 'Really want',
  like: 'Like',
  skip: 'Skip',
  dislike: 'No',
  never: 'Never'
};

export default function CompareScreen() {
  const result = useAppStore((s) => s.result);
  const swipes = useAppStore((s) => s.swipes);
  const participants = useAppStore((s) => s.participants);
  const getFeed = useAppStore((s) => s.getFeed);
  const [matrix, setMatrix] = React.useState<ReturnType<typeof buildParticipantMatrix>>([]);

  React.useEffect(() => {
    getFeed().then((items) => setMatrix(buildParticipantMatrix(items, participants, swipes)));
  }, [getFeed, participants, swipes]);

  if (!result) {
    return (
      <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
        <SafeAreaView style={styles.safeArea}><Text style={styles.title}>Nothing to compare yet.</Text></SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Why {result.winner.title} won</Text>
            <Text style={styles.subtitle}>Consensus, veto resistance, and enough transparency to avoid a retrial.</Text>
          </View>
          <Pressable onPress={() => router.back()}><Text style={styles.back}>Back</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {result.scores.map((score, index) => {
            const entry = matrix.find((row) => row.itemId === score.itemId);
            return (
              <View key={score.itemId} style={[styles.scoreCard, index === 0 && styles.winnerCard]}>
                <Text style={styles.rank}>{index === 0 ? 'Winner' : index === 1 ? 'Backup' : `Option ${index + 1}`}</Text>
                <Text style={styles.cardTitle}>{entry?.title}</Text>
                <Text style={styles.scoreLine}>Score: {score.score} • Consensus: {score.consensusPercent}% • Really wants: {score.reallyWantCount} • Vetoes: {score.vetoCount}</Text>
                <View style={styles.rows}>
                  {entry?.rows.map((row) => (
                    <View key={`${score.itemId}_${row.participantId}`} style={styles.row}>
                      <Text style={styles.person}>{row.participantName}</Text>
                      <Text style={styles.vote}>{tone[row.value]}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { color: theme.colors.white, fontSize: 28, fontWeight: '800', maxWidth: '84%' },
  subtitle: { color: theme.colors.softGray, marginTop: 8 },
  back: { color: theme.colors.white, fontWeight: '700' },
  content: { gap: 14, paddingBottom: 40 },
  scoreCard: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 22, padding: 18, gap: 8 },
  winnerCard: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  rank: { color: theme.colors.accentBlue, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 12 },
  cardTitle: { color: theme.colors.white, fontWeight: '800', fontSize: 22 },
  scoreLine: { color: theme.colors.softGray, lineHeight: 20 },
  rows: { gap: 10, marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 10 },
  person: { color: theme.colors.white, fontWeight: '700' },
  vote: { color: theme.colors.softGray }
});
