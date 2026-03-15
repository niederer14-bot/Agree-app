import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = {
  title: string;
  subtitle: string;
  imageUrl: string;
  onPress: () => void;
};

export function ModeTile({ title, subtitle, imageUrl, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <ImageBackground source={{ uri: imageUrl }} style={styles.card} imageStyle={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  card: { height: 220, justifyContent: 'flex-end' },
  image: { borderRadius: theme.radius.xl },
  overlay: {
    borderRadius: theme.radius.xl,
    padding: 20,
    minHeight: 100,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.overlayHeavy
  },
  title: { color: theme.colors.white, fontSize: 26, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: theme.colors.softGray, fontSize: 15, lineHeight: 21 }
});
