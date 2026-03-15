import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  onLongPress?: () => void;
};

export function RingButton({ label, onPress, onLongPress }: Props) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} delayLongPress={220}>
      <View style={styles.outer}>
        <View style={styles.middle}>
          <View style={styles.inner}>
            <Text style={styles.label}>{label}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)'
  },
  middle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inner: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.deepNavy
  },
  label: {
    color: theme.colors.white,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1.4
  }
});
