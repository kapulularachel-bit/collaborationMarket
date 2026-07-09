# GULA Marketplace — Mobile (React Native / Expo)

This is the React Native rewrite of the GULA Marketplace. It lives in `mobile/` alongside the legacy Vite web app in the project root, which stays as live reference until the final cleanup branch.

## Stack
- Expo SDK 53, expo-router (file-based routing)
- React Native 0.79, React 19
- NativeWind 4 (Tailwind classes on RN components)
- Convex (backend) — wired in branch 2
- Clerk (auth) — wired in branch 3

## Running locally
```bash
cd mobile
npm install
npx expo start
```
Then scan the QR with Expo Go on your device, or press `i` / `a` for simulator/emulator.

> This sandbox runs a Vite dev server for the legacy web app and cannot run Expo. Visual QA happens on your device.

## Branch plan
See the conversation plan. Branch 1 (this one) scaffolds the app shell. Subsequent branches port each feature from the Vite components in `../src/components/`.
