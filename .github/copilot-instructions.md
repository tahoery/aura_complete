# Copilot Instructions for AURA AI Assistant

## Project Overview
- **AURA** is a React Native + Expo mobile app (see `mobile_app/`) for AI chat, voice commands, document scanning, and location-based automation.
- The app is modular: each major feature (chat, voice, camera, location, settings) is a separate screen in `src/screens/`.
- AI logic is abstracted in `src/services/AIService.js` (OpenAI by default, but extensible). Cline/Claude integration is scaffolded in `src/services/ClineService.js`.
- App assets (icons, splash, avatar) are in `assets/` and referenced in `app.json`.

## Key Workflows
- **Install:** `cd mobile_app && npm install`
- **Start (dev):** `npm start` or `expo start` (then press `i` for iOS, `a` for Android, `w` for web)
- **Build (prod):**
  - Install EAS CLI: `npm install -g @expo/eas-cli`
  - Configure: `eas build:configure`
  - Build: `eas build --platform ios` or `eas build --platform android`
- **Web Deploy:** Use `expo start --web` for local, or deploy `mobile_app` as a static site to Vercel/Netlify for public URL.

## Patterns & Conventions
- **Screens:** Each feature is a screen in `src/screens/`. Add new screens here and update navigation.
- **Services:** All AI and business logic in `src/services/`. Extend `AIService.js` or add new service files for new integrations.
- **Settings:** User-configurable API keys and model options are managed in the Settings screen and stored locally.
- **Theme:** Consistent purple (#6200EE) Material Design theme. Use gradients and modern UI patterns.
- **Assets:** Place new images/icons in `assets/` and update `app.json` as needed.

## Integration Points
- **AI:** Default is OpenAI via `AIService.js`. Cline/Claude integration template in `ClineService.js` (update endpoint/key as needed).
- **Permissions:** Camera, microphone, and location permissions are required for full functionality.
- **Offline:** Basic offline support with local storage for chat/settings.

## Troubleshooting
- If builds fail, clear cache: `expo start --clear`, reinstall deps, and check asset presence.
- For missing API keys, prompt user in Settings.
- For permission errors, instruct user to enable in device settings.

## Example: Adding a New Feature
1. Create a new screen in `src/screens/` (e.g., `NewFeatureScreen.js`).
2. Add business logic in `src/services/` if needed.
3. Update navigation to include the new screen.
4. Add any required assets to `assets/`.
5. Expose configuration in Settings if user-facing.

---

For more, see `mobile_app/README.md` and in-app Settings for configuration details.
