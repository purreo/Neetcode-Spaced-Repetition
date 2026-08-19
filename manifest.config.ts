import { defineManifest } from '@crxjs/vite-plugin';
import { loadEnv } from 'vite';

const currentDirectory = (globalThis as any).process?.cwd?.() || '';
const env = loadEnv('', currentDirectory, '');

export default defineManifest({
  manifest_version: 3,
  name: 'Neetcode Spaced Repetition',
  version: '1.0.0',
  key: env.CRX_MANIFEST_KEY,
  description: 'Automates spaced repetition for neetcode.io',
  icons: {
    '16': 'icon_16.png',
    '48': 'icon_48.png',
    '128': 'icon_128.png',
  },
  action: {
    default_popup: 'index.html',
    default_icon: {
      '16': 'icon_16.png',
      '48': 'icon_48.png',
      '128': 'icon_128.png',
    }
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
