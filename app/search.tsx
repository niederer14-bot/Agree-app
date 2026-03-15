import React from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '@/constants/theme';
import { TagPills } from '@/components/TagPills';
import { useAppStore } from '@/store/appStore';
import { feedRepository } from '@/services/feedRepository';
import { FeedItem } from '@/types';

function SearchCard({ item, onUse }: { item: FeedItem; onUse: () => void }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.subtitle ? <Text style={styles.cardSubtitle}>{item.subtitle}</Text> : null}
        <Text style={styles.cardMeta}>
          {item.mode === 'eat'
            ? `${item.tasteMatchPercent}% match • ${item.distanceMiles ?? 0} mi • ${item.etaMinutes ?? 0} min`
            : `${item.tasteMatchPercent}% match • ${item.streamingService ?? 'TMDB source pending'}`}
        </Text>
        <Pressable style={styles.useButton} onPress={onUse}>
          <Text style={styles.useButtonText}>Use in session</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function SearchScreen() {
  const activeMode = useAppStore((s) => s.activeMode);
  const setMode = useAppStore((s) => s.setMode);
  const setSearch = useAppStore((s) => s.setSearch);
  const search = useAppStore((s) => s.search);
  const setPinnedSearchResult = useAppStore((s) => s.setPinnedSearchResult);
  const [items, setItems] = React.useState<FeedItem[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    feedRepository.listTags(activeMode).then(setTags);
  }, [activeMode]);

  React.useEffect(() => {
    feedRepository.search(activeMode, search.query, search.selectedTag).then(setItems);
  }, [activeMode, search]);

  return (
    <LinearGradient colors={[theme.colors.midnight, theme.colors.deepNavy]} style={styles.bg}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Search before the swiping starts</Text>
          <Pressable onPress={() => router.back()}><Text style={styles.back}>Back</Text></Pressable>
        </View>
        <Text style={styles.subtitle}>Useful when somebody says “I don’t know, you pick” and then rejects everything.</Text>

        <View style={styles.modeRow}>
          <Pressable style={[styles.modeChip, activeMode === 'eat' && styles.modeChipActive]} onPress={() => setMode('eat')}>
            <Text style={[styles.modeText, activeMode === 'eat' && styles.modeTextActive]}>Eat</Text>
          </Pressable>
          <Pressable style={[styles.modeChip, activeMode === 'watch' && styles.modeChipActive]} onPress={() => setMode('watch')}>
            <Text style={[styles.modeText, activeMode === 'watch' && styles.modeTextActive]}>Watch</Text>
          </Pressable>
        </View>

        <TextInput
          value={search.query}
          onChangeText={(text) => setSearch({ query: text })}
          placeholder={activeMode === 'eat' ? 'Search places, moods, tags' : 'Search titles, moods, tags'}
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={styles.input}
        />

        <TagPills tags={tags} selectedTag={search.selectedTag} onSelect={(tag) => setSearch({ selectedTag: tag })} />

        <ScrollView contentContainerStyle={styles.results}>
          {items.map((item) => (
            <SearchCard
              key={item.id}
              item={item}
              onUse={() => {
                setPinnedSearchResult(item);
                router.push('/feed');
              }}
            />
          ))}
          {!items.length ? <Text style={styles.empty}>No results. Remarkable confidence for such thin criteria.</Text> : null}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1, padding: 20, gap: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: theme.colors.white, fontSize: 28, fontWeight: '800', maxWidth: '82%' },
  back: { color: theme.colors.white, fontWeight: '700' },
  subtitle: { color: theme.colors.softGray, lineHeight: 21 },
  modeRow: { flexDirection: 'row', gap: 10 },
  modeChip: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: theme.radius.pill, backgroundColor: 'rgba(255,255,255,0.06)' },
  modeChipActive: { backgroundColor: theme.colors.white },
  modeText: { color: theme.colors.white, fontWeight: '700' },
  modeTextActive: { color: theme.colors.midnight },
  input: { borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, color: theme.colors.white, backgroundColor: 'rgba(255,255,255,0.06)' },
  results: { gap: 14, paddingBottom: 40 },
  card: { borderRadius: 24, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.06)' },
  image: { width: '100%', height: 160 },
  cardBody: { padding: 16, gap: 8 },
  cardTitle: { color: theme.colors.white, fontWeight: '800', fontSize: 20 },
  cardSubtitle: { color: theme.colors.softGray, lineHeight: 20 },
  cardMeta: { color: theme.colors.accentBlue, fontWeight: '700' },
  useButton: { marginTop: 6, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 11, borderRadius: theme.radius.pill, backgroundColor: theme.colors.white },
  useButtonText: { color: theme.colors.midnight, fontWeight: '800' },
  empty: { color: theme.colors.softGray, paddingVertical: 24 }
});
