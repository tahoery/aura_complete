# AURA AI Assistant Mobile App

A comprehensive AI assistant mobile application built with React Native and Expo, featuring chat interface, voice commands, document scanning, and location-based automation.

## Features

### 🤖 AI Chat Assistant
- Natural language conversations with AI
- Real-time responses with typing indicators
- Chat history and conversation management
- Configurable AI models and parameters

### 🎙️ Voice Commands
- Speech-to-text transcription
- Voice command processing
- Text-to-speech responses
- Quick command shortcuts
- Audio recording and playback

### 📷 Document Scanner
- Camera-based document scanning
- AI-powered document analysis
- Text extraction and processing
- Image gallery integration
- Document insights and summaries

### 📍 Location Intelligence
- GPS location tracking
- Location-based automations
- Nearby points of interest
- AI location insights and suggestions
- Geofence automation triggers

### ⚙️ Comprehensive Settings
- AI configuration (API keys, models, parameters)
- User profile customization
- App preferences and toggles
- Data management and privacy controls

## Prerequisites

Before running the app, make sure you have:

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android emulator (for Android development)
- Physical device with Expo Go app (optional)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd mobile_app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on your preferred platform:**
   - **iOS:** Press `i` in the terminal or scan QR code with iOS device
   - **Android:** Press `a` in the terminal or scan QR code with Android device
   - **Web:** Press `w` in the terminal

## Configuration

### AI Service Setup

1. **Open Settings in the app**
2. **Configure AI settings:**
   - Add your OpenAI API key (or other AI service key)
   - Select AI model (GPT-3.5-turbo, GPT-4, etc.)
   - Adjust creativity level (temperature)
   - Set max response length

### Permissions

The app requires the following permissions:
- **Camera:** For document scanning
- **Microphone:** For voice commands
- **Location:** For location-based features
- **Storage:** For saving conversations and data

## Project Structure

```
mobile_app/
├── App.js                 # Main app entry point
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── babel.config.js       # Babel configuration
├── assets/               # App assets (icons, images)
├── src/
│   ├── screens/          # Screen components
│   │   ├── ChatScreen.js       # AI chat interface
│   │   ├── VoiceScreen.js      # Voice commands
│   │   ├── CameraScreen.js     # Document scanner
│   │   ├── LocationScreen.js   # Location features
│   │   └── SettingsScreen.js   # App settings
│   └── services/         # Business logic
│       └── AIService.js        # AI integration service
└── README.md
```

## Key Components

### AIService
Handles all AI-related functionality:
- Chat message processing
- Voice command interpretation
- Document analysis
- Location insights
- API communication
- Offline mode fallbacks

### Navigation
Bottom tab navigation with 5 main sections:
- Chat (AI conversations)
- Camera (Document scanning)
- Voice (Voice commands)
- Location (Location automation)
- Settings (Configuration)

### Theme
Consistent purple theme (#6200EE) across the app with:
- Material Design components
- Gradient backgrounds
- Modern UI patterns
- Responsive layouts

## Development Notes

### Adding New Features
1. Create new components in appropriate directories
2. Update navigation if adding new screens
3. Extend AIService for new AI capabilities
4. Add configuration options in Settings

### API Integration
- The app is designed to work with OpenAI API by default
- Can be extended to support other AI services
- Add API keys in Settings screen
- Service configurations are stored locally

### Offline Support
- Basic offline mode with cached responses
- Local storage for conversations and settings
- Graceful degradation when no internet connection

## Troubleshooting

### Common Issues

1. **"AI API key not configured"**
   - Go to Settings → AI Configuration
   - Add your API key and save settings

2. **Permission denied errors**
   - Grant camera, microphone, and location permissions
   - Check device settings if needed

3. **Dependencies issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again
   - Clear Expo cache: `expo start --clear`

4. **Build errors**
   - Ensure all assets are present (see assets/README.md)
   - Check Expo version compatibility
   - Update dependencies if needed

### Performance Tips

- Enable offline mode for faster responses
- Lower AI temperature for more focused responses
- Reduce max token limit for shorter responses
- Clear conversation history periodically

## Building for Production

### Expo Build Service (EAS)

1. **Install EAS CLI:**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Configure build:**
   ```bash
   eas build:configure
   ```

3. **Build for platforms:**
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

### Local Builds

For advanced users who want to build locally:
- Follow Expo's bare workflow documentation
- Ensure all native permissions are properly configured
- Test on physical devices before release

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on multiple devices
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Expo documentation
3. Check React Native community resources
4. Create an issue in the project repository

---

**AURA AI Assistant** - Your intelligent mobile companion for chat, voice, documents, and location automation.
