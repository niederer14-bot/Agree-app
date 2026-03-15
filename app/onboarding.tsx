import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '@/store/appStore';
import { theme } from '@/constants/theme';

const slides = [
  {
    eyebrow: 'Everybody has a take.',
    title: 'Nobody can decide.',
    body: 'AGREE turns group indecision into a swipe session with one winner and one backup.'
  },
  {
    eyebrow: 'Exactly two top-level choices.',
    title: 'Eat or watch.',
    body: 'Because adding more tabs to a simple problem is how apps become chores.'
  },
  {
    eyebrow: 'How it works.',
    title: 'Swipe. Score. Reveal.',
    body: 'Same candidate pool for everyone. Different order. Anonymous intensity signal. Winner in under two minutes.'
  }
];

export default function OnboardingScreen() {
  const [index, setIndex] = React.useState(0);
  const complete = useAppStore((s) => s.setOnboardingComplete);
  const setTimerSeconds = useAppStore((s) => s.setTimerSeconds);

  const next = () => {
    if (index < slides.length - 1) {
      setIndex((prev) => prev + 1);
      return;
    }
    setTimerSeconds(120);
    complete();
    router.replace('/');
  };

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.counter}>{index + 1} / {slides.length}</Text>
          <Text style={styles.eyebrow}>{slides[index].eyebrow}</Text>
          <Text style={styles.title}>{slides[index].title}</Text>
          <Text style={styles.body}>{slides[index].body}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.choiceRow}>
            <Pressable style={styles.choiceChip} onPress={() => setTimerSeconds(30)}>
              <Text style={styles.choiceText}>Quickie · 30 sec</Text>
            </Pressable>
            <Pressable style={styles.choiceChip} onPress={() => setTimerSeconds(120)}>
              <Text style={styles.choiceText}>Standard · 120 sec</Text>
            </Pressable>
          </View>
          <Pressable style={styles.button} onPress={next}>
            <Text style={styles.buttonText}>{index === slides.length - 1 ? 'Enter AGREE' : 'Next'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'space-between', padding: 24 },
  content: { flex: 1, justifyContent: 'center' },
  counter: { color: theme.colors.accentBlue, fontWeight: '700', marginBottom: 14 },
  eyebrow: { color: theme.colors.softGray, fontWeight: '700', marginBottom: 8 },
  title: { color: theme.colors.white, fontSize: 36, lineHeight: 40, fontWeight: '800', marginBottom: 16 },
  body: { color: theme.colors.softGray, fontSize: 16, lineHeight: 24 },
  footer: { gap: 12 },
  choiceRow: { flexDirection: 'row', gap: 10 },
  choiceChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  choiceText: { color: theme.colors.white, textAlign: 'center', fontWeight: '700', fontSize: 12 },
  button: { backgroundColor: theme.colors.white, borderRadius: theme.radius.pill, padding: 18, alignItems: 'center' },
  buttonText: { color: theme.colors.midnight, fontWeight: '800', fontSize: 16 }
});
