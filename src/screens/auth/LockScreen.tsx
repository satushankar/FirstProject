import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store';
import { AuthService } from '../../services/auth/authService';

const PIN_LENGTH = 4;

export function LockScreen() {
  const theme = useTheme();
  const { unlock, biometricsEnabled, biometricsAvailable } = useAuthStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [biometryType, setBiometryType] = useState('Biometrics');

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const { available, biometryType: types } =
      await AuthService.checkBiometricsAvailability();
    if (available && biometricsEnabled) {
      setBiometryType(AuthService.getBiometryTypeName(types));
      handleBiometricAuth();
    }
  };

  const handleBiometricAuth = async () => {
    const result = await AuthService.authenticateWithBiometrics();
    if (result.success) {
      unlock();
    }
  };

  const handlePinInput = async (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;

    const newPin = pin + digit;
    setPin(newPin);
    setError('');

    if (newPin.length === PIN_LENGTH) {
      const isValid = await AuthService.verifyPin(newPin);
      if (isValid) {
        unlock();
      } else {
        Vibration.vibrate(200);
        setError('Incorrect PIN');
        setPin('');
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const renderPinDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index < pin.length
                    ? theme.colors.primary
                    : theme.colors.border,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      [
        biometricsAvailable && biometricsEnabled ? 'biometric' : '',
        '0',
        'delete',
      ],
    ];

    return (
      <View style={styles.keypad}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, keyIndex) => {
              if (key === '') {
                return <View key={keyIndex} style={styles.keyEmpty} />;
              }

              if (key === 'biometric') {
                return (
                  <TouchableOpacity
                    key={keyIndex}
                    style={styles.key}
                    onPress={handleBiometricAuth}
                  >
                    <Ionicons
                      name="finger-print-outline"
                      size={28}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                );
              }

              if (key === 'delete') {
                return (
                  <TouchableOpacity
                    key={keyIndex}
                    style={styles.key}
                    onPress={handleDelete}
                    disabled={pin.length === 0}
                  >
                    <Ionicons
                      name="backspace-outline"
                      size={28}
                      color={
                        pin.length === 0
                          ? theme.colors.textTertiary
                          : theme.colors.text
                      }
                    />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={keyIndex}
                  style={[
                    styles.key,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  onPress={() => handlePinInput(key)}
                >
                  <Text style={[styles.keyText, { color: theme.colors.text }]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.primaryLight },
            ]}
          >
            <Ionicons name="book" size={40} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Personal Diary
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Enter your PIN to unlock
          </Text>
        </View>

        {renderPinDots()}

        {error ? (
          <Text style={[styles.error, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : (
          <View style={styles.errorPlaceholder} />
        )}

        {renderKeypad()}

        {biometricsAvailable && biometricsEnabled && (
          <Text
            style={[styles.biometricHint, { color: theme.colors.textTertiary }]}
          >
            Or use {biometryType} to unlock
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  error: {
    fontSize: 14,
    height: 20,
    marginBottom: 24,
  },
  errorPlaceholder: {
    height: 20,
    marginBottom: 24,
  },
  keypad: {
    width: '100%',
    maxWidth: 300,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyEmpty: {
    width: 72,
    height: 72,
  },
  keyText: {
    fontSize: 28,
    fontWeight: '500',
  },
  biometricHint: {
    fontSize: 14,
    marginTop: 24,
  },
});
