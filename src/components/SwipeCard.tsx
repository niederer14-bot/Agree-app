import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { FeedItem } from '@/types';
import { theme } from '@/constants/theme';

type Props = { item: FeedItem };

export function SwipeCard({ item }: Props) {
  return (
    <ImageBackground source={{ uri: item.imageUrl }} style={styles.card} imageStyle={styles.imageStyle}>
      <View style={styles.overlay}>
        <View>
          <Text style={styles.match}>{item.tasteMatchPercent}% match</Text>
          <Text style={styles.title}>{item.title}</Text>
          {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
          <Text style={styles.meta}>
            {item.mode === 'eat'
              ? `★ ${item.rating.toFixed(1)} • ${item.distanceMiles?.toFixed(1)} mi • ${item.etaMinutes ?? 20} min`
              : `★ ${item.rating.toFixed(1)} • ${item.streamingService}`}
          </Text>
        </View>
        {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minHeight: 520, justifyContent: 'flex-end' },
  imageStyle: { borderRadius: theme.radius.xl },
  overlay: {
    padding: 24,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.overlayHeavy,
    minHeight: 220,
    justifyContent: 'space-between'
  },
  match: { color: theme.colors.accentBlue, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  title: { color: theme.colors.white, fontSize: 34, fontWeight: '800', lineHeight: 38 },
  subtitle: { color: theme.colors.white, opacity: 0.92, marginTop: 8, fontSize: 15 },
  meta: { color: theme.colors.softGray, fontSize: 15, marginTop: 10 },
  description: { color: theme.colors.white, opacity: 0.88, marginTop: 20, fontSize: 15, lineHeight: 22 }
});
