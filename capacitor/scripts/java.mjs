// Capacitor 7 compiles with Java 21. Android Studio bundles one (its jbr), the same one its own
// builds use, so prefer it over a JAVA_HOME that may point at an older JDK. Used by
// serve.mjs; returns null when Android Studio isn't where we expect it.

import { existsSync } from 'node:fs';

export function studioJavaHome() {
    const studio_jbr = {
        win32: 'C:\\Program Files\\Android\\Android Studio\\jbr',
        darwin: '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
    }[process.platform];

    return studio_jbr && existsSync(studio_jbr) ? studio_jbr : null;
}
