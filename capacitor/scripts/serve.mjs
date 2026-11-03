// `npm run serve`: the mobile counterpart of front's `npm run serve`. Run it next to front's
// serve, which rebuilds front on save and copies it into www/. This:
//   1. rebuilds capacitor-app.js into www/ whenever app/ changes
//   2. swaps front's <script> for the app's again after front overwrites www/index.html
//   3. once www/ settles, runs `cap run android` (sync, gradle build, install, launch)
//
// The app is reinstalled on every change, so expect a gradle build each time, not a hot
// reload. Java changes (plugins, the manifest) are not watched: run it again or
// build from Android Studio. Needs android/, created once with `npm run add:android`.
//
// The target is picked once, at startup: the first phone `cap run --list` reports, else the
// first emulator, unless one is passed:
//   npm run serve -- --target Medium_Phone_API_35

import { execSync, spawn } from 'node:child_process';
import { existsSync, watch } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { injectApp } from './inject.mjs';
import { studioJavaHome } from './java.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const www = resolve(root, 'www');

// front writes its files and copies them a moment later, so wait for the dust to settle.
const SETTLE_MS = 1000;

function pickTarget() {
    let index = process.argv.indexOf('--target');
    if ( index !== -1 && process.argv[index + 1] ) {
        return process.argv[index + 1];
    }

    let output = execSync('npx cap run android --list --json', { cwd: root, encoding: 'utf8' });
    let targets = JSON.parse(output.slice(output.indexOf('[')));

    if ( !targets.length ) {
        throw new Error('No Android device or emulator found. Create one in Android Studio.');
    }

    // A running emulator is listed as emulator-NNNN and an AVD as "Name (emulator)"; anything
    // else is a real phone, over USB or Wi-Fi.
    let phone = targets.find((target) => !isEmulator(target));

    if ( phone ) {
        return phone.id;
    }

    console.log('[serve] no phone connected over adb, falling back to an emulator');
    return targets[0].id;
}

function isEmulator(target) {
    return target.id.startsWith('emulator-') || target.name.endsWith('(emulator)');
}

// Gradle runs inside `cap run`, so hand it the Java 21 Capacitor 7 compiles with.
const env = { ...process.env };

if ( studioJavaHome() ) {
    env.JAVA_HOME = studioJavaHome();
}

function runCap(target) {
    return new Promise((resolve_run) => {
        let child = spawn('npx', ['cap', 'run', 'android', '--target', target], {
            cwd: root,
            stdio: 'inherit',
            shell: true,
            env,
        });

        child.on('exit', (code) => resolve_run(code === 0));
    });
}

const target = pickTarget();
console.log(`[serve] watching www/, target ${target}`);

let timer = null;
let running = false;
let pending = false;
let injected_until = 0;

async function deploy() {
    if ( running ) {
        pending = true;
        return;
    }

    if ( !existsSync(resolve(www, 'index.html')) ) {
        console.log('[serve] waiting for front to copy its build into www/');
        return;
    }

    running = true;

    try {
        if ( injectApp(www) ) {
            injected_until = Date.now() + 500;
            console.log('[serve] injected capacitor-app.js');
        }

        let started = Date.now();
        let ok = await runCap(target);
        console.log(`[serve] ${ok ? 'deployed' : 'cap run failed'} in ${Math.round((Date.now() - started) / 1000)}s`);
    }
    catch ( e ) {
        console.error('[serve]', e.message);
    }

    running = false;

    if ( pending ) {
        pending = false;
        schedule();
    }
}

function schedule() {
    clearTimeout(timer);
    timer = setTimeout(deploy, SETTLE_MS);
}

// capacitor-app.js: vite's own watcher rebuilds it into www/ on every app/ save.
await build({
    configFile: resolve(root, 'vite.config.js'),
    clearScreen: false,
    logLevel: 'warn',
    build: {
        watch: {},
    },
});

// Our own write. Checking the file's content isn't enough: the write empties it first,
// and the watcher can see it in between.
function isInjection(filename) {
    return filename === 'index.html' && Date.now() < injected_until;
}

// Anything else landing in www/ (front's copy or the app) means a new deploy. Writes
// made while a deploy runs only queue one more.
watch(www, { recursive: true }, (_event, filename) => {
    if ( isInjection(filename) ) {
        return;
    }

    if ( running ) {
        pending = true;
        return;
    }

    schedule();
});

schedule();
