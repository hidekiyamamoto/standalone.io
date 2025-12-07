'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const compression = require('compression');

var publicserve = serveStatic(path.join(__dirname,'www-public'), { fallthrough: true, index: ['index.html'] });
// Domains this service will answer for. Update these to your real hostnames.
const DOMAINS = ['standalone.io'];

// Optional metadata shown in https-expresses summaries.
const MODULE_META = {
  description: 'STANDALONE.IO',
};

module.exports = {
  domains: DOMAINS,
  meta: MODULE_META,
  async init() {
    const app = express();
    const publicDir = path.join(__dirname, 'www-public');

    // Core middleware
    app.use(compression());
    app.use(express.json({ limit: '5mb' }));
    app.use(express.urlencoded({ extended: false }));

    // Static files: for any GET, first check if a matching
    // file or directory+default file exists under www-public.
    if (fs.existsSync(publicDir) && fs.statSync(publicDir).isDirectory()) {
      app.use(serveStatic(publicDir, { fallthrough: true, index: ['index.html', 'index.htm', 'default.html'] }));
      console.log('[standalone.io] Serving static files from', publicDir);
    }

    // Health endpoint
    app.get('/healthz', (req, res) => {
      res.json({ status: 'ok', service: 'standalone.io.hts.js', at: new Date().toISOString() });
    });

    // Simple home
    app.get('/', (req, res) => {
      res.send('Hello from standalone.io.hts.js');
    });

    return {
      app,
      domains: DOMAINS,
      meta: MODULE_META,
    };
  },
};
