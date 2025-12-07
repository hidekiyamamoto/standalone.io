// Context / storage helper for standalone.io Web OS.
// This wraps the storage model in /context/storage.json and exposes a tiny API
// for memory + session + local persistence that apps can build on.

window.STANDALONE_OS = window.STANDALONE_OS || {};

(function () {
  const OS = window.STANDALONE_OS;
  OS.context = OS.context || {};

  const memoryStores = new Map();

  function getBrowserStore(layerId) {
    if (layerId === 'session') return window.sessionStorage || null;
    if (layerId === 'local') return window.localStorage || null;
    return null;
  }

  function createStore(name, layerId = 'local') {
    const key = `standalone.io:${name}`;

    if (layerId === 'memory') {
      if (!memoryStores.has(key)) memoryStores.set(key, {});
      return {
        layer: 'memory',
        get() {
          return memoryStores.get(key);
        },
        set(value) {
          memoryStores.set(key, value);
        },
        clear() {
          memoryStores.delete(key);
        },
      };
    }

    const store = getBrowserStore(layerId);
    if (!store) {
      // Fallback to memory if the requested layer isn't available.
      return createStore(name, 'memory');
    }

    return {
      layer: layerId,
      get() {
        try {
          const raw = store.getItem(key);
          return raw ? JSON.parse(raw) : null;
        } catch (_) {
          return null;
        }
      },
      set(value) {
        try {
          store.setItem(key, JSON.stringify(value ?? null));
        } catch (err) {
          console.error('Context store set failed', name, layerId, err);
        }
      },
      clear() {
        try {
          store.removeItem(key);
        } catch (err) {
          console.error('Context store clear failed', name, layerId, err);
        }
      },
    };
  }

  OS.context.storage = {
    createStore,
  };
})();

