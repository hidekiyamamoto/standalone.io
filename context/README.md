# standalone.io context / storage model

This folder documents how the Web OS thinks about *memory* inside the browser so that apps, agents and the UI all speak the same language.

The file `storage.json` describes the storage layers that are available on this client (in-memory, session, localStorage, IndexedDB, CacheStorage) and how durable each one is. The goal is that a human or a script can read this file and decide:

- where to persist a given piece of context (ephemeral vs. long-lived)
- how to migrate data between layers
- how to present these layers in the Storage Explorer app.

This description is intentionally static and lives under `www-public/context/` so that it is served as plain JSON/Markdown and can be fetched by apps running in the browser.

