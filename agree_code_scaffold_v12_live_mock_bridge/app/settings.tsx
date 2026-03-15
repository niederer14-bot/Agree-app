import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { useAppStore } from '@/store/appStore';

export default function SettingsScreen() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const setTimerSeconds = useAppStore((s) => s.setTimerSeconds);

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Session settings</Text>
          <Pressable onPress={() => router.back()}><Text style={styles.back}>Back</Text></Pressable>
        </View>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>Anonymous “really want”</Text>
              <Text style={styles.rowSubtitle}>Signal urgency without naming the culprit.</Text>
            </View>
            <Switch value={settings.allowAnonymousReallyWant} onValueChange={(value) => updateSettings({ allowAnonymousReallyWant: value })} />
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.rowTitle}>Default timer</Text>
          <View style={styles.buttons}>
            {[30, 60, 90, 120].map((seconds) => (
              <Pressable
                key={seconds}
                style={[styles.timerChip, settings.defaultTimerSeconds === seconds && styles.timerChipActive]}
                onPress={() => {
                  updateSettings({ defaultTimerSeconds: seconds });
                  setTimerSeconds(seconds);
                }}
              >
                <Text style={[styles.timerText, settings.defaultTimerSeconds === seconds && styles.timerTextActive]}>{seconds}s</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, padding: 20, gap: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: theme.colors.white, fontSize: 28, fontWeight: '800' },
  back: { color: theme.colors.white, fontWeight: '700' },
  card: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 22, padding: 18, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 14 },
  rowTextWrap: { flex: 1 },
  rowTitle: { color: theme.colors.white, fontSize: 17, fontWeight: '800' },
  rowSubtitle: { color: theme.colors.softGray, marginTop: 4, lineHeight: 20 },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  timerChip: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: theme.radius.pill, backgroundColor: 'rgba(255,255,255,0.08)' },
  timerChipActive: { backgroundColor: theme.colors.white },
  timerText: { color: theme.colors.white, fontWeight: '700' },
  timerTextActive: { color: theme.colors.midnight }
});
