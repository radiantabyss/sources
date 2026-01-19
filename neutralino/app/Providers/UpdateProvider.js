export default async () => {
    if ( !IS_PACKAGED ) {
        return;
    }

    //check for updates only on monday
    if ( new Date().getDay() != 1 ) {
        return;
    }

    let ping = await Neutralino.os.execCommand(`ping -n 1 -w 500 ${NL_AUTOUPDATE_MANIFEST_URL}`);
    if ( ping.stdOut.match(/Ping request could not find host/) ) {
        return;
    }

    let manifest = await Neutralino.updater.checkForUpdates(NL_AUTOUPDATE_MANIFEST_URL);

    if ( NL_APPVERSION < manifest.version ) {
        await Neutralino.updater.install();
        await Neutralino.app.restartProcess();
    }
}
