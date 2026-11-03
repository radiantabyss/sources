// Swaps front's module script in www/index.html for capacitor-app.js and hands front's URL
// over as VUE_SCRIPT_URL. The app loads front itself once its routes are registered (see
// app/Providers/AppProvider.js), so front's first IPC call always finds them. Shared by
// build.mjs and serve.mjs.
//
// Returns true when it rewrote the page, false when it was already done.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function injectApp(www) {
    const index_path = resolve(www, 'index.html');
    let html = readFileSync(index_path, 'utf8');

    if ( html.includes('capacitor-app.js') ) {
        return false;
    }

    const front = html.match(/<script\b[^>]*type="module"[^>]*\bsrc="([^"]+)"[^>]*><\/script>/);

    if ( !front ) {
        throw new Error('Could not find front\'s module script tag in index.html.');
    }

    const tags = `<script>window.VUE_SCRIPT_URL = ${JSON.stringify(front[1])};</script>\n` +
        '    <script type="module" src="capacitor-app.js"></script>';

    html = html.replace(front[0], tags);
    writeFileSync(index_path, html);

    return true;
}
