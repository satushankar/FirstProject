import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { EntryService } from '../../services/entry/entryService';
import { useEntryStore } from '../../store';
import { Entry, EntryType, RootStackParamList, MOOD_OPTIONS } from '../../types';
import { Button } from '../../components/common/Button';

type RouteProps = RouteProp<RootStackParamList, 'EntryEditor'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function EntryEditorScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { addEntry, updateEntry } = useEntryStore();

  const entryId = route.params?.entryId;
  const initialType = route.params?.type || 'daily';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entryType, setEntryType] = useState<EntryType>(initialType);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (entryId) {
      loadEntry();
    }
  }, [entryId]);

  const loadEntry = async () => {
    if (!entryId) return;
    const entry = await EntryService.getEntryById(entryId);
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setEntryType(entry.type);
      setTags(entry.tags);
      setIsPrivate(entry.isPrivate);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      return;
    }

    setSaving(true);

    try {
      const moodData = selectedMood !== null ? MOOD_OPTIONS[selectedMood] : undefined;

      if (entryId) {
        const updated = await EntryService.updateEntry(entryId, {
          title,
          content,
          mood: moodData,
          tags,
          isPrivate,
        });
        if (updated) {
          updateEntry(entryId, updated);
        }
      } else {
        const newEntry = await EntryService.createEntry({
          type: entryType,
          title,
          content,
          mood: moodData,
          tags,
          isPrivate,
        });
        addEntry(newEntry);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const entryTypes: { type: EntryType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { type: 'daily', label: 'Daily', icon: 'today-outline' },
    { type: 'weekly', label: 'Weekly', icon: 'calendar-outline' },
    { type: 'monthly', label: 'Monthly', icon: 'calendar-number-outline' },
    { type: 'story', label: 'Story', icon: 'book-outline' },
    { type: 'quick', label: 'Quick', icon: 'flash-outline' },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Entry Type Selector */}
          {!entryId && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Entry Type
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.typeSelector}
              >
                {entryTypes.map((item) => (
                  <TouchableOpacity
                    key={item.type}
                    style={[
                      styles.typeChip,
                      entryType === item.type && {
                        backgroundColor: theme.colors.primary,
                      },
                      entryType !== item.type && {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => setEntryType(item.type)}
                  >
                    <Ionicons
                      name={item.icon}
                      size={16}
                      color={
                        entryType === item.type
                          ? '#FFFFFF'
                          : theme.colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.typeChipText,
                        {
                          color:
                            entryType === item.type
                              ? '#FFFFFF'
                              : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Title Input */}
          <View style={styles.section}>
            <TextInput
              style={[
                styles.titleInput,
                {
                  color: theme.colors.text,
                  borderBottomColor: theme.colors.border,
                },
              ]}
              placeholder="Entry title (optional)"
              placeholderTextColor={theme.colors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Content Input */}
          <View style={styles.section}>
            <TextInput
              style={[
                styles.contentInput,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.surface,
                },
              ]}
              placeholder="Write your thoughts..."
              placeholderTextColor={theme.colors.textTertiary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Mood Selector */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              How are you feeling?
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodSelector}
            >
              {MOOD_OPTIONS.map((mood, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.moodChip,
                    selectedMood === index && {
                      backgroundColor: theme.colors.primaryLight,
                      borderColor: theme.colors.primary,
                    },
                    selectedMood !== index && {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() =>
                    setSelectedMood(selectedMood === index ? null : index)
                  }
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text
                    style={[
                      styles.moodLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Tags
            </Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={[
                  styles.tagInput,
                  {
                    color: theme.colors.text,
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Add a tag..."
                placeholderTextColor={theme.colors.textTertiary}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
              />
              <TouchableOpacity
                style={[
                  styles.addTagButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={handleAddTag}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tag,
                      { backgroundColor: theme.colors.primaryLight },
                    ]}
                  >
                    <Text
                      style={[styles.tagText, { color: theme.colors.primary }]}
                    >
                      #{tag}
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                      <Ionicons
                        name="close-circle"
                        size={16}
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Privacy Toggle */}
          <TouchableOpacity
            style={[styles.privacyToggle, { backgroundColor: theme.colors.surface }]}
            onPress={() => setIsPrivate(!isPrivate)}
          >
            <Ionicons
              name={isPrivate ? 'lock-closed' : 'lock-open-outline'}
              size={20}
              color={isPrivate ? theme.colors.primary : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.privacyText,
                { color: isPrivate ? theme.colors.primary : theme.colors.textSecondary },
              ]}
            >
              {isPrivate ? 'Private entry' : 'Make private'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Save Button */}
        <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
          <Button
            title={entryId ? 'Update Entry' : 'Save Entry'}
            onPress={handleSave}
            loading={saving}
            disabled={!content.trim()}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 200,
    padding: 16,
    borderRadius: 12,
  },
  moodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  moodChip: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 70,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 11,
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
  },
  addTagButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  privacyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});
