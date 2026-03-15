import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '@/constants/theme';
import { useAppStore } from '@/store/appStore';
import { parseSessionCode } from '@/services/deeplink/sessionLinks';

export default function JoinScreen() {
  const [input, setInput] = React.useState('');
  const [error, setError] = React.useState('');
  const primeCurrentUser = useAppStore((s) => s.primeCurrentUser);
  const joinSessionByCode = useAppStore((s) => s.joinSessionByCode);

  React.useEffect(() => {
    primeCurrentUser();
  }, [primeCurrentUser]);

  const handleJoin = async () => {
    setError('');
    const parsed = parseSessionCode(input);
    if (!parsed.code) {
      setError('Enter a valid AGREE session code or invite link.');
      return;
    }
    try {
      await joinSessionByCode(parsed.code);
      router.replace('/lobby');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to join session.');
    }
  };

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Join a session</Text>
        <Text style={styles.subtitle}>Paste the code or full invite link. Both work. Civilization advances.</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Code or link</Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            autoCapitalize="characters"
            placeholder="ABC123 or agree://join/ABC123"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable style={styles.button} onPress={handleJoin}><Text style={styles.buttonText}>Join</Text></Pressable>
        </View>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>Back</Text></Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, padding: 24, gap: 18 },
  title: { color: theme.colors.white, fontSize: 30, fontWeight: '800' },
  subtitle: { color: theme.colors.softGray, lineHeight: 22 },
  card: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 24, padding: 18, gap: 12 },
  label: { color: theme.colors.softGray, textTransform: 'uppercase', letterSpacing: 2, fontSize: 12 },
  input: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: 'rgba(255,255,255,0.06)', color: theme.colors.white },
  error: { color: '#ffb4b4' },
  button: { backgroundColor: theme.colors.white, borderRadius: theme.radius.pill, padding: 16, alignItems: 'center' },
  buttonText: { color: theme.colors.midnight, fontWeight: '800' },
  back: { color: theme.colors.white, fontWeight: '700' }
});
