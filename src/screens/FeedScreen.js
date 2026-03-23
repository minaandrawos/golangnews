import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  BackHandler,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as rssParser from 'react-native-rss-parser';

import { HOME_URL, LINK_PREFIX } from '../constants';
import { useTheme } from '../context/ThemeContext';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';
import CategoryTabs from '../components/CategoryTabs';

const SKELETON_COUNT = 6;
const PRIVACY_POLICY_URL = 'https://minaandrawos.github.io/golangnews/privacy-policy.html';

const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
];

async function fetchUrl(url, signal) {
  if (Platform.OS !== 'web') return fetch(url, { signal });
  for (const proxy of CORS_PROXIES) {
    try {
      const res = await fetch(proxy + encodeURIComponent(url), { signal });
      if (res.ok) return res;
    } catch (err) {
      if (err.name === 'AbortError') throw err;
    }
  }
  throw new Error('Failed to reach feed. Check your connection and try again.');
}

function parseItems(rss) {
  return rss.items
    .map((item) => {
      const link = item.links && item.links.length > 0 ? item.links[0].url : null;
      if (!link || (!link.startsWith('http://') && !link.startsWith('https://'))) return null;
      return {
        key: item.id || link,
        title: item.title || '',
        published: item.published || '',
        description: item.description || '',
        link,
      };
    })
    .filter(Boolean);
}

export default function FeedScreen({ navigation }) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('index.xml');

  const tagHistory = useRef([]);
  const currentUrl = useRef(HOME_URL);
  const abortRef = useRef(null);

  const loadFeed = useCallback(async (url, isRefresh = false) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (!isRefresh) setLoading(true);
    setError(null);
    try {
      const response = await fetchUrl(url, controller.signal);
      if (controller.signal.aborted) return;
      if (!response.ok) throw new Error(`Network error: ${response.status}`);
      const text = await response.text();
      if (controller.signal.aborted) return;
      const rss = await rssParser.parse(text);
      if (controller.signal.aborted) return;
      setItems(parseItems(rss));
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Failed to load feed. Please try again.');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  const handleCategorySelect = useCallback((categoryValue) => {
    setSelectedCategory(categoryValue);
    tagHistory.current = [];
    const url = LINK_PREFIX + categoryValue;
    currentUrl.current = url;
    loadFeed(url);
  }, [loadFeed]);

  const handleTagPress = useCallback((tagUrl) => {
    tagHistory.current.push(currentUrl.current);
    currentUrl.current = tagUrl;
    loadFeed(tagUrl);
  }, [loadFeed]);

  useEffect(() => {
    loadFeed(HOME_URL);
  }, [loadFeed]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (tagHistory.current.length > 0) {
          const prev = tagHistory.current.pop();
          currentUrl.current = prev;
          loadFeed(prev);
          return true;
        }
        return false;
      });
      return () => backHandler.remove();
    }, [loadFeed])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFeed(currentUrl.current, true);
  }, [loadFeed]);

  const renderItem = useCallback(({ item }) => (
    <NewsCard
      item={item}
      onPress={() => navigation.navigate('Article', { link: item.link, title: item.title })}
      onTagPress={handleTagPress}
    />
  ), [navigation, handleTagPress]);

  const renderEmpty = () => {
    if (loading) return null;
    if (error) {
      return (
        <View style={styles.centerContent}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textSecondary} style={styles.stateIcon} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadFeed(currentUrl.current)}
            accessibilityLabel="Try again"
            accessibilityRole="button"
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.centerContent}>
        <Ionicons name="newspaper-outline" size={48} color={colors.textSecondary} style={styles.stateIcon} />
        <Text style={styles.emptyText}>No articles found</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.goDot} />
          <Text style={styles.headerTitle}>Go News</Text>
        </View>
        <Text style={styles.headerSubtitle}>Go news aggregator</Text>
      </View>

      <CategoryTabs selected={selectedCategory} onSelect={handleCategorySelect} />

      {loading ? (
        <FlatList
          data={Array.from({ length: SKELETON_COUNT }, (_, i) => ({ key: String(i) }))}
          renderItem={() => <SkeletonCard />}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            items.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={10}
          ListFooterComponent={() => (
            <TouchableOpacity
              onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
              accessibilityLabel="Privacy Policy"
              accessibilityRole="link"
            >
              <Text style={styles.privacyLink}>Privacy Policy</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}),
    },
    list: {
      flex: 1,
      ...(Platform.OS === 'web' ? { overflow: 'scroll' } : {}),
    },
    header: {
      backgroundColor: colors.headerBg,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 14,
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    goDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.headerText,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.headerText,
      letterSpacing: -0.3,
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.headerText,
      marginTop: 3,
      marginLeft: 18,
      letterSpacing: 0.5,
      opacity: 0.75,
    },
    listContent: {
      paddingTop: 10,
      paddingBottom: 30,
    },
    emptyList: {
      flex: 1,
    },
    centerContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
      paddingHorizontal: 32,
    },
    stateIcon: {
      marginBottom: 16,
    },
    errorText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    retryButton: {
      backgroundColor: colors.accent,
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingVertical: 10,
    },
    retryText: {
      color: colors.background,
      fontWeight: '700',
      fontSize: 14,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    privacyLink: {
      color: colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
      textDecorationLine: 'underline',
      paddingVertical: 16,
    },
  });
}
