const {test} = require('node:test');
const assert = require('node:assert/strict');
const {analyze, matches, attach} = require('../dist/gestures.js');

const path = (id, points) => ({id, points: points.map(([x, y, t]) => ({x, y, t}))});
const stroke = (paths, duration = 300) => ({paths, duration});
const line = (id, x, y, dx, dy) => path(id, [[x, y, 0], [x + dx / 2, y + dy / 2, 150], [x + dx, y + dy, 300]]);

test('tap allows senior-friendly finger jitter but a long press is a hold', () => {
  const paths = [path(1, [[10, 10, 0], [20, 14, 200]])];
  assert.equal(analyze(stroke(paths, 200)).kind, 'tap');
  assert.equal(analyze(stroke(paths, 700)).kind, 'hold');
  assert.equal(analyze(stroke([], 0)).kind, 'unknown');
});

test('swipe needs distance, consistent direction and an axis', () => {
  assert.deepEqual(analyze(stroke([line(1, 0, 0, 100, 8)])).direction, 'right');
  assert.equal(analyze(stroke([line(1, 0, 0, 35, 0)])).kind, 'unknown');
  assert.equal(analyze(stroke([line(1, 0, 0, 100, 100)])).kind, 'unknown');
  assert.equal(analyze(stroke([line(1, 0, 0, 100, 0), line(2, 100, 50, -100, 0)])).kind, 'unknown');
  const up = analyze(stroke([line(1, 10, 200, 0, -100), line(2, 50, 200, 0, -100), line(3, 90, 200, 0, -100)]));
  assert.ok(matches(up, {kind: 'swipe', fingers: 3, direction: 'vertical'}));
  assert.ok(!matches(up, {kind: 'swipe', fingers: 2, direction: 'vertical'}));
  assert.ok(!matches(up, {kind: 'swipe', fingers: 3, direction: 'down'}));
});

test('double/triple tap exact counts and guided actions cannot auto-complete', () => {
  assert.ok(matches({kind: 'tap', fingers: 2, taps: 2}, {kind: 'tap', fingers: 2, taps: 2}));
  assert.ok(!matches({kind: 'tap', fingers: 2, taps: 3}, {kind: 'tap', fingers: 2, taps: 2}));
  assert.ok(!matches({kind: 'tap', fingers: 1, taps: 1}, {kind: 'guided', fingers: 1}));
  assert.ok(!matches({kind: 'tap', fingers: 1, taps: 1}, {kind: 'tap', fingers: 2}));
});

test('scrub requires both fingers to reverse horizontally at least twice', () => {
  const scribble = y => [[0, y, 0], [80, y, 100], [0, y + 12, 200], [80, y + 20, 300]];
  assert.equal(analyze(stroke([path(1, scribble(10)), path(2, scribble(70))])).kind, 'scrub');
  const once = y => [[0, y, 0], [80, y, 150], [0, y, 300]];
  assert.equal(analyze(stroke([path(1, once(10)), path(2, once(70))])).kind, 'unknown');
  assert.equal(analyze(stroke([path(1, scribble(10))])).kind, 'unknown');
});

test('rotor compares relative finger angle and unwraps the -180/180 boundary', () => {
  const angles = [170, 180, 200, 220];
  const fixed = path(1, angles.map((_, i) => [150, 150, i * 100]));
  const orbit = path(2, angles.map((angle, i) => [150 + Math.cos(angle * Math.PI / 180) * 75, 150 + Math.sin(angle * Math.PI / 180) * 75, i * 100]));
  const result = analyze(stroke([fixed, orbit]));
  assert.equal(result.kind, 'rotor');
  assert.ok(Math.abs(result.angle - 50) < 0.01);
  assert.equal(analyze(stroke([line(1, 0, 0, 100, 0), line(2, 60, 0, 100, 0)])).kind, 'swipe');
});

test('staggered fingers are compared only during temporal overlap', () => {
  const result = analyze(stroke([
    path(1, [[20, 20, 0], [20, 20, 100]]),
    path(2, [[80, 20, 200], [20, 80, 300]])
  ]));
  assert.notEqual(result.kind, 'rotor');
});

test('mixed replacement fingers are not mislabeled as a multi-finger gesture', () => {
  assert.equal(analyze({...stroke([line(1, 0, 0, 100, 0), line(2, 30, 0, 100, 0)]), maxFingers: 1}).kind, 'unknown');
});

test('attach cleans up all listeners and restores touch behavior', () => {
  const listeners = new Map();
  const element = {style: {touchAction: 'pan-y'}, addEventListener: (name, handler) => listeners.set(name, handler), removeEventListener: name => listeners.delete(name)};
  const cleanup = attach(element);
  assert.equal(element.style.touchAction, 'none');
  assert.ok(listeners.size >= 9);
  cleanup();
  assert.equal(listeners.size, 0);
  assert.equal(element.style.touchAction, 'pan-y');
});

test('touch batches retain double/triple counts, with no mouse duplication', async () => {
  const listeners = new Map(), results = [];
  const element = {
    style: {touchAction: ''},
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: name => listeners.delete(name),
    getBoundingClientRect: () => ({left: 10, top: 20})
  };
  const cleanup = attach(element, {onGesture: result => results.push(result), getExpected: () => ({kind: 'tap', fingers: 2, taps: 2})});
  const touches = [{identifier: 1, clientX: 50, clientY: 80}, {identifier: 2, clientX: 100, clientY: 80}];
  for (let i = 0; i < 3; i++) {
    listeners.get('touchstart')({changedTouches: touches});
    // Touch-generated pointer events must not create duplicate contacts or results.
    listeners.get('pointerdown')({pointerType: 'touch', button: 0});
    listeners.get('touchend')({changedTouches: touches});
  }
  assert.equal(results.length, 0);
  await new Promise(resolve => setTimeout(resolve, 430));
  assert.equal(results.length, 1);
  assert.equal(results[0].fingers, 2);
  assert.equal(results[0].taps, 3);
  assert.ok(!matches(results[0], {kind: 'tap', fingers: 2, taps: 2}));
  cleanup();
});
