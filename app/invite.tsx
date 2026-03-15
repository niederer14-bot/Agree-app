import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { useAppStore } from '@/store/appStore';
import { buildInviteCopy, buildInviteLink } from '@/services/shareService';

export default function InviteScreen() {
  const activeMode = useAppStore((s) => s.activeMode);
  const ensureActiveSession = useAppStore((s) => s.ensureActiveSession);
  const [sessionCode, setSessionCode] = React.useState<string>('');

  React.useEffect(() => {
    ensureActiveSession().then((meta) => meta?.sessionCode && setSessionCode(meta.sessionCode));
  }, [ensureActiveSession]);

  const message = sessionCode
    ? buildInviteCopy(sessionCode, activeMode)
    : 'Preparing a session code. Dramatic, yes. Temporary, also yes.';

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Invite copy</Text>
        <Text style={styles.subtitle}>Now backed by a local session code and a proper deep-link shape, so the handoff is no longer pretending.</Text>
        <View style={styles.messageCard}>
          <Text style={styles.codeLabel}>Session code</Text>
          <Text style={styles.code}>{sessionCode || '…'}</Text>
          <Text style={styles.message}>{message}</Text>
          {sessionCode ? <Text style={styles.link}>{buildInviteLink(sessionCode)}</Text> : null}
        </View>
        <View style={styles.row}><Pressable style={[styles.button, styles.secondary]} onPress={() => router.push('/join')}><Text style={[styles.buttonText, styles.secondaryText]}>Test join</Text></Pressable><Pressable style={styles.button} onPress={() => router.back()}><Text style={styles.buttonText}>Done</Text></Pressable></View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, padding: 20, gap: 16 },
  title: { color: theme.colors.white, fontSize: 28, fontWeight: '800' },
  subtitle: { color: theme.colors.softGray, lineHeight: 21 },
  messageCard: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 22, padding: 18, gap: 10 },
  codeLabel: { color: theme.colors.softGray, textTransform: 'uppercase', letterSpacing: 2, fontSize: 12 },
  code: { color: theme.colors.white, fontSize: 28, fontWeight: '800', letterSpacing: 4 },
  message: { color: theme.colors.white, lineHeight: 24, fontSize: 16 },
  link: { color: theme.colors.softGray },
  row: { marginTop: 'auto', flexDirection: 'row', gap: 12 },
  button: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: theme.radius.pill, backgroundColor: theme.colors.white },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  buttonText: { color: theme.colors.midnight, fontWeight: '800' },
  secondaryText: { color: theme.colors.white }
});
