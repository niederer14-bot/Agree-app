import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

const actions = [
  { label: 'History', route: '/history' },
  { label: 'Profile', route: '/profile' },
  { label: 'Circles', route: '/circles' },
  { label: 'Invite', route: '/invite' },
  { label: 'Join', route: '/join' },
  { label: 'Compare', route: '/compare' },
  { label: 'Search', route: '/search' },
  { label: 'Settings', route: '/settings' },
  { label: 'Lobby', route: '/lobby' },
  { label: 'Share Card', route: '/share-card' }
] as const;

export default function ActionsScreen() {
  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Ring actions</Text>
        <Text style={styles.subtitle}>History, profile, search, compare, invite, circles, and settings are now wired. Enough to feel like a real app, which is refreshing.</Text>
        <View style={styles.grid}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              style={styles.actionChip}
              onPress={() => action.route ? router.push(action.route as never) : undefined}
            >
              <Text style={styles.actionText}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
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
  title: { color: theme.colors.white, fontSize: 30, fontWeight: '800', marginBottom: 10 },
  subtitle: { color: theme.colors.softGray, lineHeight: 22, marginBottom: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
  actionChip: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: theme.radius.pill, backgroundColor: 'rgba(255,255,255,0.08)' },
  actionText: { color: theme.colors.white, fontWeight: '700' },
  button: { marginTop: 'auto', backgroundColor: theme.colors.white, borderRadius: theme.radius.pill, padding: 16, alignItems: 'center' },
  buttonText: { color: theme.colors.midnight, fontWeight: '800' }
});
