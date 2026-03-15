import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SessionKindSwitch } from '@/components/SessionKindSwitch';
import { useAppStore } from '@/store/appStore';
import { theme } from '@/constants/theme';

export default function SessionSetupScreen() {
  const activeMode = useAppStore((s) => s.activeMode);
  const sessionKind = useAppStore((s) => s.sessionKind);
  const setSessionKind = useAppStore((s) => s.setSessionKind);
  const circles = useAppStore((s) => s.circles);
  const selectedCircleId = useAppStore((s) => s.selectedCircleId);
  const setSelectedCircleId = useAppStore((s) => s.setSelectedCircleId);
  const configureParticipantsForSession = useAppStore((s) => s.configureParticipantsForSession);
  const participants = useAppStore((s) => s.participants);

  const handleStart = async () => {
    await configureParticipantsForSession();
    router.push('/feed');
  };

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>{activeMode === 'eat' ? 'Set up dinner' : 'Set up movie night'}</Text>
          <Text style={styles.subtitle}>Mock-first mode is now wired for both solo and group sessions.</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>How are you deciding?</Text>
            <SessionKindSwitch value={sessionKind} onChange={setSessionKind} />
            <Text style={styles.note}>{sessionKind === 'solo' ? 'Solo uses your account preferences only.' : 'Group keeps voting anonymous and calculates one winner plus one backup.'}</Text>
          </View>

          {sessionKind === 'group' ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Circle</Text>
              <View style={styles.list}>
                {circles.map((circle) => {
                  const active = selectedCircleId === circle.id || (!selectedCircleId && circles[0]?.id === circle.id);
                  return (
                    <Pressable key={circle.id} style={[styles.circleCard, active && styles.circleCardActive]} onPress={() => setSelectedCircleId(circle.id)}>
                      <Text style={styles.circleName}>{circle.name}</Text>
                      <Text style={styles.circleNote}>{circle.note}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Participants preview</Text>
            {participants.map((person) => (
              <Text key={person.id} style={styles.person}>• {person.name}</Text>
            ))}
          </View>

          <Pressable style={styles.primaryButton} onPress={() => void handleStart()}>
            <Text style={styles.primaryText}>Start swiping</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: 24, gap: 16, paddingBottom: 40 },
  title: { color: theme.colors.white, fontSize: 30, fontWeight: '800' },
  subtitle: { color: theme.colors.softGray, lineHeight: 22 },
  card: { padding: 16, borderRadius: theme.radius.xl, backgroundColor: 'rgba(255,255,255,0.06)', gap: 10 },
  cardTitle: { color: theme.colors.white, fontWeight: '800', fontSize: 16 },
  note: { color: theme.colors.softGray, lineHeight: 20 },
  list: { gap: 10 },
  circleCard: { padding: 14, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)' },
  circleCardActive: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  circleName: { color: theme.colors.white, fontWeight: '800', marginBottom: 4 },
  circleNote: { color: theme.colors.softGray },
  person: { color: theme.colors.white },
  primaryButton: { marginTop: 8, backgroundColor: theme.colors.white, borderRadius: theme.radius.pill, padding: 16, alignItems: 'center' },
  primaryText: { color: theme.colors.midnight, fontWeight: '800' }
});
