import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';
import { SwipeGestureCard } from '@/components/SwipeGestureCard';
import { SwipeActions } from '@/components/SwipeActions';
import { ParticipantPills } from '@/components/ParticipantPills';
import { useAppStore } from '@/store/appStore';
import { theme } from '@/constants/theme';
import { FeedItem, SwipeValue } from '@/types';

export default function FeedScreen() {
  const mode = useAppStore((s) => s.activeMode);
  const sessionKind = useAppStore((s) => s.sessionKind);
  const participants = useAppStore((s) => s.participants);
  const recordSwipe = useAppStore((s) => s.recordSwipe);
  const finalizeSession = useAppStore((s) => s.finalizeSession);
  const currentTimerSeconds = useAppStore((s) => s.currentTimerSeconds);
  const getFeed = useAppStore((s) => s.getFeed);
  const ensureActiveSession = useAppStore((s) => s.ensureActiveSession);
  const activeSessionMeta = useAppStore((s) => s.activeSessionMeta);

  const [feed, setFeed] = React.useState<FeedItem[]>([]);
  const [index, setIndex] = React.useState(0);
  const [participantIndex, setParticipantIndex] = React.useState(0);
  const [remainingSeconds, setRemainingSeconds] = React.useState(currentTimerSeconds);

  React.useEffect(() => {
    void ensureActiveSession();
    void getFeed().then(setFeed);
  }, [ensureActiveSession, getFeed, mode]);

  React.useEffect(() => {
    setRemainingSeconds(currentTimerSeconds);
  }, [currentTimerSeconds]);

  React.useEffect(() => {
    if (!feed.length) return;
    if (remainingSeconds <= 0) {
      void finalizeSession(feed).then(() => router.replace('/result'));
      return;
    }

    const timer = setInterval(() => setRemainingSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds, feed, finalizeSession]);

  const item = feed[index];
  const participant = participants[participantIndex];

  const handleChoose = React.useCallback(async (value: SwipeValue) => {
    if (!item || !participant) return;
    await recordSwipe(participant.id, item.id, value);

    if (participantIndex < participants.length - 1) {
      setParticipantIndex((prev) => prev + 1);
      return;
    }

    if (index < feed.length - 1) {
      setParticipantIndex(0);
      setIndex((prev) => prev + 1);
      return;
    }

    void finalizeSession(feed).then(() => router.replace('/result'));
  }, [feed, finalizeSession, index, item, participant, participantIndex, participants.length, recordSwipe]);

  if (!item || !participant) {
    return (
      <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
        <SafeAreaView style={styles.safeAreaCentered}>
          <Text style={styles.mode}>Loading the argument you are about to end…</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.mode}>{mode === 'eat' ? 'Agree on what to eat' : 'Agree on what to watch'}</Text>
            <Text style={styles.progress}>Card {index + 1}/{feed.length} • {sessionKind === 'solo' ? 'solo mode' : `${participant.name}'s turn`} • {remainingSeconds}s</Text>
            {activeSessionMeta?.sessionCode ? <Text style={styles.code}>Session {activeSessionMeta.sessionCode}</Text> : null}
          </View>
          <Text style={styles.gestureHint}>← no · → like · ↑ really want · ↓ never</Text>
        </View>

        {sessionKind === 'group' ? <ParticipantPills participants={participants} activeId={participant.id} /> : null}

        <SwipeGestureCard item={item} onSwipe={handleChoose} />

        <View style={styles.actionsWrap}>
          <SwipeActions onChoose={(value) => { void handleChoose(value); }} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, padding: 18, gap: 14 },
  safeAreaCentered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: { gap: 8 },
  mode: { color: theme.colors.white, fontSize: 24, fontWeight: '800' },
  progress: { color: theme.colors.softGray, fontSize: 14 },
  code: { color: theme.colors.white, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  gestureHint: { color: theme.colors.softGray, fontSize: 12, opacity: 0.9 },
  actionsWrap: { paddingBottom: 6 }
});
