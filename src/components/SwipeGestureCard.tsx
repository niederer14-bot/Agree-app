import React from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import { SwipeCard } from '@/components/SwipeCard';
import { FeedItem, SwipeValue } from '@/types';
import { theme } from '@/constants/theme';

type Props = {
  item: FeedItem;
  onSwipe: (value: SwipeValue) => void;
};

function resolveSwipe(dx: number, dy: number): SwipeValue | null {
  const threshold = 110;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > threshold) return 'like';
    if (dx < -threshold) return 'dislike';
  } else {
    if (dy < -threshold) return 'really_want';
    if (dy > threshold) return 'never';
  }
  return null;
}

export function SwipeGestureCard({ item, onSwipe }: Props) {
  const pan = React.useRef(new Animated.ValueXY()).current;
  const [overlayLabel, setOverlayLabel] = React.useState<string>('');

  const reset = React.useCallback(() => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 6
    }).start(() => setOverlayLabel(''));
  }, [pan]);

  const commit = React.useCallback((value: SwipeValue) => {
    const toValue =
      value === 'like'
        ? { x: 420, y: 0 }
        : value === 'dislike'
          ? { x: -420, y: 0 }
          : value === 'really_want'
            ? { x: 0, y: -420 }
            : { x: 0, y: 420 };

    Animated.timing(pan, {
      toValue,
      duration: 180,
      useNativeDriver: false
    }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      setOverlayLabel('');
      onSwipe(value);
    });
  }, [onSwipe, pan]);

  const responder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 6 || Math.abs(gesture.dy) > 6,
        onPanResponderMove: (_, gesture) => {
          pan.setValue({ x: gesture.dx, y: gesture.dy });
          const value = resolveSwipe(gesture.dx, gesture.dy);
          const label = value === 'like'
            ? 'LIKE'
            : value === 'dislike'
              ? 'NO'
              : value === 'really_want'
                ? 'REALLY WANT'
                : value === 'never'
                  ? 'NEVER'
                  : '';
          setOverlayLabel(label);
        },
        onPanResponderRelease: (_, gesture) => {
          const value = resolveSwipe(gesture.dx, gesture.dy);
          if (!value) return reset();
          commit(value);
        },
        onPanResponderTerminate: reset
      }),
    [commit, pan, reset]
  );

  const rotate = pan.x.interpolate({
    inputRange: [-220, 0, 220],
    outputRange: ['-10deg', '0deg', '10deg']
  });

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[styles.wrap, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }] }]}
    >
      {overlayLabel ? (
        <View style={styles.overlayBadge} pointerEvents="none">
          <Text style={styles.overlayText}>{overlayLabel}</Text>
        </View>
      ) : null}
      <SwipeCard item={item} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  overlayBadge: {
    position: 'absolute',
    top: 22,
    right: 22,
    zIndex: 2,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(13,27,42,0.72)',
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  overlayText: { color: theme.colors.white, fontWeight: '800', letterSpacing: 1 }
});
