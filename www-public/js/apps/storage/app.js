(function () {
  function getKernel() {
    try {
      if (window.parent && window.parent !== window && window.parent.STANDALONE_OS) {
        return window.parent.STANDALONE_OS;
      }
    } catch (_err) {
      // Cross-origin access can throw; ignore and fall back.
    }
    return window.STANDALONE_OS || (window.STANDALONE_OS = {});
  }

  const OS = getKernel();

  function byId(root, id) {
    return root.querySelector('#' + id);
  }

  function clear(el) {
    if (el) el.innerHTML = '';
  }

  function makeAction(label, onClick) {
    const btn = document.createElement('button');
    btn.className = 'storage-action-button';
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function renderCookies(root) {
    const body = byId(root, 'storage-main-body');
    const title = byId(root, 'storage-main-title');
    const subtitle = byId(root, 'storage-main-subtitle');
    const actions = byId(root, 'storage-main-actions');
    if (!body || !title || !subtitle || !actions) return;

    title.textContent = 'Cookies';
    subtitle.textContent = 'document.cookie for this origin.';
    clear(actions);

    actions.appendChild(
      makeAction('Clear all cookies', () => {
        const parts = document.cookie.split(';');
        parts.forEach((c) => {
          const eq = c.indexOf('=');
          const name = eq > -1 ? c.slice(0, eq) : c;
          document.cookie = name.trim() + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        });
        renderCookies(root);
      }),
    );

    const raw = document.cookie || '';
    clear(body);
    if (!raw) {
      const empty = document.createElement('div');
      empty.className = 'storage-empty';
      empty.textContent = 'No cookies stored for this origin.';
      body.appendChild(empty);
      return;
    }

    const table = document.createElement('table');
    table.className = 'storage-table';
    table.innerHTML = '<thead><tr><th>Name</th><th>Value</th></tr></thead>';
    const tbody = document.createElement('tbody');
    raw.split(';').forEach((pair) => {
      const [name, ...rest] = pair.split('=');
      const value = rest.join('=');
      const tr = document.createElement('tr');
      const tdName = document.createElement('td');
      tdName.className = 'storage-key';
      tdName.textContent = name.trim();
      const tdVal = document.createElement('td');
      tdVal.textContent = value;
      tr.appendChild(tdName);
      tr.appendChild(tdVal);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    body.appendChild(table);
  }

  function snapshotKV(kind) {
    let store;
    if (kind === 'local') store = window.localStorage;
    else if (kind === 'session') store = window.sessionStorage;
    if (!store) return [];
    const rows = [];
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      rows.push({ key, value: store.getItem(key) });
    }
    return rows;
  }

  function renderKV(root, kind) {
    const body = byId(root, 'storage-main-body');
    const title = byId(root, 'storage-main-title');
    const subtitle = byId(root, 'storage-main-subtitle');
    const actions = byId(root, 'storage-main-actions');
    if (!body || !title || !subtitle || !actions) return;

    const human = kind === 'local' ? 'Local storage' : 'Session storage';
    title.textContent = human;
    subtitle.textContent = 'Key/value entries for this origin.';
    clear(actions);

    actions.appendChild(
      makeAction('Clear all', () => {
        const store = kind === 'local' ? window.localStorage : window.sessionStorage;
        if (store) {
          store.clear();
          renderKV(root, kind);
        }
      }),
    );
    actions.appendChild(
      makeAction('Add entry', () => {
        const key = prompt('Key');
        if (!key) return;
        const value = prompt('Value for "' + key + '"') || '';
        const store = kind === 'local' ? window.localStorage : window.sessionStorage;
        if (store) {
          store.setItem(key, value);
          renderKV(root, kind);
        }
      }),
    );

    const rows = snapshotKV(kind);
    clear(body);
    if (!rows.length) {
      const empty = document.createElement('div');
      empty.className = 'storage-empty';
      empty.textContent = 'No entries stored.';
      body.appendChild(empty);
      return;
    }

    const table = document.createElement('table');
    table.className = 'storage-table';
    table.innerHTML =
      '<thead><tr><th style="width:30%;">Key</th><th>Value</th><th style="width:80px;"></th></tr></thead>';
    const tbody = document.createElement('tbody');

    rows.forEach((row) => {
      const tr = document.createElement('tr');
      const tdKey = document.createElement('td');
      tdKey.className = 'storage-key';
      tdKey.textContent = row.key;
      const tdVal = document.createElement('td');
      tdVal.textContent = row.value;
      const tdActions = document.createElement('td');

      const edit = makeAction('Edit', () => {
        const current = row.value;
        const next = prompt('New value for "' + row.key + '"', current);
        if (next === null) return;
        const store = kind === 'local' ? window.localStorage : window.sessionStorage;
        if (store) {
          store.setItem(row.key, next);
          renderKV(root, kind);
        }
      });
      const del = makeAction('Delete', () => {
        const store = kind === 'local' ? window.localStorage : window.sessionStorage;
        if (store) {
          store.removeItem(row.key);
          renderKV(root, kind);
        }
      });
      tdActions.appendChild(edit);
      tdActions.appendChild(del);

      tr.appendChild(tdKey);
      tr.appendChild(tdVal);
      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    body.appendChild(table);
  }

  async function renderIndexedDB(root) {
    const body = byId(root, 'storage-main-body');
    const title = byId(root, 'storage-main-title');
    const subtitle = byId(root, 'storage-main-subtitle');
    const actions = byId(root, 'storage-main-actions');
    if (!body || !title || !subtitle || !actions) return;

    title.textContent = 'IndexedDB';
    subtitle.textContent = 'Databases available to this origin.';
    clear(actions);
    clear(body);

    if (!('indexedDB' in window)) {
      const empty = document.createElement('div');
      empty.className = 'storage-empty';
      empty.textContent = 'IndexedDB not supported in this environment.';
      body.appendChild(empty);
      return;
    }

    try {
      const listFn = indexedDB.databases;
      if (typeof listFn !== 'function') {
        const hint = document.createElement('div');
        hint.className = 'storage-empty';
        hint.textContent = 'Listing databases is not supported in this browser.';
        body.appendChild(hint);
        return;
      }
      const dbs = await listFn.call(indexedDB);
      if (!dbs || !dbs.length) {
        const empty = document.createElement('div');
        empty.className = 'storage-empty';
        empty.textContent = 'No IndexedDB databases detected.';
        body.appendChild(empty);
        return;
      }
      const table = document.createElement('table');
      table.className = 'storage-table';
      table.innerHTML = '<thead><tr><th>Name</th><th>Version</th></tr></thead>';
      const tbody = document.createElement('tbody');
      dbs.forEach((db) => {
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        tdName.textContent = db.name || '(unnamed)';
        const tdVersion = document.createElement('td');
        tdVersion.textContent = String(db.version || '');
        tr.appendChild(tdName);
        tr.appendChild(tdVersion);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      body.appendChild(table);
    } catch (err) {
      const error = document.createElement('div');
      error.className = 'storage-empty';
      error.textContent = 'Failed to enumerate IndexedDB databases.';
      body.appendChild(error);
      console.error(err);
    }
  }

  async function renderCache(root) {
    const body = byId(root, 'storage-main-body');
    const title = byId(root, 'storage-main-title');
    const subtitle = byId(root, 'storage-main-subtitle');
    const actions = byId(root, 'storage-main-actions');
    if (!body || !title || !subtitle || !actions) return;

    title.textContent = 'Cache storage';
    subtitle.textContent = 'Cache namespaces provided by CacheStorage.';
    clear(actions);
    clear(body);

    if (!('caches' in window)) {
      const empty = document.createElement('div');
      empty.className = 'storage-empty';
      empty.textContent = 'CacheStorage not supported in this environment.';
      body.appendChild(empty);
      return;
    }

    try {
      const keys = await caches.keys();
      if (!keys.length) {
        const empty = document.createElement('div');
        empty.className = 'storage-empty';
        empty.textContent = 'No caches created yet.';
        body.appendChild(empty);
        return;
      }
      const table = document.createElement('table');
      table.className = 'storage-table';
      table.innerHTML = '<thead><tr><th>Name</th></tr></thead>';
      const tbody = document.createElement('tbody');
      keys.forEach((name) => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = name;
        tr.appendChild(td);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      body.appendChild(table);
    } catch (err) {
      const error = document.createElement('div');
      error.className = 'storage-empty';
      error.textContent = 'Failed to list caches.';
      body.appendChild(error);
      console.error(err);
    }
  }

  function renderVfsRoot(root) {
    const body = byId(root, 'storage-main-body');
    const title = byId(root, 'storage-main-title');
    const subtitle = byId(root, 'storage-main-subtitle');
    const actions = byId(root, 'storage-main-actions');
    if (!body || !title || !subtitle || !actions) return;

    title.textContent = 'Virtual storage';
    subtitle.textContent = 'Root of the virtual storage filesystem (storage/).';
    clear(actions);
    clear(body);

    const info = document.createElement('div');
    info.className = 'storage-empty';
    info.innerHTML =
      'This will map logical paths like <span class="storage-vfs-path">storage/app/preferences.json</span> to underlying native storage layers (localStorage, IndexedDB, etc.).';
    body.appendChild(info);
  }

  function initStorageUI(root) {
    if (!root) return;
    const treeItems = Array.from(root.querySelectorAll('.storage-tree-item'));

    function setActive(id) {
      treeItems.forEach((el) => el.classList.toggle('is-active', el.dataset.storageNode === id));
      if (id === 'cookies') renderCookies(root);
      else if (id === 'local') renderKV(root, 'local');
      else if (id === 'session') renderKV(root, 'session');
      else if (id === 'indexeddb') renderIndexedDB(root);
      else if (id === 'cache') renderCache(root);
      else if (id === 'vfs-root') renderVfsRoot(root);
    }

    treeItems.forEach((el) => {
      el.addEventListener('click', () => setActive(el.dataset.storageNode));
    });

    setActive('local');
  }

  function initApp() {
    const root = document.querySelector('.storage-app') || document.body;
    initStorageUI(root);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initApp();
  } else {
    document.addEventListener('DOMContentLoaded', initApp);
  }
})();
