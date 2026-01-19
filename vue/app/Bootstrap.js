//load custom modules
import Clipboard from 'v-clipboard';

//load support
import Globals from './Support/Globals.js';
import Helpers from './Support/Helpers.js';
import Settings from './Support/Settings.js';
import Str from './Support/Str.js';

export default async (app) => {
    //custom modules
    app.use(Clipboard);

    //str helpers
    let _Str = {...window.Str, ...Str};
    window.Str = _Str;
    app.config.globalProperties.Str = _Str;

    //globals
    let globals = await Globals();
    for ( let key in globals ) {
        window[key] = globals[key];
        app.config.globalProperties[key] = globals[key];
    }

    //helpers
    for ( let key in Helpers ) {
        window[key] = Helpers[key];
        app.config.globalProperties[key] = Helpers[key];
    }

    //settings
    window.Settings = Settings;
    app.config.globalProperties.Settings = Settings;
}
