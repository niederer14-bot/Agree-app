import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppStore } from '@/store/appStore';
import { theme } from '@/constants/theme';
import { authService } from '@/services/authService';

const STREAMERS = ['Netflix','HBO Max','Prime Video','Hulu','Disney+','Apple TV+'];
const CUISINES = ['american','mediterranean','italian','japanese','sushi','korean','vegetarian'];

function ToggleRow({ label, items, selected, onToggle }: { label: string; items: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <View style={styles.settingCard}>
      <Text style={styles.settingTitle}>{label}</Text>
      <View style={styles.wrap}>
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <Pressable key={item} style={[styles.pill, active && styles.pillActive]} onPress={() => onToggle(item)}>
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const user = useAppStore((s) => s.currentUser);
  const timer = useAppStore((s) => s.currentTimerSeconds);
  const setTimer = useAppStore((s) => s.setTimerSeconds);
  const primeCurrentUser = useAppStore((s) => s.primeCurrentUser);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
  const [city, setCity] = React.useState(user?.homeCity ?? 'Atlanta');
  const [price, setPrice] = React.useState(String(user?.preferences?.priceLevel ?? 2));
  const [radius, setRadius] = React.useState(String(user?.preferences?.radiusMiles ?? 10));
  const [notes, setNotes] = React.useState(user?.preferences?.dietaryNotes ?? '');
  const [streamingServices, setStreamingServices] = React.useState<string[]>(user?.preferences?.streamingServices ?? []);
  const [cuisinePreferences, setCuisinePreferences] = React.useState<string[]>(user?.preferences?.cuisinePreferences ?? []);

  React.useEffect(() => {
    setCity(user?.homeCity ?? 'Atlanta');
    setPrice(String(user?.preferences?.priceLevel ?? 2));
    setRadius(String(user?.preferences?.radiusMiles ?? 10));
    setNotes(user?.preferences?.dietaryNotes ?? '');
    setStreamingServices(user?.preferences?.streamingServices ?? []);
    setCuisinePreferences(user?.preferences?.cuisinePreferences ?? []);
  }, [user?.id]);

  const toggle = (list: string[], value: string, setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  const save = async () => {
    await authService.updateMockUser({
      homeCity: city,
      preferences: {
        ...user?.preferences,
        homeCity: city,
        dietaryNotes: notes,
        priceLevel: Number(price) || 2,
        radiusMiles: Number(radius) || 10,
        streamingServices,
        cuisinePreferences
      }
    });
    await primeCurrentUser();
    router.back();
  };

  const signOut = async () => {
    await authService.signOut();
    setCurrentUser(null);
    router.replace('/auth');
  };

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Mock-first development mode. No paid APIs required yet. Your local preferences drive ranking for testing.</Text>
          <View style={styles.hero}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{user?.initials ?? 'A'}</Text></View>
            <Text style={styles.name}>{user?.displayName ?? 'AGREE user'}</Text>
            <Text style={styles.meta}>{user?.email ?? 'No email set'} • {user?.homeCity ?? 'No city set'}</Text>
          </View>
          <View style={styles.settingCard}>
            <Text style={styles.settingTitle}>Home city</Text>
            <TextInput value={city} onChangeText={setCity} style={styles.input} placeholder='Atlanta' placeholderTextColor='rgba(255,255,255,0.35)' />
          </View>
          <View style={styles.settingCard}>
            <Text style={styles.settingTitle}>Default timer</Text>
            <View style={styles.timerRow}>
              <Pressable style={[styles.timerChip, timer === 30 && styles.activeChip]} onPress={() => setTimer(30)}><Text style={styles.timerText}>30 sec</Text></Pressable>
              <Pressable style={[styles.timerChip, timer === 120 && styles.activeChip]} onPress={() => setTimer(120)}><Text style={styles.timerText}>120 sec</Text></Pressable>
            </View>
          </View>
          <View style={styles.settingCard}>
            <Text style={styles.settingTitle}>Restaurant price level (1-4)</Text>
            <TextInput value={price} onChangeText={setPrice} keyboardType='number-pad' style={styles.input} />
          </View>
          <View style={styles.settingCard}>
            <Text style={styles.settingTitle}>Search radius miles</Text>
            <TextInput value={radius} onChangeText={setRadius} keyboardType='number-pad' style={styles.input} />
          </View>
          <View style={styles.settingCard}>
            <Text style={styles.settingTitle}>Dietary notes / bias words</Text>
            <TextInput value={notes} onChangeText={setNotes} style={styles.input} placeholder='healthy, vegetarian, low effort…' placeholderTextColor='rgba(255,255,255,0.35)' />
          </View>
          <ToggleRow label='Streaming services' items={STREAMERS} selected={streamingServices} onToggle={(value) => toggle(streamingServices, value, setStreamingServices)} />
          <ToggleRow label='Cuisine preferences' items={CUISINES} selected={cuisinePreferences} onToggle={(value) => toggle(cuisinePreferences, value, setCuisinePreferences)} />
          <Pressable style={styles.button} onPress={() => void save()}>
            <Text style={styles.buttonText}>Save profile</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => void signOut()}>
            <Text style={styles.secondaryButtonText}>Sign out</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: 24, gap: 16, paddingBottom: 48 },
  title: { color: theme.colors.white, fontSize: 30, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: theme.colors.softGray, lineHeight: 22, marginBottom: 6 },
  hero: { alignItems: 'center', padding: 24, borderRadius: theme.radius.xl, backgroundColor: 'rgba(255,255,255,0.06)' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: theme.colors.white, fontWeight: '800', fontSize: 26 },
  name: { color: theme.colors.white, fontSize: 24, fontWeight: '800', marginBottom: 6 },
  meta: { color: theme.colors.softGray, textAlign: 'center' },
  settingCard: { padding: 18, borderRadius: theme.radius.lg, backgroundColor: 'rgba(255,255,255,0.08)', gap: 10 },
  settingTitle: { color: theme.colors.white, fontWeight: '800' },
  timerRow: { flexDirection: 'row', gap: 10 },
  timerChip: { flex: 1, paddingVertical: 12, borderRadius: theme.radius.pill, backgroundColor: 'rgba(255,255,255,0.06)' },
  activeChip: { borderWidth: 1, borderColor: 'rgba(63,167,255,0.6)', backgroundColor: 'rgba(63,167,255,0.16)' },
  timerText: { color: theme.colors.white, textAlign: 'center', fontWeight: '700' },
  input: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: theme.colors.white, backgroundColor: 'rgba(255,255,255,0.06)' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: theme.radius.pill, backgroundColor: 'rgba(255,255,255,0.06)' },
  pillActive: { backgroundColor: theme.colors.white },
  pillText: { color: theme.colors.white, fontWeight: '700' },
  pillTextActive: { color: theme.colors.midnight },
  button: { marginTop: 6, backgroundColor: theme.colors.white, borderRadius: theme.radius.pill, padding: 16, alignItems: 'center' },
  buttonText: { color: theme.colors.midnight, fontWeight: '800' },
  secondaryButton: { borderRadius: theme.radius.pill, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  secondaryButtonText: { color: theme.colors.white, fontWeight: '700' }
});
