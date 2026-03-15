import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { useAppStore } from '@/store/appStore';

export default function ShareCardScreen() {
  const result = useAppStore((s) => s.result);

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.eyebrow}>Share card</Text>
        <View style={styles.card}>
          <Text style={styles.brand}>AGREE</Text>
          <Text style={styles.title}>{result?.winner.title ?? 'Still deciding'}</Text>
          <Text style={styles.meta}>{result ? `Winner selected with one backup, because chaos only needs light supervision.` : 'No result yet. Quite ambitious to share nothing.'}</Text>
          {result?.backup ? <Text style={styles.backup}>Backup: {result.backup.title}</Text> : null}
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
  eyebrow: { color: theme.colors.softGray, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 },
  card: { marginTop: 40, padding: 24, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.07)', minHeight: 280, justifyContent: 'center' },
  brand: { color: theme.colors.softGray, marginBottom: 12, fontWeight: '800', letterSpacing: 3 },
  title: { color: theme.colors.white, fontSize: 34, fontWeight: '800', marginBottom: 12 },
  meta: { color: theme.colors.softGray, lineHeight: 22 },
  backup: { color: theme.colors.white, fontWeight: '700', marginTop: 18 },
  button: { marginTop: 'auto', backgroundColor: theme.colors.white, borderRadius: theme.radius.pill, padding: 16, alignItems: 'center' },
  buttonText: { color: theme.colors.midnight, fontWeight: '800' }
});
