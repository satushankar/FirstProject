import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useEntryStore, useAuthStore } from '../../store';

export function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { entries } = useEntryStore();
  const { lock } = useAuthStore();

  const stats = {
    totalEntries: entries.length,
    dailyEntries: entries.filter((e) => e.type === 'daily').length,
    weeklyEntries: entries.filter((e) => e.type === 'weekly').length,
    monthlyEntries: entries.filter((e) => e.type === 'monthly').length,
    stories: entries.filter((e) => e.type === 'story').length,
  };

  const handleLock = () => {
    lock();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Profile
          </Text>
        </View>

        <View
          style={[
            styles.profileCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.primaryLight },
            ]}
          >
            <Ionicons name="person" size={40} color={theme.colors.primary} />
          </View>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            Diary User
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
            Your personal diary
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Statistics
          </Text>
          <View style={styles.statsGrid}>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.totalEntries}
              </Text>
              <Text
                style={[styles.statLabel, { color: theme.colors.textSecondary }]}
              >
                Total Entries
              </Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.dailyEntries}
              </Text>
              <Text
                style={[styles.statLabel, { color: theme.colors.textSecondary }]}
              >
                Daily
              </Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.stories}
              </Text>
              <Text
                style={[styles.statLabel, { color: theme.colors.textSecondary }]}
              >
                Stories
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('Settings' as never)}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.colors.text}
            />
            <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
              Settings
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('MoodAnalytics' as never)}
          >
            <Ionicons
              name="analytics-outline"
              size={24}
              color={theme.colors.text}
            />
            <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
              Mood Analytics
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              styles.lockButton,
              { backgroundColor: theme.colors.error + '15' },
            ]}
            onPress={handleLock}
          >
            <Ionicons name="lock-closed" size={24} color={theme.colors.error} />
            <Text style={[styles.menuItemText, { color: theme.colors.error }]}>
              Lock App
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menuContainer: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  lockButton: {
    marginTop: 16,
    justifyContent: 'center',
  },
});
