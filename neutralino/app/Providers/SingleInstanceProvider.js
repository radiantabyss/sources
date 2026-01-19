export default async () => {
    if ( !IS_PACKAGED ) {
        return;
    }

    let command = `powershell -Command "Get-CimInstance Win32_Process -Filter \\"name='${NL_APPID}.exe'\\" | Select-Object name"`;
    let result = await Neutralino.os.execCommand(command);
    let regex = new RegExp(`${NL_APPID}\.exe`, 'g');
    let matches = result.stdOut.match(regex);

    if ( matches && matches.length > 1 ) {
        let command = `powershell -NoProfile -ExecutionPolicy Bypass -File "${APP_PATH}/bin/single-instance.ps1" "${NL_APPID}.exe"`;
        await Neutralino.os.execCommand(command);
        await Neutralino.app.exit();
    }
}
