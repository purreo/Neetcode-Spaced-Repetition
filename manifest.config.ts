import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'Neetcode Spaced Repetition',
  version: '1.0.0',
  description: 'Automates spaced repetition for neetcode.io',
  action: {
    default_popup: 'index.html',
  },
  permissions: ['storage'],
  host_permissions: ['*://*.neetcode.io/*'],
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['*://*.neetcode.io/*'],
      js: ['src/content/neetcode-detector.ts'],
    }
  ],
});
