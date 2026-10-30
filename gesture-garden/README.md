# BISM Gesture Practice

Minimal, screen-reader-first gesture practice. See REWORK.md for the current framework and verification boundaries. FOUNDATION.md contains the original product plan as historical background.

## Run locally

From this directory, run `node serve.mjs`, then open http://127.0.0.1:4173. No install or build is needed.

## Cloudflare deployment

The repository-root wrangler.jsonc now declares the assets folder and compatibility date. Cloudflare settings:

- Root directory: /
- Build command: empty
- Deploy command: npx wrangler deploy

The existing longer deploy command also works. Commit and push the updated files to the connected GitHub repository, then retry deployment. This directory's dist/ holds the complete website; do not deploy just index.html. No Cloudflare account configuration has been changed by this rework.

## iPhone PWA

Open the HTTPS site in Safari, choose Share, Add to Home Screen, then Add. Keep Open as Web App on if shown. Open online once to save offline assets. Existing installations receive the new cache after all old windows close; changed script/style URLs also prevent old app assets being used with the new page. Future edits should bump both the asset URL revision and the service-worker cache version.

## Practice

- Four fixed home choices: Guided Tutorial, Lessons, Quiz / Testing Area, Settings.
- Native exercises work with a screen reader enabled. The app does not automatically narrate.
- Optional reward tones are off by default. Touch-pad practice is an optional setting.
- A browser-observed button activation or value change does not identify the finger gesture. System actions are learner-confirmed and are not certified tests.
- Screen Curtain uses a three-finger triple tap; a three-finger double tap normally controls speech muting. Zoom changes these commands.
- New progress is stored locally under bism-gesture-practice-v2. Earlier Garden data is left untouched. No live class board, coins, account, or backend is used.

## Checks

Run `node --test tests/*.test.cjs` and `node --check dist/app.js`.

Physical iPhone Safari/PWA with VoiceOver, Zoom, and larger text, plus Android TalkBack, still require device testing before a learner pilot.
