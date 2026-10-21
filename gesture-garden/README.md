# BISM Gesture Garden

An early interactive prototype for learning phone gestures with optional audio rewards, celebratory coins, and a calm, accessible interface. The detailed product and curriculum plan is in `FOUNDATION.md`.

## Run locally

Requires Node.js 18 or newer. No package installation or build step is needed.

```powershell
cd C:\Users\cjohe\PycharmProjects\wyvern\gesture-garden
node serve.mjs
```

Open `http://127.0.0.1:4173`. Set the `PORT` environment variable to use another port. The preview server deliberately binds only to this computer. A loopback URL on an iPhone points to that iPhone, so use the deployed HTTPS site for real-device testing.

## iPhone Safari and Home Screen

1. Open the deployed HTTPS URL in Safari.
2. Choose Share, then Add to Home Screen. If Safari shows an Open as Web App option, leave it on.
3. Choose Add, then launch Gesture Garden from its Home Screen icon.
4. Let the first online visit finish before testing offline. The app shell is precached by a service worker; audio rewards are synthesized on-device after an interaction.

The manifest, 180px Apple touch icon, 192px and 512px PNG icons, standalone configuration, and same-origin offline cache are included. Service workers require HTTPS, with a localhost exception for desktop development. A downloaded HTML file alone does not install or provide this offline behavior.

An app update waits until all existing windows have closed. The service worker never forces a reload during practice. Update `CACHE_NAME` in `dist/sw.js` whenever the app shell changes. Device storage can be cleared or evicted; offline availability and local progress are conveniences, not backups. Safari and a Home Screen installation can have separate storage depending on the OS version and installation context.

## How practice works

- **Guided mode:** screen-reader-friendly instructions and explicit confirmation for real-device missions. VoiceOver and TalkBack consume many gestures before a web page receives them. The app cannot detect whether a screen reader is running or verify an OS-level action.
- **Touch practice:** a gesture pad can assess gestures actually delivered to the web page. This is optional and may require a sighted helper or a comfortable way to suspend the screen reader. Keep an accessible way to navigate and leave the activity.
- **System lessons:** App Switcher, Screen Curtain, rotor effects, and other system actions are coached missions rather than device controls. The prototype never claims to close apps, change VoiceOver settings, or answer a real call.

No speed penalties, purchase flows, or real money are involved. Progress is saved only in the current browser's storage. Classmates and leaderboard examples are demonstrations, not connected accounts; no backend, real class synchronization, or public leaderboard exists.

## Verification

Run gesture-recognition and offline behavior tests with:

```powershell
node --test tests/*.test.cjs
```

The prototype still needs testing on physical iPhones in Safari and Home Screen mode with VoiceOver, larger text, Zoom, and reduced motion, plus Android TalkBack tests. Desktop browser checks do not certify iOS multi-touch or screen-reader behavior. See `FOUNDATION.md` for the release checklist and source-linked gesture corrections.
