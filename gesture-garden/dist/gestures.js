/* Raw-touch practice only: VoiceOver/TalkBack may consume gestures before a page sees them.
 * This module reports motion patterns, never an operating-system action or screen-reader state. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GestureEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const TAP_WINDOW = 400;
  const TAP_SLOP = 26;
  const HOLD_MS = 650;
  const SWIPE_MIN = 55;
  const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  const last = array => array[array.length - 1];

  function pathLength(points) {
    return points.slice(1).reduce((sum, point, i) => sum + distance(points[i], point), 0);
  }

  function reversals(points) {
    let anchor = points[0].x;
    let extreme = anchor;
    let direction = 0;
    let turns = 0;
    for (const point of points.slice(1)) {
      if (!direction) {
        if (Math.abs(point.x - anchor) >= 20) {
          direction = Math.sign(point.x - anchor);
          extreme = point.x;
        }
      } else if ((point.x - extreme) * direction >= 0) {
        extreme = point.x;
      } else if (Math.abs(point.x - extreme) >= 20) {
        turns++;
        direction *= -1;
        extreme = point.x;
      }
    }
    return turns;
  }

  function sample(points, time) {
    if (time <= points[0].t) return points[0];
    if (time >= last(points).t) return last(points);
    let i = 1;
    while (points[i].t < time) i++;
    const a = points[i - 1], b = points[i];
    const fraction = b.t === a.t ? 1 : (time - a.t) / (b.t - a.t);
    return {x: a.x + (b.x - a.x) * fraction, y: a.y + (b.y - a.y) * fraction};
  }

  function rotation(paths) {
    const a = paths[0].points, b = paths[1].points;
    // Only compare the period during which both fingers were actually down.
    const start = Math.max(a[0].t, b[0].t);
    const end = Math.min(last(a).t, last(b).t);
    if (end <= start) return 0;
    const times = [...new Set([start, end, ...a.map(p => p.t), ...b.map(p => p.t)])]
      .filter(t => t >= start && t <= end).sort((x, y) => x - y);
    let previous = null, total = 0;
    const radii = [];
    for (const time of times) {
      const p = sample(a, time), q = sample(b, time);
      const radius = distance(p, q);
      if (radius < 24) return 0;
      radii.push(radius);
      const angle = Math.atan2(q.y - p.y, q.x - p.x);
      if (previous !== null) {
        let delta = angle - previous;
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;
        total += delta;
      }
      previous = angle;
    }
    // A pinch with a large change in finger spacing is not a rotor rotation.
    if (Math.min(...radii) / Math.max(...radii) < 0.45) return 0;
    return total * 180 / Math.PI;
  }

  function analyze(stroke) {
    const paths = (stroke && stroke.paths || []).filter(path => Array.isArray(path.points) && path.points.length);
    const fingers = stroke && stroke.maxFingers || paths.length;
    const result = {kind: 'unknown', fingers, taps: 1};
    if (!paths.length || fingers !== paths.length) return result;
    const duration = Number.isFinite(stroke.duration) ? stroke.duration : Math.max(...paths.map(p => last(p.points).t)) - Math.min(...paths.map(p => p.points[0].t));
    const moved = paths.map(path => Math.max(...path.points.map(p => distance(path.points[0], p))));
    if (moved.every(d => d <= TAP_SLOP)) {
      return {...result, kind: duration >= HOLD_MS ? 'hold' : 'tap', duration};
    }
    if (fingers === 2) {
      const angle = rotation(paths);
      if (Math.abs(angle) >= 35) return {...result, kind: 'rotor', angle};
      const scrub = paths.every(path => {
        const xs = path.points.map(p => p.x), ys = path.points.map(p => p.y);
        const width = Math.max(...xs) - Math.min(...xs);
        return width >= 50 && Math.max(...ys) - Math.min(...ys) <= width * 1.4 && reversals(path.points) >= 2;
      });
      if (scrub) return {...result, kind: 'scrub'};
    }
    const vectors = paths.map(path => {
      const first = path.points[0], end = last(path.points);
      const dx = end.x - first.x, dy = end.y - first.y;
      const horizontal = Math.abs(dx) >= Math.abs(dy) * 1.5;
      const vertical = Math.abs(dy) >= Math.abs(dx) * 1.5;
      const direction = horizontal ? (dx > 0 ? 'right' : 'left') : vertical ? (dy > 0 ? 'down' : 'up') : null;
      return {direction, length: Math.hypot(dx, dy), traveled: pathLength(path.points)};
    });
    if (vectors.every(v => v.direction && v.length >= SWIPE_MIN && v.length / Math.max(v.traveled, 1) >= 0.65)
      && vectors.every(v => v.direction === vectors[0].direction)) {
      return {...result, kind: 'swipe', direction: vectors[0].direction};
    }
    return result;
  }

  function matches(result, expected) {
    if (!result || !expected || expected.kind === 'guided' || result.kind !== expected.kind) return false;
    if (result.fingers !== expected.fingers) return false;
    if (result.kind === 'tap' && result.taps !== (expected.taps || 1)) return false;
    if (expected.direction) {
      if (expected.direction === 'horizontal') return result.direction === 'left' || result.direction === 'right';
      if (expected.direction === 'vertical') return result.direction === 'up' || result.direction === 'down';
      return result.direction === expected.direction;
    }
    return true;
  }

  function attach(element, options) {
    options = options || {};
    const onGesture = typeof options.onGesture === 'function' ? options.onGesture : function () {};
    const onActivity = typeof options.onActivity === 'function' ? options.onActivity : function () {};
    const active = new Map();
    let paths = new Map(), start = 0, maxFingers = 0, mouseDown = false;
    let batch = null, tapTimer = null, disposed = false;
    const oldTouchAction = element.style.touchAction;
    element.style.touchAction = 'none';
    const now = () => performance.now();
    const point = (contact, t) => {
      const rect = element.getBoundingClientRect();
      return {x: contact.clientX - rect.left, y: contact.clientY - rect.top, t};
    };
    function activity() {
      onActivity({points: [...active.values()].map(p => ({x: p.x, y: p.y})), active: active.size > 0});
    }
    function flush() {
      clearTimeout(tapTimer);
      tapTimer = null;
      if (batch && !disposed) onGesture(batch);
      batch = null;
    }
    function cancelBatch() {
      clearTimeout(tapTimer);
      tapTimer = null;
      batch = null;
    }
    function finish(t) {
      const result = analyze({paths: [...paths.values()], duration: t - start, maxFingers});
      paths = new Map();
      maxFingers = 0;
      if (result.kind === 'tap') {
        // begin() already checked the inter-tap gap. A deliberate release may take longer.
        if (batch && batch.fingers === result.fingers) {
          batch = {...result, taps: batch.taps + 1, endedAt: t};
        } else {
          flush();
          batch = {...result, endedAt: t};
        }
        clearTimeout(tapTimer);
        // Always wait for a possible next tap, even when the requested count was reached.
        // Otherwise a triple tap could be incorrectly rewarded as a double tap.
        tapTimer = setTimeout(flush, TAP_WINDOW);
      } else {
        flush();
        onGesture(result);
      }
    }
    function begin(id, contact, t) {
      if (!active.size) {
        start = t;
        paths = new Map();
        maxFingers = 0;
        // A following tap can take up to HOLD_MS to land/release without splitting the sequence.
        clearTimeout(tapTimer);
        tapTimer = null;
        if (batch && t - batch.endedAt > TAP_WINDOW) flush();
      }
      const p = point(contact, t);
      active.set(id, p);
      paths.set(id, {id, points: [p]});
      maxFingers = Math.max(maxFingers, active.size);
    }
    function move(id, contact, t) {
      if (!active.has(id)) return;
      const p = point(contact, t);
      active.set(id, p);
      paths.get(id).points.push(p);
    }
    function end(id, contact, t) {
      if (!active.has(id)) return;
      move(id, contact, t);
      active.delete(id);
      if (!active.size) finish(t);
    }
    function stopEvent(event) { if (event.cancelable) event.preventDefault(); }
    function touchStart(event) {
      stopEvent(event);
      const t = now();
      for (const contact of event.changedTouches) begin(contact.identifier, contact, t);
      activity();
    }
    function touchMove(event) {
      stopEvent(event);
      const t = now();
      for (const contact of event.changedTouches) move(contact.identifier, contact, t);
      activity();
    }
    function touchEnd(event) {
      stopEvent(event);
      const t = now();
      for (const contact of event.changedTouches) end(contact.identifier, contact, t);
      activity();
    }
    function cancel() {
      active.clear();
      paths.clear();
      mouseDown = false;
      cancelBatch();
      activity();
    }
    function pointerDown(event) {
      if (event.pointerType !== 'mouse' || event.button !== 0 || active.size) return;
      stopEvent(event);
      mouseDown = true;
      if (element.setPointerCapture) element.setPointerCapture(event.pointerId);
      begin('mouse', event, now());
      activity();
    }
    function pointerMove(event) {
      if (!mouseDown || event.pointerType !== 'mouse') return;
      move('mouse', event, now());
      activity();
    }
    function pointerUp(event) {
      if (!mouseDown || event.pointerType !== 'mouse') return;
      mouseDown = false;
      end('mouse', event, now());
      activity();
    }
    function contextMenu(event) { event.preventDefault(); }
    const listeners = [
      ['touchstart', touchStart], ['touchmove', touchMove], ['touchend', touchEnd], ['touchcancel', cancel],
      ['pointerdown', pointerDown], ['pointermove', pointerMove], ['pointerup', pointerUp], ['pointercancel', cancel],
      ['lostpointercapture', function () { if (mouseDown) cancel(); }], ['contextmenu', contextMenu]
    ];
    for (const [type, handler] of listeners) element.addEventListener(type, handler, {passive: false});
    return function cleanup() {
      disposed = true;
      cancel();
      for (const [type, handler] of listeners) element.removeEventListener(type, handler);
      element.style.touchAction = oldTouchAction;
    };
  }

  return {analyze, matches, attach};
});
