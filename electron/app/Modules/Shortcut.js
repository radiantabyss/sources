import { globalShortcut } from 'electron';
import PanelWindow from './../Windows/PanelWindow.js';

let self = {
    register(type, shortcut) {
        let action;
        if ( type == 'transparency' ) {
            action = () => {
                PanelWindow.toggleClickThroughAll();
            };
        }

        globalShortcut.register(parse_shortcut_details(shortcut.details), action);
    },

    unregister(shortcut) {
        globalShortcut.unregister(parse_shortcut_details(shortcut.details));
    },

    registerAll() {
        let shortcuts = Config.getKey('settings', 'shortcuts');
        for ( let type in shortcuts ) {
            self.register(type, shortcuts[type]);
        }
    },

    unregisterAll() {
        let shortcuts = Config.getKey('settings', 'shortcuts');
        for ( let type in shortcuts ) {
            self.unregister(shortcuts[type]);
        }
    },
}

export default self;
