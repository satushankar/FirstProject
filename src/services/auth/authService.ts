import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { AuthStorage } from '../../database/storage';

const PIN_KEY = 'diary_pin';

// Simple hash function for PIN (in production, use a proper crypto library)
function hashPin(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export const AuthService = {
  // Check if biometrics are available
  async checkBiometricsAvailability(): Promise<{
    available: boolean;
    biometryType: LocalAuthentication.AuthenticationType[];
  }> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    return {
      available: hasHardware && isEnrolled,
      biometryType: supportedTypes,
    };
  },

  // Authenticate with biometrics
  async authenticateWithBiometrics(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Personal Diary',
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      });

      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Biometric authentication failed',
      };
    }
  },

  // Set up PIN
  async setupPin(pin: string): Promise<boolean> {
    try {
      const hashedPin = hashPin(pin);
      await SecureStore.setItemAsync(PIN_KEY, hashedPin);
      await AuthStorage.setHasSetup(true);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Verify PIN
  async verifyPin(pin: string): Promise<boolean> {
    try {
      const storedHash = await SecureStore.getItemAsync(PIN_KEY);
      if (!storedHash) return false;

      const inputHash = hashPin(pin);
      return storedHash === inputHash;
    } catch (error) {
      return false;
    }
  },

  // Change PIN
  async changePin(oldPin: string, newPin: string): Promise<boolean> {
    const isValid = await this.verifyPin(oldPin);
    if (!isValid) return false;

    return this.setupPin(newPin);
  },

  // Check if PIN is set up
  async hasSetupPin(): Promise<boolean> {
    try {
      const pin = await SecureStore.getItemAsync(PIN_KEY);
      return pin !== null;
    } catch (error) {
      return false;
    }
  },

  // Clear authentication data
  async clearAuth(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(PIN_KEY);
      await AuthStorage.clearAuth();
    } catch (error) {
      // Ignore errors during cleanup
    }
  },

  // Get biometry type name
  getBiometryTypeName(
    types: LocalAuthentication.AuthenticationType[]
  ): string {
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Fingerprint';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris';
    }
    return 'Biometrics';
  },
};
