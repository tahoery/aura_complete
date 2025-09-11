# Aura Mobile App – Quick Run Guide (Expo 49)

## Prereqs
- Node 18+ and npm
- Expo CLI (`npx expo --version`)
- Expo Go app on your phone (iOS/Android)

## Install & Start
```bash
cd mobile_app
npm install
npx expo start
```

Scan the QR with Expo Go to launch on your device.

## First-Run Setup
1. Go to **Settings** tab in the app.
2. Paste your **OpenAI API Key** in the API key field.
3. (Optional) Toggle voice, camera quality, location, etc.
4. Save.

> The app stores config in AsyncStorage under: `@aura_ai_config`, `@aura_settings`, `@aura_user_profile`.

## Troubleshooting
- If you see an **import error**, ensure you're running from the `mobile_app` folder.
- If chat/voice fails, confirm your **API key** is valid and that your device has **mic/camera** permissions enabled.
- If Metro bundler hangs, stop the server and run `rm -rf .expo` then `npx expo start` again.

## Build (optional)
- Install EAS: `npm i -g eas-cli`
- `eas build -p ios` or `eas build -p android` (configure secrets first).