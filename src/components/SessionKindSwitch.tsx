import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SessionKind } from '@/types';
import { theme } from '@/constants/theme';

export function SessionKindSwitch({ value, onChange }: { value: SessionKind; onChange: (next: SessionKind) => void }) {
  return (
    <View style={styles.wrap}>
      {(['solo', 'group'] as SessionKind[]).map((kind) => {
        const active = value === kind;
        return (
          <Pressable key={kind} style={[styles.chip, active && styles.chipActive]} onPress={() => onChange(kind)}>
            <Text style={[styles.text, active && styles.textActive]}>{kind === 'solo' ? 'Solo' : 'Group'}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 10 },
  chip: { flex: 1, paddingVertical: 12, borderRadius: theme.radius.pill, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  chipActive: { backgroundColor: theme.colors.white },
  text: { color: theme.colors.white, fontWeight: '800' },
  textActive: { color: theme.colors.midnight }
});
