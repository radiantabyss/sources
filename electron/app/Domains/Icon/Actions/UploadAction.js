import { dialog, BrowserWindow } from 'electron';
import fs from 'fs-extra';
import path from 'path';

let self = {
    async run(event) {
        let win = BrowserWindow.fromWebContents(event.sender);

        let response = await dialog.showOpenDialog(win, {
            properties: ['openFile'],
            filters: [
                { name: 'Images', extensions: ['jpg', 'png'] },
            ],
        });

        if ( response.canceled ) {
            return Response.success('');
        }

        let source = response.filePaths[0];
        let parsed = path.parse(source);
        let filename = `/${parsed.name}-${Math.ceil(Math.random() * 10000)}${parsed.ext}`;
        await fs.copy(source, `${STATIC_PATH}/uploads${filename}`);

        if ( !IS_PACKAGED ) {
            await fs.copy(source, `${STATIC_PATH}/../public/uploads${filename}`);
        }

        return Response.success(`/uploads${filename}`);
    },
}

export default self;
