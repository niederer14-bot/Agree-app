import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '@/constants/theme';
import { authService } from '@/services/authService';
import { useAppStore } from '@/store/appStore';
import { env } from '@/config/env';
import { backendService } from '@/services/backendService';

export default function AuthScreen() {
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
  const [name, setName] = React.useState('Rachel');
  const [email, setEmail] = React.useState('rachel@example.com');
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleMockContinue = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      const user = await authService.signInMock({ name, email });
      setCurrentUser(user);
      router.replace('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMagicLink = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      await authService.sendMagicLink(email);
      setMessage('Magic link sent. Open your email on this device, then return to AGREE.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to send magic link.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnonymous = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      const user = await backendService.auth.signInAnonymously(name.trim() || 'AGREE User');
      setCurrentUser(user);
      router.replace('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to continue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>AGREE</Text>
          <Text style={styles.title}>Create your account and save your taste profile.</Text>
          <Text style={styles.subtitle}>
            {env.useLiveBackend
              ? 'Live backend mode is enabled. Use email magic link for the MVP, or continue anonymously for internal testing.'
              : 'Mock mode is enabled. You can keep developing the full experience before connecting paid APIs.'}
          </Text>

          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Your name" placeholderTextColor="rgba(255,255,255,0.35)" />
          <TextInput value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" placeholderTextColor="rgba(255,255,255,0.35)" />

          {message ? <Text style={styles.message}>{message}</Text> : null}

          {!env.useLiveBackend ? (
            <Pressable style={styles.button} onPress={() => void handleMockContinue()} disabled={submitting}>
              {submitting ? <ActivityIndicator color={theme.colors.midnight} /> : <Text style={styles.buttonText}>Continue in mock mode</Text>}
            </Pressable>
          ) : (
            <>
              <Pressable style={styles.button} onPress={() => void handleMagicLink()} disabled={submitting}>
                {submitting ? <ActivityIndicator color={theme.colors.midnight} /> : <Text style={styles.buttonText}>Email me a magic link</Text>}
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => void handleAnonymous()} disabled={submitting}>
                <Text style={styles.secondaryButtonText}>Continue anonymously for testing</Text>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, padding: 24, justifyContent: 'center' },
  card: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 28, padding: 22, gap: 14 },
  eyebrow: { color: theme.colors.accentBlue, fontSize: 13, fontWeight: '800', letterSpacing: 1.8 },
  title: { color: theme.colors.white, fontSize: 30, fontWeight: '800', lineHeight: 34 },
  subtitle: { color: theme.colors.softGray, lineHeight: 22 },
  input: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: theme.colors.white, backgroundColor: 'rgba(255,255,255,0.06)' },
  message: { color: theme.colors.softGray, lineHeight: 20 },
  button: { marginTop: 6, backgroundColor: theme.colors.white, borderRadius: theme.radius.pill, padding: 16, alignItems: 'center', minHeight: 56, justifyContent: 'center' },
  buttonText: { color: theme.colors.midnight, fontWeight: '800' },
  secondaryButton: { borderRadius: theme.radius.pill, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  secondaryButtonText: { color: theme.colors.white, fontWeight: '700' }
});
