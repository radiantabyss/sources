import { dialog } from 'electron';
import path from 'path';
import createDesktopShortcut from 'create-desktop-shortcuts';
import Img2Ico from './../../../Services/Img2Ico.js';

let self = {
    async run(id) {
        let item = await Model.Panel.find(id);
        let icon = await Img2Ico.run(`${STATIC_PATH}${item.icon}`);

        if ( !IS_PACKAGED ) {
            return;
        }

        createDesktopShortcut({
            windows: {
                VBScriptPath: `${APP_PATH}/windows.vbs`,
                filePath: path.resolve(`${APP_PATH}/../CMDeck.exe`),
                name: item.name,
                icon,
                arguments: `--panel_id=${id}`,
            }
        });
    },
}

export default self;
