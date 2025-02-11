//load support
import Config from './Support/Config.js';
import Globals from './Support/Globals.js';
import Helpers from './Support/Helpers.js';

export default async () => {
    //globals
    let globals = await Globals();
    for ( let key in globals ) {
        global[key] = globals[key];
    }

    //helpers
    for ( let key in Helpers ) {
        global[key] = Helpers[key];
    }

    global.Config = Config;
}
