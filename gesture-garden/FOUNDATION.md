# Gesture Garden — product foundation

Prepared for BISM, October 20, 2026. This is a product and pilot plan alongside an early browser prototype, not a claim of clinical benefit or completed device certification. The supplied Claude HTML informed feature scope only; its content was treated as reference material rather than instructions.

## 1. The outcome to build toward

Help an older adult move from “I am afraid to touch the wrong thing” to “I can find, open, and use the things that matter to me.” The game should celebrate practical independence: finding a family member, opening a useful app, hearing a page, and recovering when a screen feels unfamiliar.

The core loop is **hear one useful goal → see or hear a demonstration → practice at your own pace → receive a gentle ding → try it in a real context → reflect and return later**. Each lesson introduces one movement, takes approximately two to five minutes, and remains replayable. Three comfortable repetitions are a useful prototype default, not a standardized mastery measure.

Primary users are older adults with blindness or low vision, including people with limited smartphone experience. Additional needs include tremor, reduced dexterity, hearing loss, fatigue, and cognitive load. BISM instructors are partners in the learning loop. A family member should be able to help without taking over the phone.

Success means a learner can complete a chosen task again, with less assistance and more confidence. Coin totals and time spent are secondary indicators. Do not optimize for speed, attendance pressure, or competition.

## 2. Resolve the platform boundary first

A web app receives browser events, not a transcript of everything the screen reader or operating system does. An enabled screen reader may consume a gesture and send a semantic activation instead. The PWA installation does not grant native accessibility permissions, access to call history, the VoiceOver rotor, the Home Screen, the App Switcher, or Screen Curtain.

This is an engineering boundary to design around. The app must never infer that a learner disabled VoiceOver, enabled Screen Curtain, created a contact, or switched apps merely because a button was pressed.

Use two explicitly named modes:

| Mode | What the learner does | What the app can truthfully record |
| --- | --- | --- |
| Guided practice, default | Keeps their screen reader available, reads or hears the steps, uses ordinary accessible controls, and confirms completion | A guided activity or self-reported real-world task was completed |
| Touch practice, optional | Rehearses supported movements on a bounded pad, when the browser receives those touches | A matching finger-count/movement pattern reached the page |

Guided completion deserves the same encouragement. Do not describe it as “fake practice.” Equally, do not label it objectively verified gesture mastery. For screen-reader-native commands, point the learner or trainer to the built-in practice environment when appropriate. Apple offers a VoiceOver Practice area designed to explain gestures without executing their ordinary actions. [Apple: VoiceOver Practice](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios)

In touch mode, keep an always available exit outside the pad. Never force a learner who depends on VoiceOver to turn it off to continue the course. Avoid full-screen gesture capture. Do not intercept edge swipes or prevent scrolling across the whole document. No automatic screen-reader detection: ask for preferences and persist the explicit choice.

## 3. Curriculum and corrections to the notes

The content is organized by useful outcomes, not by finger count. User notes are a valuable brief but are not a substitute for platform documentation or a check of the learner's actual configuration. Gestures can be customized; Android support also varies by device and TalkBack version.

### iPhone with VoiceOver

| Learning target | Teaching rule | Browser exercise |
| --- | --- | --- |
| Explore, select, activate | Selection and activation are separate; single touch selects, double tap activates | Accessible target plus optional tap rhythm practice |
| Find adjacent items | One-finger left/right follows focus order | Navigation trail; optional horizontal pad movement |
| Pause speech / control current media | Two-finger tap pauses speech; two-finger double tap controls the current supported action | Rhythm practice; real action confirmed separately |
| Scroll / Home pages | Three fingers move pages and lists | Vertical and horizontal movement rehearsal |
| Continuous reading | Two-finger up starts from the top; down starts at focus | Guided passage plus movement rehearsal |
| Go back | Two-finger back-and-forth scrub | Guided demonstration and a harmless real task |
| Item menu | Current Apple table lists a one-finger triple tap for long press | Guided lesson; confirm item and device behavior |

