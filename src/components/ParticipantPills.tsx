import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SessionParticipant } from '@/types';
import { theme } from '@/constants/theme';

type Props = {
  participants: SessionParticipant[];
  activeId?: string;
};

export function ParticipantPills({ participants, activeId }: Props) {
  return (
    <View style={styles.row}>
      {participants.map((participant) => {
        const active = participant.id === activeId;
        return (
          <View key={participant.id} style={[styles.pill, active && styles.activePill]}>
            <Text style={[styles.avatar, active && styles.activeAvatar]}>{participant.avatar}</Text>
            <Text style={[styles.name, active && styles.activeName]}>{participant.name}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  activePill: {
    backgroundColor: 'rgba(63,167,255,0.14)',
    borderColor: 'rgba(63,167,255,0.4)'
  },
  avatar: { color: theme.colors.white, fontWeight: '800' },
  activeAvatar: { color: theme.colors.accentBlue },
  name: { color: theme.colors.softGray, fontSize: 12, fontWeight: '700' },
  activeName: { color: theme.colors.white }
});
