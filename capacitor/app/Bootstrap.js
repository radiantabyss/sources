//load support
import Globals from './Support/Globals.js';
import Helpers from './Support/Helpers.js';

export default async () => {
    //globals
    let globals = await Globals();
    for ( let key in globals ) {
        window[key] = globals[key];
    }

    //helpers
    for (let key in Helpers) {
        window[key] = Helpers[key];
    }
}
