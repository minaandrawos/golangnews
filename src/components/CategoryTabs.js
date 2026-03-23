import React, { useRef, useMemo, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { CATEGORIES } from '../constants';
import { useTheme } from '../context/ThemeContext';

export default function CategoryTabs({ selected, onSelect }) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const scrollRef = useRef(null);
  const tabOffsets = useRef({});

  useEffect(() => {
    const offset = tabOffsets.current[selected];
    if (offset !== undefined) {
      scrollRef.current?.scrollTo({ x: Math.max(0, offset - 16), animated: true });
    }
  }, [selected]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.value;
          return (
            <TouchableOpacity
              key={cat.value}
              onPress={() => onSelect(cat.value)}
              onLayout={(e) => { tabOffsets.current[cat.value] = e.nativeEvent.layout.x; }}
              style={[styles.tab, isActive && styles.tabActive]}
              activeOpacity={0.7}
              accessibilityLabel={cat.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    wrapper: {
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder,
    },
    container: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
    },
    tab: {
      paddingHorizontal: 16,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      backgroundColor: 'transparent',
    },
    tabActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    tabText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    tabTextActive: {
      color: colors.background,
      fontWeight: '700',
    },
  });
}
