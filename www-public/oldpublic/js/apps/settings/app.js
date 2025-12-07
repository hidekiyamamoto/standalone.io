(function () {
  function getKernel() {
    try {
      if (window.parent && window.parent !== window && window.parent.STANDALONE_OS) {
        return window.parent.STANDALONE_OS;
      }
    } catch (_err) {
      // Cross-origin access can throw; ignore and fall back.
    }
    return (window.STANDALONE_OS = window.STANDALONE_OS || {});
  }

  const OS = getKernel();

  function getStore() {
    const ctx = OS.context && OS.context.storage;
    if (!ctx || !ctx.createStore) {
      return {
        get() {
          return null;
        },
        set() {},
      };
    }
    // UI settings only; theme uses its own store.
    return ctx.createStore('settings-ui', 'local');
  }

  const defaults = {
    appearance: {
      density: 'comfortable',
    },
    layout: {
      useWinbox: true,
    },
  };

  function mergeConfig(saved) {
    const cfg = saved && typeof saved === 'object' ? saved : {};
    cfg.appearance = Object.assign({}, defaults.appearance, cfg.appearance || {});
    cfg.layout = Object.assign({}, defaults.layout, cfg.layout || {});
    return cfg;
  }

  function applyToKernel(cfg) {
    OS.config = OS.config || {};
    OS.config.uiSettings = cfg;
    OS.config.settingsUI = cfg;
    OS.config.desktopUseWinbox = cfg.layout.useWinbox !== false;
  }

  function saveConfig(store, cfg) {
    store.set(cfg);
    applyToKernel(cfg);
  }

  function initTabs(root) {
    const tabs = Array.from(root.querySelectorAll('[data-settings-tab]'));
    const panels = Array.from(root.querySelectorAll('[data-settings-panel]'));
    if (!tabs.length || !panels.length) return;

    function activate(name) {
      console.log('[settings-ui] activate tab', name);
      tabs.forEach((tab) => {
        tab.classList.toggle('is-active', tab.dataset.settingsTab === name);
      });
      panels.forEach((panel) => {
        const active = panel.dataset.settingsPanel === name;
        panel.classList.toggle('is-active', active);
        panel.style.display = active ? 'block' : 'none';
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const name = tab.dataset.settingsTab || 'ui';
        console.log('[settings-ui] tab click', name);
        activate(name);
      });
    });

    activate('ui');
  }

  function initUiControls(root) {
    const store = getStore();
    const cfg = mergeConfig(store.get());
    applyToKernel(cfg);

    const checkbox = root.querySelector('#settings-use-winbox');
    const select = root.querySelector('#settings-density');
    if (checkbox) {
      checkbox.checked = cfg.layout.useWinbox !== false;
      checkbox.addEventListener('change', () => {
        cfg.layout.useWinbox = checkbox.checked;
        saveConfig(store, cfg);
      });
    }

    if (select) {
      select.value = cfg.appearance.density || defaults.appearance.density;
      select.addEventListener('change', () => {
        cfg.appearance.density = select.value;
        saveConfig(store, cfg);
      });
    }

    console.log('[settings-ui] loaded config', cfg);
  }

  function initApp(root) {
    if (!root) return;
    initTabs(root);
    initUiControls(root);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initApp(document.querySelector('.settings-app') || document.body);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      initApp(document.querySelector('.settings-app') || document.body);
    });
  }
})();
