const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs/promises');
const path = require('node:path');

const dist = path.resolve(__dirname, '../dist');
const origin = 'https://example.test';
const scope = `${origin}/garden/`;

function basicResponse(body, status = 200) {
  const response = new Response(body, { status });
  // A real same-origin network fetch has type "basic"; Node-created Responses
  // have type "default", so model the browser boundary here.
  Object.defineProperty(response, 'type', { value: 'basic' });
  return response;
}

async function harness() {
  const listeners = new Map();
  const stores = new Map();
  const calls = [];
  let network = async request => {
    const url = new URL(typeof request === 'string' ? request : request.url);
    const relative = url.pathname.slice('/garden/'.length) || 'index.html';
    try { return basicResponse(await fs.readFile(path.join(dist, relative))); }
    catch { return basicResponse('missing', 404); }
  };
  let claimed = 0;
  let skipped = 0;
  const key = request => new URL(typeof request === 'string' ? request : request.url || String(request), scope).href;
  const caches = {
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async match(request) {
      for (const entries of stores.values()) {
        const hit = entries.get(key(request));
        if (hit) return hit.clone();
      }
    },
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name);
      return {
        async addAll(requests) {
          // Cache.addAll fails atomically if any requested resource fails.
          const fetched = await Promise.all(requests.map(async request => {
            const response = await network({ url: key(request), method: 'GET' });
            if (!response.ok) throw new TypeError('A precache resource failed');
            return [key(request), response];
          }));
          for (const [url, response] of fetched) entries.set(url, response.clone());
        },
        async match(request) { return entries.get(key(request))?.clone(); },
        async put(request, response) { entries.set(key(request), response.clone()); }
      };
    }
  };
  const context = vm.createContext({
    URL, Response, caches,
    fetch: async request => { calls.push(key(request)); return network(request); },
    self: {
      location: { origin }, registration: { scope },
      clients: { async claim() { claimed += 1; } },
      async skipWaiting() { skipped += 1; },
      addEventListener(type, listener) { listeners.set(type, listener); }
    }
  });
  vm.runInContext(await fs.readFile(path.join(dist, 'sw.js'), 'utf8'), context);
  return {
    stores, calls,
    setNetwork(handler) { network = handler; },
    async lifecycle(type) {
      let pending;
      listeners.get(type)({ waitUntil(promise) { pending = promise; } });
      await pending;
    },
    fetch(url, extra = {}) {
      let result;
      listeners.get('fetch')({
        request: { url: new URL(url, scope).href, method: 'GET', mode: 'cors', ...extra },
        respondWith(promise) { result = Promise.resolve(promise); }
      });
      return result;
    },
    get claimed() { return claimed; },
    get skipped() { return skipped; }
  };
}

test('first installation saves the actual app shell and every local HTML dependency for offline use', async () => {
  const sw = await harness();
  await sw.lifecycle('install');
  const entries = [...sw.stores.values()][0];
  const html = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
  const dependencies = [...html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)]
    .map(match => match[1]);
  assert.ok(dependencies.includes('app.js'), 'The test must cover the real application entrypoint');
  for (const asset of ['index.html', ...dependencies]) {
    assert.ok(entries.has(new URL(asset, scope).href), `${asset} must be available offline`);
  }
  const manifest = JSON.parse(await fs.readFile(path.join(dist, 'manifest.webmanifest'), 'utf8'));
  for (const icon of manifest.icons) assert.ok(entries.has(new URL(icon.src, scope).href));
  assert.equal(sw.skipped, 0, 'Installing an update must not interrupt an existing practice session');
});

test('navigation prefers a working network response and recovers to the saved app when offline or unavailable', async () => {
  const sw = await harness();
  await sw.lifecycle('install');
  sw.setNetwork(async () => basicResponse('<h1>Fresh app</h1>'));
  assert.equal(await (await sw.fetch('./', { mode: 'navigate' })).text(), '<h1>Fresh app</h1>');
  sw.setNetwork(async () => { throw new TypeError('offline'); });
  const offline = await sw.fetch('./lesson', { mode: 'navigate' });
  assert.equal(offline.status, 200);
  assert.match(await offline.text(), /Gesture Garden/i);
  sw.setNetwork(async () => basicResponse('Temporarily unavailable', 503));
  assert.equal((await sw.fetch('./', { mode: 'navigate' })).status, 200);
  const empty = await harness();
  empty.setNetwork(async () => { throw new TypeError('offline before install'); });
  const firstOffline = await empty.fetch('./', { mode: 'navigate' });
  assert.equal(firstOffline.status, 503);
  assert.match(await firstOffline.text(), /online once/i);
});

test('cached assets work offline while foreign, out-of-scope, API, and non-GET requests are left to the browser', async () => {
  const sw = await harness();
  await sw.lifecycle('install');
  sw.setNetwork(async () => { throw new TypeError('offline'); });
  assert.equal((await sw.fetch('./app.js')).status, 200);
  assert.equal(sw.calls.length, 0, 'A saved asset must not need the network');
  assert.equal(sw.fetch('https://unrelated.test/garden/app.js'), undefined);
  assert.equal(sw.fetch(`${origin}/other/app.js`), undefined);
  assert.equal(sw.fetch('./api/progress'), undefined);
  assert.equal(sw.fetch('./app.js', { method: 'POST' }), undefined);
});

test('successful asset recovery is cached and failed responses never poison the offline copy', async () => {
  const sw = await harness();
  sw.setNetwork(async () => basicResponse('Temporary error', 503));
  assert.equal((await sw.fetch('./styles.css')).status, 503);
  assert.equal([...sw.stores.values()][0].size, 0);
  sw.setNetwork(async () => basicResponse('body { color: green; }'));
  assert.equal(await (await sw.fetch('./styles.css')).text(), 'body { color: green; }');
  sw.setNetwork(async () => { throw new TypeError('offline'); });
  assert.equal(await (await sw.fetch('./styles.css')).text(), 'body { color: green; }');
});

test('activation removes obsolete app caches only; failed installation preserves the previous version', async () => {
  const sw = await harness();
  sw.stores.set('gesture-garden-obsolete', new Map());
  sw.stores.set('unrelated-app-cache', new Map());
  await sw.lifecycle('install');
  await sw.lifecycle('activate');
  assert.equal(sw.stores.has('gesture-garden-obsolete'), false);
  assert.equal(sw.stores.has('unrelated-app-cache'), true);
  assert.equal([...sw.stores.keys()].filter(name => name.startsWith('gesture-garden-')).length, 1);
  assert.equal(sw.claimed, 1);
  assert.equal(sw.skipped, 0);

  const failed = await harness();
  const oldEntries = new Map([['https://example.test/garden/index.html', basicResponse('Previous working app')]]);
  failed.stores.set('gesture-garden-previous', oldEntries);
  failed.setNetwork(async request => request.url.endsWith('app.js')
    ? basicResponse('Missing required asset', 404) : basicResponse('ok'));
  await assert.rejects(failed.lifecycle('install'), /precache resource failed/);
  assert.equal(failed.stores.get('gesture-garden-previous'), oldEntries);
  assert.equal(failed.skipped, 0);
});
