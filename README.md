Note: after downloading this project, make sure to run the following commands to install the dependencies and start the project:

1. `npm install`
2. `npm run dev` for development, or `npm run build` for production.

**Note on the `key` in `manifest.config.ts`:**
There is a public `key` hardcoded in `manifest.config.ts`. This safely locks the Extension ID so that Chrome Sync works perfectly if you use this extension across multiple computers (e.g., Ubuntu and Windows) logged into the same Google Account.
- **Is it safe to share?** Yes! It is only a *public* key. Nobody can access your Neetcode data (which is tied to your Google Account), and nobody can steal your extension's identity on the Chrome Web Store without the private key.
- **For other users:** They can leave the key exactly as-is. Their data will safely sync to *their* own Google Accounts.

The `dist` folder is what should be used for the chrome extension. When loading, make sure to select `dist` in the "Load unpacked" section.