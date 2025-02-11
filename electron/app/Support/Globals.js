import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { app } from 'electron';

export default async function() {
    //load env
    let __dirname = path.dirname(fileURLToPath(import.meta.url));
    let ENV = {
        ...dotenv.parse(await fs.readFile(`${__dirname}/../../.env`, 'utf-8')),
        ...dotenv.parse(await fs.readFile(`${__dirname}/../../.ra`, 'utf-8')),
    };
    for ( let key in ENV ) {
        if ( ENV[key] === 'true' ) {
            ENV[key] = true;
        }
        else if ( ENV[key] === 'false' ) {
            ENV[key] = false;
        }
    }

    let APP_PATH = app.getAppPath().replace(/\\/g, '/');
    if ( app.isPackaged ) {
        APP_PATH = APP_PATH.replace('/app.asar', '');
    }

    let IS_PACKAGED = app.isPackaged;
    let STATIC_PATH = IS_PACKAGED ? `${APP_PATH}/static` : `${APP_PATH}/${ENV.FRONT_PATH}/static`;

    return {
        ENV,
        APP_PATH,
        STATIC_PATH,
        IS_PACKAGED,
        MAIN_WINDOW: null,
        UPDATE_WINDOW: null,
        TRAY: null,
        SEQUELIZE: null,

        JWT_TOKEN: null,
        AUTOSYNC: null,

        PANEL_WINDOWS: {},
        PANEL_TRAYS: {},
        SWATCH_ARRANGING: {},
        CLICK_THROUGH_PANEL_WINDOWS: false,
    }
}
