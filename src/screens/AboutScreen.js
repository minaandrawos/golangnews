import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const CONTACT_EMAIL = 'androidsoftwareengineer@gmail.com';
const GITHUB_URL = 'https://github.com/minaandrawos/golangnews';
const PRIVACY_POLICY_URL = 'https://minaandrawos.github.io/golangnews/privacy-policy.html';

export default function AboutScreen({ navigation }) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={22} color={colors.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={styles.body}>
            Have a question, feedback, or need support? Reach us by email:
          </Text>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
            accessibilityLabel={`Send email to ${CONTACT_EMAIL}`}
            accessibilityRole="link"
          >
            <Ionicons name="mail-outline" size={18} color={colors.accent} style={styles.linkIcon} />
            <Text style={styles.linkText}>{CONTACT_EMAIL}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Go News</Text>
          <Text style={styles.body}>
            Go News is a mobile news aggregator for the Go programming language community,
            surfacing the latest articles, videos, jobs, and community posts from golangnews.com.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Source Code</Text>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL(GITHUB_URL)}
            accessibilityLabel="View source code on GitHub"
            accessibilityRole="link"
          >
            <Ionicons name="logo-github" size={18} color={colors.accent} style={styles.linkIcon} />
            <Text style={styles.linkText}>github.com/minaandrawos/golangnews</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            accessibilityLabel="Privacy Policy"
            accessibilityRole="link"
          >
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.accent} style={styles.linkIcon} />
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      fontSize: 17,
      fontWeight: '700',
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 10,
    },
    body: {
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 22,
      marginBottom: 12,
    },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    linkIcon: {
      marginTop: 1,
    },
    linkText: {
      fontSize: 15,
      color: colors.accent,
      textDecorationLine: 'underline',
      flexShrink: 1,
    },
  });
}
