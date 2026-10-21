/* Curriculum is deliberately separate from presentation and gesture detection.
   A recorded web gesture is motor practice, not proof of an OS action.
   Source notes and release gates are in ../FOUNDATION.md. */
window.GESTURE_LESSONS = [
  {
    id: 'first-touch', title: 'A touch of discovery', subtitle: 'Single tap · one finger', icon: 'tap', category: 'Basics', minutes: 2, coins: 20,
    gesture: { kind: 'tap', fingers: 1, taps: 1 }, platforms: ['ios', 'android'],
    instructions: { ios: 'Touch an item once to select it and hear VoiceOver describe it.', android: 'Touch an item once to select it; TalkBack describes what is beneath your finger.' },
    purpose: 'Get comfortable finding what is on your screen before opening it.',
    steps: ['Rest your hand comfortably beside your phone.', 'Find one item and listen to its name.', 'Try another item. There is no need to rush.'],
    mission: 'Find the name of a button in this app with your screen reader, without activating it.'
  },
  {
    id: 'double-tap', title: 'Open a little possibility', subtitle: 'Double tap · one finger', icon: 'double', category: 'Basics', minutes: 2, coins: 20,
    gesture: { kind: 'tap', fingers: 1, taps: 2 }, platforms: ['ios', 'android'],
    instructions: { ios: 'Select an item, then double-tap with one finger to activate it.', android: 'Focus an item, then double-tap with one finger to activate it.' },
    purpose: 'Turn a selected button into an action, like opening your next lesson.',
    steps: ['Listen for the item you want.', 'Make two light taps, close together.', 'Listen for the result before trying again.'],
    mission: 'With your screen reader on, select and activate a lesson button.'
  },
  {
    id: 'find-your-way', title: 'Find your way', subtitle: 'Flick left & right · one finger', icon: 'swipe', category: 'Basics', minutes: 3, coins: 25,
    gesture: { kind: 'swipe', fingers: 1, direction: 'horizontal' }, platforms: ['ios', 'android'],
    instructions: { ios: 'Flick right for the next item, or left for the previous one.', android: 'Swipe right to the next item; swipe left to the previous one.' },
    purpose: 'Explore an orderly path through buttons and text without searching the whole screen.',
    steps: ['Choose a comfortable place near the middle of the screen.', 'Brush your finger across, then lift it.', 'Pause to hear the new item.'],
    mission: 'Visit three buttons in this app, then move back to the first.'
  },
  {
    id: 'magic-tap', title: 'Make a little magic', subtitle: 'Double tap · two fingers', icon: 'magic', category: 'Everyday', minutes: 3, coins: 30,
    gesture: { kind: 'tap', fingers: 2, taps: 2 }, platforms: ['ios', 'android'],
    instructions: { ios: 'Double-tap with two fingers for the current action, such as playing or pausing supported media.', android: 'On supported TalkBack devices, double-tap with two fingers to control media or a call.' },
    purpose: 'Build the two-finger rhythm used for a useful everyday shortcut.',
    steps: ['Space two fingers comfortably apart.', 'Touch down together, twice.', 'Let both fingers leave the screen between taps.'],
    mission: 'With a trainer, try this shortcut during a short music track. Practice away from live calls.',
    modeNote: 'A web practice pad rehearses the movement. The active app decides what the real shortcut does.'
  },
  {
    id: 'take-a-pause', title: 'A moment of quiet', subtitle: 'Single tap · two fingers', icon: 'tap', category: 'Everyday', minutes: 2, coins: 20,
    gesture: { kind: 'tap', fingers: 2, taps: 1 }, platforms: ['ios', 'android'],
    instructions: { ios: 'Tap once with two fingers to pause or resume VoiceOver speech.', android: 'On devices supporting this TalkBack gesture, tap once with two fingers to pause or resume speech.' },
    purpose: 'Feel comfortable taking a listening break whenever you need one.',
    steps: ['Let the screen reader begin a short passage.', 'Make one light two-finger tap.', 'Repeat when you are ready to listen again.'],
    mission: 'Pause and resume a short spoken passage using your screen reader.'
  },
  {
    id: 'keep-scrolling', title: 'Keep on exploring', subtitle: 'Swipe up & down · three fingers', icon: 'scroll', category: 'Everyday', minutes: 3, coins: 25,
    gesture: { kind: 'swipe', fingers: 3, direction: 'vertical' }, platforms: ['ios'],
    instructions: { ios: 'With VoiceOver, swipe with three fingers to scroll a page or list.' },
    purpose: 'Reach the part of a list that is currently outside the screen.',
    steps: ['Make room for three fingers near the middle of the screen.', 'Move all three together, then lift.', 'Listen for the new page position.'],
    mission: 'Scroll a familiar long page with VoiceOver and return to where you began.'
  },
  {
    id: 'home-pages', title: 'A new page awaits', subtitle: 'Swipe left & right · three fingers', icon: 'home', category: 'Everyday', minutes: 3, coins: 25,
    gesture: { kind: 'swipe', fingers: 3, direction: 'horizontal' }, platforms: ['ios'],
    instructions: { ios: 'Use a three-finger sideways swipe to move between Home Screen pages with VoiceOver.' },
    purpose: 'Find apps that live on another Home Screen page.',
    steps: ['Rehearse a sideways movement on the practice pad.', 'Go to your Home Screen when you feel ready.', 'Listen for the page change, then try returning.'],
    mission: 'With a trainer, move to another Home Screen page and back.',
    modeNote: 'The web app cannot see your Home Screen or verify a page change.'
  },
  {
    id: 'read-along', title: 'Let the story flow', subtitle: 'Swipe up & down · two fingers', icon: 'swipe', category: 'Everyday', minutes: 3, coins: 25,
    gesture: { kind: 'swipe', fingers: 2, direction: 'vertical' }, platforms: ['ios'],
    instructions: { ios: 'Swipe up with two fingers to read from the top, or down to read from the current item.' },
    purpose: 'Enjoy a longer page without moving through it one item at a time.',
    steps: ['Choose a short page you would like to hear.', 'Rehearse moving both fingers together.', 'Try the reading command with VoiceOver and listen.'],
    mission: 'Read a short passage continuously, then pause when you have heard enough.'
  },
  {
    id: 'rotor', title: 'Turn the dial', subtitle: 'Two-finger rotation · VoiceOver rotor', icon: 'rotor', category: 'Next steps', minutes: 4, coins: 35,
    gesture: { kind: 'guided', fingers: 2 }, platforms: ['ios'],
    instructions: { ios: 'Rotate two fingers like a dial to choose a rotor option; flick up or down with one finger to use it.' },
    purpose: 'Choose how you move through text, or adjust how VoiceOver speaks.',
    steps: ['Imagine a small dial between two fingertips.', 'Rotate gently until you hear the option you want.', 'Lift both fingers, then try one up or down flick.'],
    mission: 'Find Words in the rotor, then move through a short passage word by word.',
    modeNote: 'Guided practice: VoiceOver owns the rotor. This app cannot inspect its setting or grade the rotation.'
  },
  {
    id: 'adjust-and-act', title: 'Find the right action', subtitle: 'Flick up & down · one finger', icon: 'swipe', category: 'Next steps', minutes: 4, coins: 30,
    gesture: { kind: 'swipe', fingers: 1, direction: 'vertical' }, platforms: ['ios', 'android'],
    instructions: { ios: 'Up and down flicks use the current rotor option or available item actions; listen to what is selected.', android: 'Up and down swipes use the chosen TalkBack reading control or adjust a supported focused control.' },
    purpose: 'Understand that the same movement can do different things depending on context.',
    steps: ['Listen to the selected control or action.', 'Make one short up or down movement.', 'Listen again before continuing or activating an action.'],
    mission: 'With a trainer, explore available actions on a recent call, then learn how to add that number to Contacts.',
    modeNote: 'Contact menus vary by device and app. This prototype does not read call history or create contacts.'
  },
  {
    id: 'context-menu', title: 'A few more possibilities', subtitle: 'Open a menu · guided lesson', icon: 'hold', category: 'Next steps', minutes: 4, coins: 30,
    gesture: { kind: 'guided', fingers: 1 }, platforms: ['ios', 'android'],
    instructions: { ios: 'For a selected item, Apple lists a one-finger triple tap for a long press. Confirm the available action with your trainer.', android: 'Focus an item, then double-tap and hold to long-press it with TalkBack.' },
    purpose: 'Discover the additional actions available for an item.',
    steps: ['Start with an item chosen by your trainer.', 'Use the long-press command for your screen reader.', 'Listen to the menu, and choose Cancel when finished.'],
    mission: 'Open and dismiss an item menu with a trainer, without changing its contents.',
    modeNote: 'A normal single-finger hold is not a universal screen-reader menu command. Device settings can change gesture assignments.'
  },
  {
    id: 'go-back', title: 'Find your way back', subtitle: 'Two-finger scrub · VoiceOver', icon: 'swipe', category: 'Next steps', minutes: 3, coins: 30,
    gesture: { kind: 'guided', fingers: 2 }, platforms: ['ios'],
    instructions: { ios: 'Move two fingers back and forth in a Z-like scrub to dismiss a supported alert or go back.' },
    purpose: 'Have a familiar way to leave a screen when you are finished.',
    steps: ['Keep two fingertips comfortably apart.', 'Rehearse a gentle back-and-forth movement.', 'Try it on a trainer-selected screen with a known way back.'],
    mission: 'Open a harmless information screen, then use the scrub to return.',
    modeNote: 'Guided practice: not every app responds to this command. A visible Close or Back button remains available here.'
  },
  {
    id: 'screen-curtain', title: 'A little more privacy', subtitle: 'Triple tap · three fingers', icon: 'curtain', category: 'Next steps', minutes: 4, coins: 35,
    gesture: { kind: 'guided', fingers: 3, taps: 3 }, platforms: ['ios'],
    instructions: { ios: 'With VoiceOver, three-finger triple tap toggles Screen Curtain. If Zoom is also on, use four taps instead.' },
    purpose: 'Learn how the display can be private while VoiceOver keeps working.',
    steps: ['Ask your trainer to explain how to restore the display first.', 'Rehearse the rhythm without changing your phone settings.', 'Try the real command only when you feel ready, then restore the display.'],
    mission: 'With a trainer, turn Screen Curtain on and immediately back off.',
    modeNote: 'This app cannot toggle or verify Screen Curtain. Three-finger double tap normally mutes speech; it is a different command.'
  },
  {
    id: 'app-switcher', title: 'Pick up where you left off', subtitle: 'App Switcher · guided lesson', icon: 'home', category: 'Next steps', minutes: 5, coins: 40,
    gesture: { kind: 'guided', fingers: 1 }, platforms: ['ios', 'android'],
    instructions: { ios: 'With Face ID and VoiceOver, drag from the bottom edge until the second vibration or three tones, then lift. On Home-button models, double-click Home.', android: 'With TalkBack, use the assigned Recents command; with gesture navigation, two-finger swipe up from the bottom and hold.' },
    purpose: 'Return to another app confidently without losing your place.',
    steps: ['Practice with a trainer who knows your phone model.', 'Open the app switcher and listen as you browse.', 'Activate the app you want, then return here.'],
    mission: 'Switch to another familiar app and return. Learn how to close an unresponsive app with your trainer.',
    modeNote: 'App switching and closing happen outside the web app and cannot be verified here. Routine closing is not a learning requirement.'
  },
  {
    id: 'group-navigation', title: 'Explore together', subtitle: 'Two-finger sideways swipe · groups', icon: 'swipe', category: 'Next steps', minutes: 3, coins: 25,
    gesture: { kind: 'guided', fingers: 2, direction: 'horizontal' }, platforms: ['ios'],
    instructions: { ios: 'In VoiceOver Grouped navigation, swipe right with two fingers to enter a group, or left to leave it.' },
    purpose: 'Understand when a set of related controls can be explored as a group.',
    steps: ['Ask your trainer whether Grouped navigation is enabled.', 'Find an example group and listen to its description.', 'Enter the group, explore an item, then leave it.'],
    mission: 'With a trainer, explore a group of controls on your device.',
    modeNote: 'This depends on VoiceOver Navigation Style and the app. It is not a universal command for every list.'
  },
  {
    id: 'talkback-scroll', title: 'More room to explore', subtitle: 'Swipe up & down · two fingers', icon: 'scroll', category: 'Everyday', minutes: 3, coins: 25,
    gesture: { kind: 'swipe', fingers: 2, direction: 'vertical' }, platforms: ['android'],
    instructions: { ios: '', android: 'Use two fingers together to scroll with TalkBack; the iPhone lesson uses a different finger count.' },
    purpose: 'Move through a longer page or list on your Android phone.',
    steps: ['Place two fingertips near the middle of the screen.', 'Move both together and lift.', 'Listen for your new position before moving again.'],
    mission: 'With TalkBack, scroll a familiar long list and return to the starting point.',
    modeNote: 'TalkBack gesture assignments and multi-finger support can vary. Three-finger sideways gestures may change reading controls.'
  }
];
