# BISM Gesture Practice — simplified framework

Implemented October 29, 2026. This supersedes the Garden dashboard described in the original foundation document.

## Four fixed choices

The home page has exactly four activity links in row-major reading order: Guided Tutorial (top left), Lessons (top right), Quiz / Testing Area (bottom left), Settings (bottom right). The two-by-two layout remains on small phones. There are no decorative icons, coins, leaderboard, sidebar, animation, or automatic narration. Text uses the system font, large controls, and high contrast. The page has one main heading; exercise controls have native labels.

- Tutorial selects four basics in sequence: touch exploration, activation, sideways navigation, adjustable slider. Continue advances to the next exercise; learners do not pick the next lesson. No timed progression or automatic speech competes with the screen reader.
- Lessons uses a native select control. Twelve iPhone lessons cover the requested gestures, with speech muting and Screen Curtain correctly separated. Seven Android lessons use TalkBack mappings; iPhone-only system gestures are excluded.
- Quiz chooses five distinct tasks in random order, without timeouts. Help me learn teaches the same task and offers a retry. Skip adds a review link to the summary. Practice completed during help does not count as passing the original task. Summaries distinguish browser observations, learner confirmations, and tasks to review.
- Settings includes phone choice, optional reward tones (off by default), reward volume, larger text, monochrome controls, and optional raw-touch practice. Installation and privacy help are collapsed by default.

## Exercises and assessment boundaries

Native buttons expose drink names for exploration/navigation. A Play button checks semantic activation. A native range checks adjustment. Reading passages provide speech and continuous-reading practice. A bounded scrolling list supports scrolling. A dialog provides a dismissible alert with a permanent Close alternative. An eight-second, on-device-generated audio loop provides media practice with native audio controls.

Semantic activation and value changes do not prove the physical gesture used. VoiceOver or TalkBack can consume gestures without sending raw touches or DOM focus to the page. Therefore exploration, reading, group navigation, speech commands, scrolling, and system tasks are explicitly learner-confirmed. The raw-touch option checks only finger movements; it never claims a system action occurred. No learner must disable their screen reader.

Screen Curtain is three-finger **triple** tap, or four taps when Zoom is also on. Three-finger double tap normally mutes/unmutes speech (three taps with Zoom). These lessons are trainer-assisted and explain restoration first. Two-finger sideways group navigation depends on VoiceOver's Grouped navigation style and content support.

Sources: [Apple gesture reference](https://support.apple.com/guide/iphone/use-voiceover-gestures-iph3e2e2281/ios), [Apple Screen Curtain](https://support.apple.com/en-gb/111797), [Google TalkBack gestures](https://support.google.com/accessibility/android/answer/6151827?hl=en).

## Persistence, offline, and hosting

New preferences and practice records use bism-gesture-practice-v2 in localStorage. Original bism-gesture-garden-v1 data is preserved without modification. No contacts, microphone recordings, or touch paths are uploaded. Storage may be cleared or evicted.

The existing manifest identity and scope are retained. Changed shell assets have revisioned URLs to avoid mixing the old cached app with the new markup. The service-worker cache is versioned and contains all app dependencies, including practice-core.js. An update waits until open windows close; it does not reload during practice. Future changes must bump asset revisions and the cache version together.

The root wrangler.jsonc declares the wyvern Worker, compatibility date, and gesture-garden/dist static directory. Cloudflare can deploy from repository root with npx wrangler deploy. No build or dependencies are required. Commit and push source changes to the GitHub repository linked to Cloudflare to publish; this rework does not change the old private Sites deployment.

## Verification and pilot gate

Node tests cover touch recognition, randomization without replacement, immutable result transitions, observed versus learner-reported grading, curriculum/platform separation, complete offline caching, network fallback, and safe service-worker updates. Browser checks cover the tutorial, native activation/slider, quiz teaching/retry/summary, lesson selection, settings, and mobile layout.

Before using with learners, test physical iPhone Safari and installed PWA with VoiceOver on, including heading navigation, backwards reading, native select/slider, dialog scrub/Close, media control, large text, Zoom, landscape, and offline reopening. Repeat with TalkBack on supported Android devices. Confirm content with BISM trainers. Desktop browser tests do not certify screen-reader behavior or system gestures.
