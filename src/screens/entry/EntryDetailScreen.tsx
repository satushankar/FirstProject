import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { EntryService } from '../../services/entry/entryService';
import { useEntryStore } from '../../store';
import { Entry, Mood, Location, Weather, RootStackParamList } from '../../types';
import { formatEntryDate, formatTime, getWordCount, calculateReadingTime } from '../../utils/helpers';

type RouteProps = RouteProp<RootStackParamList, 'EntryDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function EntryDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { deleteEntry } = useEntryStore();
  const { entryId } = route.params;

  const [entry, setEntry] = useState<Entry | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [entryId]);

  const loadEntry = async () => {
    setLoading(true);
    const result = await EntryService.getEntryWithDetails(entryId);
    if (result) {
      setEntry(result.entry);
      setMood(result.mood);
      setLocation(result.location);
      setWeather(result.weather);
    }
    setLoading(false);
  };

  const handleEdit = () => {
    navigation.navigate('EntryEditor', { entryId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await EntryService.deleteEntry(entryId);
            deleteEntry(entryId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (loading || !entry) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.colors.textSecondary }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
            {formatEntryDate(entry.entryDate)}
          </Text>
          <Text style={[styles.time, { color: theme.colors.textTertiary }]}>
            {formatTime(entry.createdAt)}
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          {entry.title || 'Untitled Entry'}
        </Text>

        <View style={styles.metaContainer}>
          {mood && (
            <View
              style={[styles.metaItem, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text
                style={[styles.metaText, { color: theme.colors.textSecondary }]}
              >
                {mood.label}
              </Text>
            </View>
          )}
          {location && (
            <View
              style={[styles.metaItem, { backgroundColor: theme.colors.surface }]}
            >
              <Ionicons
                name="location-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[styles.metaText, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                {location.placeName || 'Unknown location'}
              </Text>
            </View>
          )}
          {weather && (
            <View
              style={[styles.metaItem, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={styles.weatherIcon}>{weather.icon}</Text>
              <Text
                style={[styles.metaText, { color: theme.colors.textSecondary }]}
              >
                {weather.temperature}°
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <Text style={[styles.stat, { color: theme.colors.textTertiary }]}>
            {getWordCount(entry.content)} words
          </Text>
          <Text style={[styles.stat, { color: theme.colors.textTertiary }]}>
            {calculateReadingTime(entry.content)} min read
          </Text>
        </View>

        <View
          style={[styles.divider, { backgroundColor: theme.colors.divider }]}
        />

        <Text style={[styles.content, { color: theme.colors.text }]}>
          {entry.content}
        </Text>

        {entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {entry.tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: theme.colors.primaryLight },
                ]}
              >
                <Text style={[styles.tagText, { color: theme.colors.primary }]}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View
        style={[styles.footer, { backgroundColor: theme.colors.background }]}
      >
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: theme.colors.surface }]}
          onPress={handleEdit}
        >
          <Ionicons name="pencil" size={20} color={theme.colors.primary} />
          <Text style={[styles.footerButtonText, { color: theme.colors.primary }]}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.footerButton,
            { backgroundColor: theme.colors.error + '15' },
          ]}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={20} color={theme.colors.error} />
          <Text style={[styles.footerButtonText, { color: theme.colors.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
    fontSize: 16,
    lineHeight: 24,
  },
  header: {
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  moodEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  weatherIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  metaText: {
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  stat: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
