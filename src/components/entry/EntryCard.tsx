import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Entry } from '../../types';
import { formatDate, getExcerpt } from '../../utils/helpers';
import { colors } from '../../theme/colors';

interface EntryCardProps {
  entry: Entry;
  onPress: () => void;
  moodEmoji?: string;
}

export function EntryCard({ entry, onPress, moodEmoji }: EntryCardProps) {
  const theme = useTheme();

  const getTypeIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (entry.type) {
      case 'daily':
        return 'today-outline';
      case 'weekly':
        return 'calendar-outline';
      case 'monthly':
        return 'calendar-number-outline';
      case 'story':
        return 'book-outline';
      case 'quick':
        return 'flash-outline';
      default:
        return 'document-text-outline';
    }
  };

  const getTypeColor = (): string => {
    switch (entry.type) {
      case 'daily':
        return colors.primary[500];
      case 'weekly':
        return colors.success.main;
      case 'monthly':
        return colors.warning.main;
      case 'story':
        return colors.info.main;
      case 'quick':
        return colors.error.main;
      default:
        return colors.neutral[500];
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <View
            style={[
              styles.typeIconContainer,
              { backgroundColor: getTypeColor() + '20' },
            ]}
          >
            <Ionicons name={getTypeIcon()} size={16} color={getTypeColor()} />
          </View>
          <Text
            style={[styles.typeLabel, { color: theme.colors.textSecondary }]}
          >
            {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
          </Text>
        </View>
        <View style={styles.metaContainer}>
          {moodEmoji && <Text style={styles.moodEmoji}>{moodEmoji}</Text>}
          {entry.isPrivate && (
            <Ionicons
              name="lock-closed"
              size={14}
              color={theme.colors.textTertiary}
              style={styles.lockIcon}
            />
          )}
        </View>
      </View>

      <Text
        style={[styles.title, { color: theme.colors.text }]}
        numberOfLines={2}
      >
        {entry.title || 'Untitled Entry'}
      </Text>

      <Text
        style={[styles.excerpt, { color: theme.colors.textSecondary }]}
        numberOfLines={3}
      >
        {getExcerpt(entry.content, 120)}
      </Text>

      <View style={styles.footer}>
        <Text style={[styles.date, { color: theme.colors.textTertiary }]}>
          {formatDate(entry.entryDate)}
        </Text>
        {entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {entry.tags.slice(0, 2).map((tag, index) => (
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
            {entry.tags.length > 2 && (
              <Text
                style={[styles.moreTags, { color: theme.colors.textTertiary }]}
              >
                +{entry.tags.length - 2}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 18,
  },
  lockIcon: {
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 11,
    marginLeft: 6,
  },
});
