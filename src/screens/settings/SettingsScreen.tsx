import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore, useAuthStore } from '../../store';
import { UserSettings } from '../../types';

export function SettingsScreen() {
  const theme = useTheme();
  const settings = useSettingsStore();
  const { biometricsAvailable } = useAuthStore();

  const renderSettingItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        style={[
          styles.settingIcon,
          { backgroundColor: theme.colors.primaryLight },
        ]}
      >
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  const renderSwitch = (value: boolean, onValueChange: (val: boolean) => void) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
      thumbColor="#FFFFFF"
    />
  );

  const themeOptions: { value: UserSettings['theme']; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  const currentThemeLabel = themeOptions.find((t) => t.value === settings.theme)?.label;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Appearance
          </Text>
          {renderSettingItem(
            'color-palette-outline',
            'Theme',
            currentThemeLabel,
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />,
            () => {
              // Cycle through themes
              const currentIndex = themeOptions.findIndex(
                (t) => t.value === settings.theme
              );
              const nextIndex = (currentIndex + 1) % themeOptions.length;
              settings.setTheme(themeOptions[nextIndex].value);
            }
          )}
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Security
          </Text>
          {biometricsAvailable &&
            renderSettingItem(
              'finger-print-outline',
              'Biometric Unlock',
              'Use fingerprint or face to unlock',
              renderSwitch(settings.enableBiometrics, settings.setEnableBiometrics)
            )}
          {renderSettingItem(
            'lock-closed-outline',
            'Change PIN',
            'Update your security PIN',
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />
          )}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Notifications
          </Text>
          {renderSettingItem(
            'notifications-outline',
            'Daily Reminders',
            settings.enableReminders ? `Remind at ${settings.reminderTime}` : 'Disabled',
            renderSwitch(settings.enableReminders, settings.setEnableReminders)
          )}
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Data
          </Text>
          {renderSettingItem(
            'cloud-outline',
            'Cloud Sync',
            settings.enableCloudSync ? 'Enabled' : 'Disabled',
            renderSwitch(settings.enableCloudSync, settings.setEnableCloudSync)
          )}
          {renderSettingItem(
            'download-outline',
            'Export Data',
            'Download your diary entries',
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />
          )}
          {renderSettingItem(
            'cloud-upload-outline',
            'Backup',
            'Create a backup of your data',
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />
          )}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            About
          </Text>
          {renderSettingItem(
            'information-circle-outline',
            'Version',
            '1.0.0'
          )}
          {renderSettingItem(
            'document-text-outline',
            'Privacy Policy',
            undefined,
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />
          )}
          {renderSettingItem(
            'shield-checkmark-outline',
            'Terms of Service',
            undefined,
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>
            Danger Zone
          </Text>
          <TouchableOpacity
            style={[
              styles.settingItem,
              { backgroundColor: theme.colors.error + '15' },
            ]}
          >
            <View
              style={[
                styles.settingIcon,
                { backgroundColor: theme.colors.error + '30' },
              ]}
            >
              <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.error }]}>
                Delete All Data
              </Text>
              <Text
                style={[styles.settingSubtitle, { color: theme.colors.error }]}
              >
                This action cannot be undone
              </Text>
            </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});
