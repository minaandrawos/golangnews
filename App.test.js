import React from 'react';
import { act } from 'react-test-renderer';
import renderer from 'react-test-renderer';

jest.mock('react-native-gesture-handler', () => ({}));
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  DefaultTheme: { colors: {} },
  DarkTheme: { colors: {} },
  useFocusEffect: () => {},
}));
jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: () => null,
  }),
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('expo-status-bar', () => ({ StatusBar: () => null }));
jest.mock('react-native-webview', () => ({ WebView: () => null }));
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('react-native-rss-parser', () => ({ parse: jest.fn(() => Promise.resolve({ items: [] })) }));

import App from './App';

it('renders without crashing', async () => {
  await act(async () => {
    renderer.create(<App />);
  });
});
