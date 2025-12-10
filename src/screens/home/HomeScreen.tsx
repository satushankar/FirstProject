import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { useEntryStore } from '../../store';
import { EntryCard } from '../../components/entry/EntryCard';
import { EntryService } from '../../services/entry/entryService';
import { MoodStorage } from '../../database/storage';
import { Entry, RootStackParamList, EntryType } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ENTRY_TYPES: { type: EntryType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: 'daily', label: 'Daily', icon: 'today-outline' },
  { type: 'weekly', label: 'Weekly', icon: 'calendar-outline' },
  { type: 'monthly', label: 'Monthly', icon: 'calendar-number-outline' },
  { type: 'story', label: 'Story', icon: 'book-outline' },
  { type: 'quick', label: 'Quick', icon: 'flash-outline' },
];

export function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { entries, setEntries, setLoading, isLoading } = useEntryStore();
  const [refreshing, setRefreshing] = useState(false);
  const [moodEmojis, setMoodEmojis] = useState<Record<string, string>>({});
  const [selectedType, setSelectedType] = useState<EntryType | 'all'>('all');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const allEntries = await EntryService.getAllEntries();
      setEntries(allEntries);
      await loadMoodEmojis(allEntries);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoodEmojis = async (entriesList: Entry[]) => {
    const emojis: Record<string, string> = {};
    for (const entry of entriesList) {
      if (entry.moodId) {
        const mood = await MoodStorage.getById(entry.moodId);
        if (mood) {
          emojis[entry.id] = mood.emoji;
        }
      }
    }
    setMoodEmojis(emojis);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  }, []);

  const handleEntryPress = (entry: Entry) => {
    navigation.navigate('EntryDetail', { entryId: entry.id });
  };

  const handleNewEntry = (type?: EntryType) => {
    navigation.navigate('EntryEditor', { type: type || 'daily' });
  };

  const filteredEntries =
    selectedType === 'all'
      ? entries
      : entries.filter((entry) => entry.type === selectedType);

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
          {getGreeting()}
        </Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Your Diary
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.profileButton,
          { backgroundColor: theme.colors.surface },
        ]}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderTypeFilter = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterChip,
          selectedType === 'all' && {
            backgroundColor: theme.colors.primary,
          },
          selectedType !== 'all' && {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
          },
        ]}
        onPress={() => setSelectedType('all')}
      >
        <Text
          style={[
            styles.filterChipText,
            {
              color:
                selectedType === 'all' ? '#FFFFFF' : theme.colors.textSecondary,
            },
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      {ENTRY_TYPES.map((item) => (
        <TouchableOpacity
          key={item.type}
          style={[
            styles.filterChip,
            selectedType === item.type && {
              backgroundColor: theme.colors.primary,
            },
            selectedType !== item.type && {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderWidth: 1,
            },
          ]}
          onPress={() => setSelectedType(item.type)}
        >
          <Ionicons
            name={item.icon}
            size={14}
            color={
              selectedType === item.type ? '#FFFFFF' : theme.colors.textSecondary
            }
            style={styles.filterChipIcon}
          />
          <Text
            style={[
              styles.filterChipText,
              {
                color:
                  selectedType === item.type
                    ? '#FFFFFF'
                    : theme.colors.textSecondary,
              },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Quick Add
      </Text>
      <View style={styles.quickActions}>
        {ENTRY_TYPES.slice(0, 4).map((item) => (
          <TouchableOpacity
            key={item.type}
            style={[
              styles.quickAction,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={() => handleNewEntry(item.type)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={theme.colors.primary}
            />
            <Text
              style={[styles.quickActionText, { color: theme.colors.text }]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="book-outline"
        size={64}
        color={theme.colors.textTertiary}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No entries yet
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}
      >
        Start writing your first diary entry
      </Text>
      <TouchableOpacity
        style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => handleNewEntry()}
      >
        <Ionicons name="add" size={20} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Create Entry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onPress={() => handleEntryPress(item)}
            moodEmoji={moodEmojis[item.id]}
          />
        )}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderQuickActions()}
            {renderTypeFilter()}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Entries
            </Text>
          </>
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => handleNewEntry()}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipIcon: {
    marginRight: 4,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
