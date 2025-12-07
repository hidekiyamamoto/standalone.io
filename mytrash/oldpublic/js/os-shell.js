// Shell-level wiring for the standalone.io Web OS UI.
(function () {
  const OS = window.STANDALONE_OS || {};

  // During active development, disable any previously registered service workers
  // so the shell always sees fresh HTML/CSS/JS without manual cache clears.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((reg) => reg.unregister()))
        .catch(() => {});
    });
  }

  const clockEl = document.getElementById('os-clock');
  const connectionEl = document.getElementById('os-connection-label');
  const mainWindowBody = document.querySelector('.os-window-body');

  function shouldUseWinbox() {
    // Use windowed layout on tablet + desktop unless disabled in settings.
    const cfg = OS.config && Object.prototype.hasOwnProperty.call(OS.config, 'desktopUseWinbox')
      ? OS.config.desktopUseWinbox
      : true;
    if (!cfg) return false;
    return window.matchMedia('(min-width: 768px)').matches && !!window.WinBox;
  }

  function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    if (clockEl) {
      clockEl.textContent = h + ':' + m;
    }
  }

  function updateConnection() {
    const online = navigator.onLine;
    if (connectionEl) {
      connectionEl.textContent = online ? 'online' : 'offline';
    }
  }

  // Try to encourage full-screen / minimal browser UI.
  // Browsers still require user gesture; this just hooks into first tap.
  function requestFullscreenOnce() {
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (req) {
      req.call(el).catch(() => {});
    }
    window.removeEventListener('click', requestFullscreenOnce);
    window.removeEventListener('touchstart', requestFullscreenOnce);
  }

  async function openWinboxApp(appId) {
    const manager = OS.nativeApps;
    if (!manager || !window.WinBox) {
      // Fallback to inline window body.
      if (manager && mainWindowBody) {
        manager.mountApp(appId, mainWindowBody).catch(() => {});
      }
      return;
    }

    try {
      const manifest = await manager.loadManifest(appId);

      // Respect desktop layout margins so maximized windows
      // don't cover the workspace selector or outer padding.
      const rootStyle = getComputedStyle(document.documentElement);
      const shellPadding = parseFloat(rootStyle.getPropertyValue('--os-shell-padding')) || 0;
      const desktopGap = parseFloat(rootStyle.getPropertyValue('--os-desktop-gap')) || 0;
      const sidebarWidth = parseFloat(rootStyle.getPropertyValue('--os-desktop-sidebar-width')) || 0;
      const launcherWidth = parseFloat(rootStyle.getPropertyValue('--os-desktop-launcher-width')) || 0;

      const bounds = {
        top: shellPadding,
        bottom: shellPadding,
        left: shellPadding + sidebarWidth + desktopGap,
        right: shellPadding + launcherWidth + desktopGap,
      };

      const box = new window.WinBox({
        title: manifest && manifest.name ? manifest.name : appId,
        background: '#111322',
        class: ['os-winbox'],
        x: 'center',
        y: 'center',
        width: '70%',
        height: '70%',
        // Keep within viewport and allow touch interactions.
        max: true,
        top: bounds.top,
        bottom: bounds.bottom,
        left: bounds.left,
        right: bounds.right,
      });

      const content = document.createElement('div');
      content.className = 'os-winbox-content';
      box.body.appendChild(content);

      await manager.mountApp(appId, content);
    } catch (err) {
      console.error('Failed to open app window', appId, err);
    }
  }

  function bindAppLaunchers() {
    const appTiles = document.querySelectorAll('[data-app-id]');
    appTiles.forEach((el) => {
      const appId = el.dataset.appId;
      if (!appId) return;
      el.addEventListener('click', () => {
        if (OS.nativeApps && mainWindowBody) {
          if (shouldUseWinbox()) {
            openWinboxApp(appId);
          } else {
            OS.nativeApps.mountApp(appId, mainWindowBody).catch((err) => {
              console.error('Failed to mount app', appId, err);
            });
          }
        }
      });
    });
  }

  function init() {
    updateClock();
    setInterval(updateClock, 30_000);

    updateConnection();
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);

    // Only try to request fullscreen on smaller devices.
    if (!shouldUseWinbox()) {
      window.addEventListener('click', requestFullscreenOnce, { once: true });
      window.addEventListener('touchstart', requestFullscreenOnce, { once: true });
    }

    // Bind dock + launcher icons.
    bindAppLaunchers();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
