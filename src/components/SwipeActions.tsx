import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SwipeValue } from '@/types';
import { theme } from '@/constants/theme';

const actions: { label: string; value: SwipeValue }[] = [
  { label: 'Never', value: 'never' },
  { label: 'No', value: 'dislike' },
  { label: 'Like', value: 'like' },
  { label: 'Really want', value: 'really_want' }
];

type Props = { onChoose: (value: SwipeValue) => void };

export function SwipeActions({ onChoose }: Props) {
  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <Pressable key={action.value} style={styles.button} onPress={() => onChoose(action.value)}>
          <Text style={styles.label}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  button: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)'
  },
  label: { color: theme.colors.white, fontWeight: '700', fontSize: 12 }
});
