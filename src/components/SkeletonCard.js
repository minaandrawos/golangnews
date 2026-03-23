import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const SkeletonBox = ({ width, height, style, shimmerColor }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: 6, backgroundColor: shimmerColor },
        { opacity },
        style,
      ]}
    />
  );
};

export default function SkeletonCard() {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <SkeletonBox width={90} height={11} shimmerColor={colors.cardBorder} style={{ marginBottom: 10 }} />
      <SkeletonBox width="95%" height={14} shimmerColor={colors.cardBorder} style={{ marginBottom: 6 }} />
      <SkeletonBox width="75%" height={14} shimmerColor={colors.cardBorder} style={{ marginBottom: 10 }} />
      <View style={styles.tagsRow}>
        <SkeletonBox width={52} height={22} shimmerColor={colors.cardBorder} style={{ borderRadius: 11, marginRight: 6 }} />
        <SkeletonBox width={44} height={22} shimmerColor={colors.cardBorder} style={{ borderRadius: 11 }} />
      </View>
      <SkeletonBox width={70} height={11} shimmerColor={colors.cardBorder} style={{ marginTop: 10 }} />
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
    },
    tagsRow: {
      flexDirection: 'row',
      marginTop: 4,
    },
  });
}
