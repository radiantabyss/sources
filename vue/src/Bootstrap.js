//load custom modules
import Clipboard from 'v-clipboard';

//load support
import Globals from './Support/Globals';
import Helpers from './Support/Helpers';
import Modal from './Support/Modal';
import Settings from './Support/Settings';
import Str from './Support/Str';

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

    //modal
    window.Modal = Modal;
    app.config.globalProperties.Modal = Modal;
}
