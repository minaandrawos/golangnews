import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import FeedScreen from './src/screens/FeedScreen';
import ArticleScreen from './src/screens/ArticleScreen';
import AboutScreen from './src/screens/AboutScreen';
import { ThemeProvider, useTheme, useIsDark } from './src/context/ThemeContext';

const Stack = createStackNavigator();

function ErrorFallback({ error }) {
  const colors = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: colors.background }}>
      <Text style={{ color: colors.error || '#F85149', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
        Something went wrong
      </Text>
      <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center' }}>
        {error?.message}
      </Text>
    </View>
  );
}

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function buildNavTheme(colors, isDark) {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.headerBg,
      text: colors.textPrimary,
      border: colors.cardBorder,
      primary: colors.accent,
    },
  };
}

function AppNavigator() {
  const isDark = useIsDark();
  const colors = useTheme();
  const navTheme = buildNavTheme(colors, isDark);

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="Article" component={ArticleScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <AppNavigator />
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
