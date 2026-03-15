import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { useAppStore } from '@/store/appStore';

export default function CirclesScreen() {
  const circles = useAppStore((s) => s.circles);
  const participants = useAppStore((s) => s.participants);

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Circles</Text>
            <Text style={styles.subtitle}>Saved groups for when the same people keep refusing to decide.</Text>
          </View>
          <Pressable onPress={() => router.back()}><Text style={styles.back}>Back</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {circles.map((circle) => (
            <View key={circle.id} style={styles.card}>
              <Text style={styles.cardTitle}>{circle.name}</Text>
              <Text style={styles.note}>{circle.note}</Text>
              <View style={styles.members}>
                {circle.memberIds.map((memberId) => {
                  const member = participants.find((person) => person.id === memberId);
                  return member ? <Text key={memberId} style={styles.member}>{member.avatar}  {member.name}</Text> : null;
                })}
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
  back: { color: theme.colors.white, fontWeight: '700' },
  content: { gap: 14, paddingBottom: 30 },
  card: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 22, padding: 18, gap: 12 },
  cardTitle: { color: theme.colors.white, fontWeight: '800', fontSize: 20 },
  note: { color: theme.colors.softGray, lineHeight: 20 },
  members: { gap: 8 },
  member: { color: theme.colors.white, fontWeight: '700' }
});
