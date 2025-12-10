import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAuthStore, useSettingsStore } from './src/store';
import { AuthService } from './src/services/auth/authService';
import { SettingsStorage } from './src/database/storage';
import { useIsDarkMode } from './src/hooks/useTheme';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const isDarkMode = useIsDarkMode();
  const {
    setHasSetupPin,
    setBiometricsAvailable,
    setBiometricsEnabled,
    setLocked,
  } = useAuthStore();
  const { updateSettings } = useSettingsStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if PIN is set up
      const hasPin = await AuthService.hasSetupPin();
      setHasSetupPin(hasPin);

      // If no PIN is set, don't lock the app (first time user)
      if (!hasPin) {
        setLocked(false);
      }

      // Check biometrics availability
      const { available } = await AuthService.checkBiometricsAvailability();
      setBiometricsAvailable(available);

      // Load saved settings
      const savedSettings = await SettingsStorage.get();
      if (savedSettings) {
        updateSettings(savedSettings);
        setBiometricsEnabled(savedSettings.enableBiometrics);
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
