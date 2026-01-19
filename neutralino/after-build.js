let fs = require('fs-extra');
let child_process = require('child_process');

function run() {
    let neutralino_config = JSON.parse(fs.readFileSync('neutralino.config.json', 'utf-8'));
    let DIST_PATH = `dist/${neutralino_config.applicationName}`;
    fs.ensureDirSync(`${DIST_PATH}/bin`);
    fs.copySync(`configs-build`, `${DIST_PATH}/configs`);
    fs.copySync(`bin/extract-zip.ps1`, `${DIST_PATH}/bin/extract-zip.ps1`);
    fs.copySync(`bin/single-instance.ps1`, `${DIST_PATH}/bin/single-instance.ps1`);

    child_process.execSync(`zip -r ${neutralino_config.applicationName}.zip ${neutralino_config.applicationName}`, {
        cwd: 'dist'
    });
}

run();
