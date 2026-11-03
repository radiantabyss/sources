// `npm run release`: the signed release build. Plain Node so it runs the same on Windows,
// macOS and Linux (npm uses cmd on Windows and sh elsewhere, so shell syntax can't be shared).
//
// The updater artifacts are signed with this app's private key, kept outside the repo at
// ~/.tauri/{productName}.key (one key per app). A TAURI_SIGNING_PRIVATE_KEY already set in the
// environment wins, e.g. on a CI server. A key password, if any, stays in the environment:
// TAURI_SIGNING_PRIVATE_KEY_PASSWORD.

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { productName, version } = JSON.parse(fs.readFileSync('src-tauri/tauri.release.conf.json', 'utf8'));
const KEY_FILE = path.join(os.homedir(), '.tauri', `${productName}.key`);

const env = { ...process.env };

if ( !env.TAURI_SIGNING_PRIVATE_KEY ) {
    if ( !fs.existsSync(KEY_FILE) ) {
        console.error(`Updater signing key not found at ${KEY_FILE}`);
        console.error('Put the key there, or set TAURI_SIGNING_PRIVATE_KEY to its path or contents.');
        process.exit(1);
    }

    env.TAURI_SIGNING_PRIVATE_KEY = KEY_FILE;
}

execSync('tauri build --config src-tauri/tauri.release.conf.json', { stdio: 'inherit', env });

// the portable build: the bare exe, zipped, published next to the installer as
// {productName}_{version}_x64-portable.zip (so a download page can offer both).
// windows' bundled bsdtar writes zips with -a; it's the only os published for now.
if ( process.platform === 'win32' ) {
    const dir = 'target/release/bundle/portable';
    const zip = path.join(dir, `${productName}_${version}_x64-portable.zip`);

    fs.mkdirSync(dir, { recursive: true });
    fs.rmSync(zip, { force: true });
    const tar = path.join(process.env.SystemRoot, 'System32', 'tar.exe'); // not a gnu tar from git bash
    execSync(`"${tar}" -a -c -f "${zip}" -C target/release ${productName}.exe`, { stdio: 'inherit' });
    console.log(`Portable build: ${zip}`);
}

// the thin AppImage: tauri's AppImage bundles WebKitGTK + GTK (~80 MB, most of every update
// download). keep only the app itself (binary, resources, icon, .desktop) so it uses the
// system's libraries like the .deb does (~3 MB), with src-tauri/appimage/AppRun as the
// launcher that explains what to install when they're missing. it replaces tauri's file
// under the same name and is re-signed, since tauri's .sig was for the full one.
// needs appimagetool on PATH, or its path in APPIMAGETOOL.
if ( process.platform === 'linux' ) {
    const image = path.resolve(`target/release/bundle/appimage/${productName}_${version}_amd64.AppImage`);
    const appimagetool = process.env.APPIMAGETOOL || 'appimagetool';

    try {
        execSync(`command -v "${appimagetool}"`, { stdio: 'ignore' });
    }
    catch (e) {
        console.error(`${appimagetool} not found. Install it, or set APPIMAGETOOL to its path.`);
        process.exit(1);
    }

    const work = fs.mkdtempSync(path.join(os.tmpdir(), `${productName}-appimage-`));
    const full = path.join(work, 'squashfs-root');
    const thin = path.join(work, 'AppDir');

    execSync(`"${image}" --appimage-extract`, { cwd: work, stdio: 'ignore' });

    // the .desktop names the binary (Exec=) and the icon (Icon=)
    const desktop = fs.readdirSync(full).find(file => file.endsWith('.desktop'));
    const entry = fs.readFileSync(path.join(full, desktop), 'utf8');
    const bin = entry.match(/^Exec=(\S+)/m)[1];
    const icon = entry.match(/^Icon=(.+)$/m)[1].trim();

    const keep = [
        desktop,
        '.DirIcon',
        ...fs.readdirSync(full).filter(file => file.startsWith(icon + '.')),
        `usr/bin/${bin}`,
        `usr/lib/${productName}`, // bundle resources, if any; tauri names the folder after
        `usr/lib/${bin}`, // the product or the binary depending on the version
        'usr/share/applications',
        'usr/share/icons',
    ];

    // the AppDir is full of symlinks (the root .desktop and icon point into usr/share), and
    // fs.cpSync's dereference mixes them up with directories, so resolve each one by hand
    // and copy the real file, keeping its mode (the binary must stay executable)
    const copy = (src, dest) => {
        src = fs.realpathSync(src);
        const stat = fs.statSync(src);

        if ( stat.isDirectory() ) {
            fs.mkdirSync(dest, { recursive: true });
            for ( const file of fs.readdirSync(src) ) {
                copy(path.join(src, file), path.join(dest, file));
            }
            return;
        }

        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        fs.chmodSync(dest, stat.mode);
    };

    for ( const file of keep ) {
        if ( fs.existsSync(path.join(full, file)) ) {
            copy(path.join(full, file), path.join(thin, file));
        }
    }

    const apprun = fs.readFileSync('src-tauri/appimage/AppRun', 'utf8')
        .replace(/\r\n/g, '\n')
        .replace(/__NAME__/g, productName)
        .replace(/__BIN__/g, bin);
    fs.writeFileSync(path.join(thin, 'AppRun'), apprun, { mode: 0o755 });

    execSync(`"${appimagetool}" "${thin}" "${image}"`, { stdio: 'inherit', env: { ...env, ARCH: 'x86_64' } });
    fs.rmSync(work, { recursive: true, force: true });

    // re-sign with the same key tauri build used (a path or the key itself)
    const key = env.TAURI_SIGNING_PRIVATE_KEY;
    const sign_env = { ...env };
    if ( fs.existsSync(key) ) {
        delete sign_env.TAURI_SIGNING_PRIVATE_KEY;
        sign_env.TAURI_SIGNING_PRIVATE_KEY_PATH = key;
    }
    execSync(`tauri signer sign --app-version ${version} "${image}"`, { stdio: 'inherit', env: sign_env });

    console.log(`Thin AppImage: ${image} (${(fs.statSync(image).size / 1024 / 1024).toFixed(1)} MB)`);
}
