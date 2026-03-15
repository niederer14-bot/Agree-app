import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = {
  tags: string[];
  selectedTag: string | null;
  onSelect: (tag: string | null) => void;
};

export function TagPills({ tags, selectedTag, onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable style={[styles.pill, !selectedTag && styles.active]} onPress={() => onSelect(null)}>
        <Text style={[styles.label, !selectedTag && styles.activeLabel]}>All</Text>
      </Pressable>
      {tags.map((tag) => (
        <Pressable key={tag} style={[styles.pill, selectedTag === tag && styles.active]} onPress={() => onSelect(tag)}>
          <Text style={[styles.label, selectedTag === tag && styles.activeLabel]}>{tag}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  active: { backgroundColor: 'rgba(255,255,255,0.96)' },
  label: { color: theme.colors.white, fontWeight: '700', fontSize: 13 },
  activeLabel: { color: theme.colors.midnight }
});
