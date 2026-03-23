import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { parseTitle } from '../utils';

// react-native-webview has no web support — open in new tab on web
let WebView;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

export default function ArticleScreen({ route, navigation }) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { link, title } = route.params ?? {};
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (link) window.open(link, '_blank');
      navigation.goBack();
    }
  }, [link, navigation]);

  const handleBack = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      navigation.goBack();
    }
  }, [canGoBack, navigation]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        navigation.goBack();
        return true;
      });
      return () => backHandler.remove();
    }, [canGoBack, navigation])
  );

  const displayTitle = title ? parseTitle(title).cleanTitle || 'Article' : 'Article';

  if (Platform.OS === 'web') return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={22} color={colors.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {displayTitle}
        </Text>
      </View>

      {isLoading && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${Math.round(loadProgress * 100)}%` }]} />
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: link }}
        originWhitelist={['https://*', 'http://*']}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        style={styles.webView}
        onNavigationStateChange={({ canGoBack: cgb }) => setCanGoBack(cgb)}
        onLoadProgress={({ nativeEvent }) => setLoadProgress(nativeEvent.progress)}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.headerBg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.headerBg,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder,
      gap: 8,
    },
    backBtn: {
      padding: 4,
    },
    headerTitle: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    progressContainer: {
      height: 2,
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    progressBar: {
      height: 2,
      backgroundColor: colors.accent,
    },
    webView: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
}
