// Root namespace for the standalone.io Web OS.
window.STANDALONE_OS = window.STANDALONE_OS || {};

const OS = window.STANDALONE_OS;

OS.config = OS.config || {
  nativeAppsBasePath: '/native-apps',
};

OS.nativeApps = OS.nativeApps || {
  registry: {},

  // Register a static native app by id and manifest path.
  registerApp(id, manifestPath) {
    this.registry[id] = { id, manifestPath, manifest: null };
  },

  async loadManifest(id) {
    const entry = this.registry[id];
    if (!entry) throw new Error(`Unknown native app: ${id}`);
    if (entry.manifest) return entry.manifest;
    const res = await fetch(entry.manifestPath, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load manifest for ${id}`);
    const manifest = await res.json();
    entry.manifest = manifest;
    return manifest;
  },

  // Load and mount an app's entry fragment into an isolated frame
  // inside a given container. Destroying the frame frees the app's
  // JS/DOM context and encourages the browser to reclaim memory.
  async mountApp(id, container) {
    const manifest = await this.loadManifest(id);
    if (!manifest.entryFragment) {
      throw new Error(`Manifest for ${id} missing entryFragment`);
    }

    const res = await fetch(manifest.entryFragment, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load fragment for ${id}`);
    const fragmentHtml = await res.text();

    const title = manifest && manifest.name ? manifest.name : id;
    const pageHtml =
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' +
      title.replace(/</g, '&lt;') +
      '</title></head><body>' +
      fragmentHtml +
      '</body></html>';

    const blob = new Blob([pageHtml], { type: 'text/html' });
    const frameUrl = URL.createObjectURL(blob);

    let frame = null;
    if (container) {
      const previousFrame = container.querySelector('iframe.os-native-app-frame');
      if (previousFrame && previousFrame._osFrameUrl) {
        try {
          URL.revokeObjectURL(previousFrame._osFrameUrl);
        } catch (_err) {}
      }

      container.innerHTML = '';
      frame = document.createElement('iframe');
      frame.className = 'os-native-app-frame';
      frame.src = frameUrl;
      frame.setAttribute('data-app-id', id);
      frame._osFrameUrl = frameUrl;
      container.appendChild(frame);
    }

    const event = new CustomEvent('os:nativeAppMounted', {
      detail: {
        id,
        manifest,
        container,
        frame,
        frameUrl,
      },
    });
    window.dispatchEvent(event);
  },
};

// Register built-in static native apps here.
OS.nativeApps.registerApp('example-app', '/native-apps/example-app/app.json');
OS.nativeApps.registerApp('storage', '/native-apps/storage/app.json');
OS.nativeApps.registerApp('settings', '/native-apps/settings/app.json');
