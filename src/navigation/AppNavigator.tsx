import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store';
import { RootStackParamList, MainTabParamList } from '../types';

// Screens
import { LockScreen } from '../screens/auth/LockScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
// Placeholder screens - to be implemented
import { CalendarScreen } from '../screens/calendar/CalendarScreen';
import { SearchScreen } from '../screens/search/SearchScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EntryDetailScreen } from '../screens/entry/EntryDetailScreen';
import { EntryEditorScreen } from '../screens/entry/EntryEditorScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const theme = useTheme();
  const { isLocked, hasSetupPin } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {isLocked ? (
          <>
            {!hasSetupPin ? (
              <Stack.Screen name="SetupPin" component={SetupPinScreen} />
            ) : (
              <Stack.Screen name="Lock" component={LockScreen} />
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="EntryDetail"
              component={EntryDetailScreen}
              options={{
                headerShown: true,
                headerTitle: '',
                headerTransparent: true,
                headerTintColor: theme.colors.text,
              }}
            />
            <Stack.Screen
              name="EntryEditor"
              component={EntryEditorScreen}
              options={{
                headerShown: true,
                headerTitle: 'New Entry',
                headerTintColor: theme.colors.text,
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: true,
                headerTitle: 'Settings',
                headerTintColor: theme.colors.text,
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Placeholder for SetupPin screen
function SetupPinScreen() {
  return null; // To be implemented
}
