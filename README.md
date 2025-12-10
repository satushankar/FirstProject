# Personal Diary App

A modern, feature-rich personal diary application built with React Native and Expo for iOS and Android.

## Features

### Core Features
- **Multiple Entry Types**: Daily journals, weekly reflections, monthly reviews, stories, and quick notes
- **Rich Text Editor**: Format your entries with bold, italic, lists, and more
- **Mood Tracking**: Log your emotions with emoji-based mood selection
- **Location Tagging**: Tag entries with your current location
- **Weather Integration**: Automatically capture weather conditions
- **Tags & Collections**: Organize entries with custom tags and collections

### Security
- **PIN Protection**: Secure your diary with a 4-6 digit PIN
- **Biometric Authentication**: Unlock with fingerprint or face recognition
- **Private Entries**: Mark sensitive entries as private with extra protection

### Data Management
- **Local-First Storage**: All data stored securely on your device
- **Optional Cloud Sync**: Sync across devices (coming soon)
- **Export Options**: Export entries to PDF or plain text
- **Automatic Backups**: Never lose your memories

### Personalization
- **Light & Dark Themes**: Choose your preferred appearance
- **Custom Accent Colors**: Personalize the app's look
- **Daily Reminders**: Set reminders to write regularly

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation
- **Storage**: AsyncStorage + SecureStore
- **Authentication**: expo-local-authentication (biometrics)
- **Icons**: @expo/vector-icons (Ionicons)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Buttons, inputs, cards
│   └── entry/          # Entry-related components
├── screens/            # Screen components
│   ├── auth/           # Lock, PIN screens
│   ├── home/           # Timeline view
│   ├── entry/          # Editor, detail views
│   ├── calendar/       # Calendar view
│   ├── search/         # Search functionality
│   ├── profile/        # User profile
│   └── settings/       # App settings
├── navigation/         # Navigation configuration
├── store/              # Zustand state management
├── database/           # Local storage operations
├── services/           # Business logic
│   ├── auth/           # Authentication
│   └── entry/          # Entry operations
├── hooks/              # Custom React hooks
├── utils/              # Helper functions
├── theme/              # Styling and themes
└── types/              # TypeScript definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/satushankar/FirstProject.git
cd FirstProject
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app for physical device

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Weather API (optional)
WEATHER_API_KEY=your_api_key

# Cloud Sync (optional)
FIREBASE_API_KEY=your_firebase_key
```

### App Configuration

Edit `app.json` to customize:
- App name and slug
- Bundle identifiers
- Splash screen
- App icons
- Permissions

## Roadmap

### Phase 1: Foundation (Current)
- [x] Project setup with TypeScript
- [x] Basic navigation structure
- [x] Theme system (light/dark)
- [x] Local storage implementation
- [x] PIN and biometric authentication
- [x] Entry CRUD operations
- [x] Home timeline view

### Phase 2: Enhanced Features
- [ ] Rich text editor improvements
- [ ] Photo and media attachments
- [ ] Voice recording
- [ ] Drawing/sketch canvas
- [ ] Calendar view with heatmap

### Phase 3: Context Features
- [ ] Weather API integration
- [ ] Location services
- [ ] Mood analytics dashboard
- [ ] Tag management
- [ ] Collections feature

### Phase 4: Cloud & Sync
- [ ] User authentication
- [ ] Cloud backup
- [ ] Multi-device sync
- [ ] Export to PDF

### Phase 5: Polish
- [ ] Widgets
- [ ] Notifications
- [ ] "On This Day" memories
- [ ] Performance optimization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the amazing React Native toolchain
- [React Navigation](https://reactnavigation.org/) for navigation
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Ionicons](https://ionic.io/ionicons) for beautiful icons
