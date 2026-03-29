import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TAG_PREFIX } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { getDomain, getRelativeDate, parseTitle } from '../utils';

export default function NewsCard({ item, onPress, onTagPress }) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { cleanTitle, tags } = parseTitle(item.title || '');
  const domain = getDomain(item.link || '');
  const relDate = getRelativeDate(item.published);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={styles.card}
      accessibilityLabel={cleanTitle}
      accessibilityHint="Opens article"
      accessibilityRole="button"
    >
      {domain ? (
        <Text style={styles.domain} numberOfLines={1}>via {domain}</Text>
      ) : null}

      <Text style={styles.title} numberOfLines={4}>{cleanTitle}</Text>

      {tags.length > 0 && (
        <View style={styles.tagsRow}>
          {tags.map((tag, i) => (
            <TouchableOpacity
              key={`${tag}-${i}`}
              onPress={() => onTagPress && onTagPress(TAG_PREFIX + encodeURIComponent(tag))}
              style={styles.tag}
              activeOpacity={0.7}
              accessibilityLabel={`Browse tag ${tag}`}
              accessibilityRole="button"
            >
              <Text style={styles.tagText}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.metaRow}>
        {item.poster ? <Text style={styles.date}>posted by {item.poster}</Text> : null}
        {relDate ? <Text style={styles.date}>{relDate}</Text> : null}
      </View>
    </TouchableOpacity>
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
    domain: {
      fontSize: 11,
      color: colors.accent,
      fontWeight: '600',
      marginBottom: 6,
      textTransform: 'lowercase',
      letterSpacing: 0.2,
    },
    title: {
      fontSize: 15,
      color: colors.textPrimary,
      fontWeight: '500',
      lineHeight: 22,
      marginBottom: 8,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 8,
      gap: 6,
    },
    tag: {
      backgroundColor: colors.tagBg,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    tagText: {
      color: colors.tagText,
      fontSize: 12,
      fontWeight: '500',
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginTop: 2,
      gap: 4,
    },
    date: {
      fontSize: 11,
      color: colors.textSecondary,
    },
  });
}