These mappings are paraphrased from [Apple: VoiceOver gestures](https://support.apple.com/guide/iphone/use-voiceover-gestures-iph3e2e2281/ios). A generic single tap-and-hold should not be taught as a universal VoiceOver context-menu command. Distinguish ordinary touch interactions from the commands used while VoiceOver is on.

The rotor uses a two-finger dial movement; a subsequent one-finger vertical flick applies the selected option. The suggested one-finger anchor technique is one possible teaching aid, not a required complete circle. An alternative is one finger on each hand moving in opposite directions. Teach Words or Headings before speech settings so an unexpected setting change is easier to recover from. [Apple: rotor](https://support.apple.com/guide/iphone/iph3e2e3a6d/ios)

Two-finger sideways movement enters or leaves groups when VoiceOver's **Grouped** navigation style applies. Do not describe every list as a group. [Apple: VoiceOver navigation settings](https://support.apple.com/guide/iphone/iphfa3d32c50/ios)

Screen Curtain uses **three-finger triple tap**, or four taps when Zoom and VoiceOver are both enabled. The original double-tap note describes the usual speech-mute command instead. Teach restoration before trying privacy settings. [Apple: Screen Curtain](https://support.apple.com/guide/iphone/keep-the-screen-off-iph756788a12/ios)

On Face ID iPhones with VoiceOver, opening the App Switcher involves dragging from the bottom to the second vibration or three tones; Home-button phones use the Home button twice. Once open, choose an app and activate it. App closing is a later instructor-led recovery skill, not a daily cleanup requirement or a gesture that the web app can observe. Verify any three-finger closing instruction on the classroom's actual iOS version before teaching it. [Apple: operating iPhone with VoiceOver](https://support.apple.com/guide/iphone/iph3e2e2329/ios)

### Android with TalkBack

| Learning target | Platform distinction | Prototype treatment |
| --- | --- | --- |
| Selection, activation, focus travel | Touch selects, double tap activates, horizontal single-finger swipes travel | Shared basics with Android wording |
| Scrolling | Two fingers, rather than iPhone's three | Separate Android scrolling lesson |
| Item long press | Focus first, then double-tap and hold | Guided instruction |
| TalkBack menu | Three-finger tap on supported devices; single-finger compound alternatives exist | Trainer checks device support before the class |
| Speech and media control | Modern supported versions offer two-finger tap / double tap | Shared rhythm lesson, qualified by support |
| Recents | Different from VoiceOver: assigned Recents command or two-finger edge swipe and hold with gesture navigation | Guided system task |
| Three-finger triple tap | Can be paste, not iPhone Screen Curtain | Do not carry the iPhone lesson across |

[Google: TalkBack gestures](https://support.google.com/accessibility/android/answer/6151827?hl=en)

Reading controls and the VoiceOver rotor share a learning goal but are not interchangeable gestures. On supported TalkBack configurations, multi-finger movement or compound single-finger movement selects a reading control, then up/down uses it. Confirm the exact assignment in Settings; Google's help pages describe multiple versions and configurations. [Google: navigating with TalkBack](https://support.google.com/accessibility/android/answer/6006598?hl=en)

### Course sequence

1. **Orientation:** choose iPhone or Android; choose guided practice; hear a sample ding; learn the always available Back/Close control.
2. **Basics:** discover an item, activate it, and move among nearby items. End with a familiar app button.
3. **Everyday confidence:** pause speech, rehearse the two-finger double-tap rhythm, and move through a longer page.
4. **Reading and choices:** continuous reading, rotor or reading controls, and available item actions.
5. **Safe recovery:** menus, a supported back command, switching apps, and Screen Curtain with a trainer.
6. **Transfer:** a recent caller → a new contact, taught in a supervised device-specific scenario. Use fictional numbers during demonstrations and do not import a learner's contacts into the prototype.

The data file contains 16 short lessons: 15 available on iPhone and 9 available on Android, including shared lessons with separate platform instructions. Later Android-only content should add its own TalkBack menu, reading-control, Back, and Home lessons rather than silently reusing iPhone gestures.

## 4. The product experience

### Home

Give the learner one obvious next lesson, a short progress sentence, and an optional daily goal. Let them explore all lessons without punitive locks. Keep a stable navigation layout. A warm, contemporary visual direction can feel adult and welcoming: deep green, pale mint, cream, readable typography, and generous whitespace. Use restrained celebration instead of constant motion.

### Lesson flow

Each lesson should answer: What will this help me do? How many fingers? What movement? What should I hear? How do I get back?

The learner can repeat the instruction, see a simple animation, rehearse, ask for a hint, and stop at any point. No timeout and no lost lives. After a mismatch, acknowledge what reached the pad in plain language and offer one actionable adjustment. If the browser receives no event, offer guided mode immediately instead of blaming the learner.

Keep demonstration, practice, and real-world mission visibly distinct. A demonstration is not an attempt. Changing modes cannot silently increment the success count. A mission confirmation should say “you reported completing this,” or use an equally clear progress label.

### Accessibility requirements

- Use semantic headings, landmarks, lists, links, buttons, and form labels before adding custom ARIA.
- Favor targets at least 48 CSS pixels high, comfortably separated, with persistent text labels.
- Keep prose large and concise; support browser zoom and an additional large-text preference without clipping or hidden controls.
- Maintain a logical reading order and a clear keyboard focus ring. No information depends on color, icon shape, sound, or movement alone.
- Announce a short practice result through one polite live region. Avoid narrating every pointer movement.
- Move focus into a lesson or dialog when opened, keep background controls unavailable while modal, and restore focus to the trigger when closed.
- Test VoiceOver rotor navigation by headings, links, and form controls. Test reading backwards as well as forwards.
- Respect reduced motion and allow a quiet visual alternative to sound. Charts have plain-text equivalents.
- Audio instructions start only when requested; automatic app narration must not compete with the learner's screen reader.

These are implementation requirements to verify, not a completed accessibility certification. Apple's evaluation criteria emphasize equivalent activation, logical navigation, and operable dialogs. [Apple: VoiceOver evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria/)

## 5. Reward design

A soft ding is immediate positive feedback. A short rising pair of tones marks lesson completion. Use a comfortable envelope and conservative volume; avoid sharp attack, loud failure buzzers, or random sound effects. Offer sound on/off, volume, preview, and a choice of a small number of pleasant themes. Changing the sound must never cost access to lesson content.

Create or resume the audio context from an explicit user action and handle a suspended context after returning from the background. The app must remain usable if audio is unavailable. [MDN: Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)

Coins are fictional, have no cash value, and reward effort. Suggested policy: first lesson completion earns its listed amount; later repetitions continue to receive a ding, with a modest capped daily practice bonus in a future version. Do not punish mistakes or deduct coins for taking a break. Do not reward speed. Badges recognize useful milestones such as First Practice, Three Different Skills, and Tried a Real Task.

A streak should be a gentle memory aid, with forgiving language after a missed day. Use local calendar dates, not UTC boundaries. Avoid “you lost your streak” messaging. Offer a weekly goal for learners who cannot practice daily.

Leaderboard participation is optional and off by default in a real classroom. Default to cooperative class goals such as “our group explored 20 lessons this week.” If comparing people, use chosen aliases, weekly participation rather than fastest performance, and never expose disability status or comparative failure counts. The early prototype's class view must label sample classmates and keep them separate from real learner records.

## 6. iPhone Safari and Home Screen PWA

Ship the same responsive experience in Safari and standalone. Include a web manifest with a stable identifier, start URL, scope, name, theme color, and standalone display mode; provide both manifest icons and an Apple touch icon. Add safe-area padding for the notch and home indicator, avoid fixed heights that depend on Safari's changing toolbar, and support portrait and landscape.

On iPhone, explain the native installation route in short steps: open the served site in Safari, open Share, choose Add to Home Screen, and confirm. Do not pretend there is a universal one-click browser install prompt. WebKit documents manifest-based standalone behavior and icon handling. [WebKit: Home Screen web apps](https://webkit.org/blog/13878/)

Provide a versioned service worker and cache the essential same-origin shell, curriculum, styles, script, and icons. Generated reward tones need no network fetch. Offline availability begins after a successful online load and cache installation. Show an honest offline state. A local HTML file opened through Files is not an equivalent PWA test: service workers need HTTPS or the localhost development exception. [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

Keep external fonts and remote media optional; core practice must survive their failure. Do not cache authentication redirects as application HTML. For private hosting, test first use and later offline launch with the actual hosting access flow.

Treat local progress as best effort. Website data can be cleared or evicted, and a browser tab and installed web app should not be assumed to share every aspect of storage on every supported version. Explain that progress is saved on this device, and verify persistence in each execution context. A production version should add an optional accessible export/restore or opt-in account backup. WebKit documents storage pressure and origin eviction behavior. [WebKit: storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/)

No push notifications, background audio, microphone, contact, motion-sensor, or location permissions are necessary for this concept. Haptics are an optional future enhancement, not required feedback and not an iPhone Safari acceptance criterion.

## 7. Architecture and progress model

The early implementation can remain static and buildless: one responsive shell, separated CSS and app behavior, a curriculum data file, and a service worker. This lowers the offline footprint and makes instructor review straightforward. Keep recognizer logic independent of DOM rendering where practical.

For the next implementation pass, use a versioned record with:

```text
profile: platform, preferredMode, textSize, soundEnabled, soundTheme, volume
lessonProgress[platform + lessonId]: guidedCompletions, touchCompletions,
  lastPracticedAt, missionSelfReportedAt, instructorVerifiedAt
rewardLedger[]: eventId, lessonId, earnedAt, kind, amount
practiceDays[]: localDate, completedActivities
contentVersion, schemaVersion
```

Persist an event once, then derive totals; the same completion callback must not credit coins twice. Validate restored data, clamp settings to sensible values, tolerate damaged JSON, and catch storage failures. Never silently relabel a guided completion as a detected gesture. Platform-specific progress avoids claiming that an iPhone skill proves an Android skill.

The browser recognizer should check simultaneous finger count, movement direction, distance, and the tap sequence. It must reset on touch cancellation, lost focus, lesson exit, and mode change. Ignore incidental extra touches outside the pad. Pointer/mouse support may rehearse a one-finger movement; it cannot validate multiple fingers. Account for movement jitter and staggered finger landing without using overly strict timings.

For an eventual native extension, evaluate native accessibility APIs and direct-touch areas with specialist input. A native wrapper by itself does not solve verification or grant control of other apps. [Apple: direct-touch options](https://developer.apple.com/documentation/uikit/uiaccessibility/directtouchoptions)

## 8. Privacy and classroom services

Keep the prototype anonymous and device-local. Do not request names, emails, dates of birth, diagnoses, real contact lists, or recorded voice. Do not upload touch trajectories. Avoid analytics in the pilot until the team has decided what a learner can understand and consent to.

A later real class system needs authenticated instructor access, explicit joining, learner-controlled aliases, server-side authorization, opt-out, clear data retention, and deletion. Make a shared-tablet session safe: an instructor should be able to select a learner without leaking another learner's record. Do not build a public leaderboard by publishing local demo scores.

Class progress and coin balances need server authority if shared. The server should store minimal completion events, reject duplicate reward claims, and support offline reconciliation. Keep offline events distinguishable from instructor verification. Backups and multi-device syncing remain separate milestones, not implied prototype capabilities.

## 9. Pilot and delivery roadmap

| Stage | Work | Exit evidence |
| --- | --- | --- |
| 0 — Current prototype | Modern home, lessons, guided/touch choices, dings, local rewards, sample class, PWA shell | Desktop interaction checks and an explicit report of device-test gaps |
| 1 — Instructor review | Verify wording on classroom iPhones and Android devices; check customized gestures, Zoom, and navigation style | Signed-off curriculum matrix and documented recovery steps |
| 2 — Small supervised pilot | Five to eight consenting learners across vision and dexterity needs; 20–30 minute sessions | Most learners complete basics with their screen reader and recover from a wrong turn |
| 3 — Accessibility and reliability | Address focus, speech overlap, touch tolerance, offline state, storage recovery, and large-text issues | Manual assistive-tech checklist passes on target hardware |
| 4 — Classroom beta | Optional alias-based groups, instructor progress, backup, robust reward ledger | Authorization/privacy review and successful offline reconciliation |
| 5 — Wider release | Content governance, translated audio, instructor materials, support process | Documented browser/device support and regression ownership |

Measure task completion, assistance required, confidence before/after, successful repetition at the next session, and ability to exit or undo. Record observations with consent and avoid ranking learners by error rate. Do not collect more detail merely because instrumentation makes it easy.

### Required device test matrix

- iPhone Safari and installed Home Screen mode, both online and offline after installation.
- A small screen and a larger screen; Face ID and a Home-button model where available.
- Supported classroom iOS releases, with VoiceOver on; VoiceOver plus Zoom for curtain lesson wording.
- Touch practice with screen-reader consumption explicitly understood; no expectation that captured browser touches prove OS actions.
- TalkBack on at least one Pixel-like device and the actual Samsung or other OEM model used in class.
- Large text, browser zoom to 200%, reduced motion, increased contrast, keyboard-only navigation, and Switch Control where available.
- No audio, muted audio, Bluetooth audio, screen reader speech, app background/foreground, incoming interruption, and device rotation mid-lesson.
- Storage denied/full/corrupt, service-worker update, first offline launch, returning offline launch, and returning after website data is cleared.

### Concrete acceptance scenarios

1. A VoiceOver learner opens a lesson, hears its title and instructions, records guided practice, gets a concise result, and returns to the originating card without a focus trap.
2. A learner uses the optional pad with the correct fingers and direction, completes the repetitions, receives the listed first-completion reward once, reloads, and sees the saved result.
3. A mismatch or cancellation does not count as success. Leaving a lesson prevents late callbacks from awarding coins.
4. Switching to Android changes the relevant instructions and available lessons. Screen Curtain and iPhone Home gestures are absent from that course.
5. Disabling sound preserves every instruction and reward through text. A screen reader does not have to compete with automatic narration.
6. After one successful cache installation, a cold offline launch opens the curriculum and preserves local progress; unavailable network services show an understandable state.
7. At a 320 CSS-pixel width and enlarged text, controls remain readable and reachable without horizontal page scrolling or content hidden behind navigation.

## 10. Honest limits of the early prototype

The prototype is a learning interaction and engineering foundation. It is not an authenticated classroom platform, an assessment of dexterity, a verified screen-reader certification, or a tool that controls phone settings. Guided activities are self-reported; web touch matches are motor-pattern checks; neither confirms a system action.

It cannot independently verify a real call, a new contact, Home Screen navigation, app closing, the rotor option, or Screen Curtain. Sample classmates are demonstration data. Device-local records are not a cloud backup. Safari and PWA support requires testing on actual iPhones before making a release claim; desktop WebKit or mobile emulation alone cannot validate VoiceOver routing, system gestures, audio interruptions, or installation.

Use this foundation to run a small, respectful pilot, observe where learners feel confident or stuck, and improve those moments before adding more game mechanics.
