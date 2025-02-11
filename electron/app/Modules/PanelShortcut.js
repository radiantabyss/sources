import { globalShortcut } from 'electron';

let self = {
    register(win, panel) {
        let shortcuts = self.get(panel);
        for ( let shortcut of shortcuts ) {
            globalShortcut.register(shortcut.code, () => {
                ipc_end('swatch:trigger-shortcut', shortcut.id, win);
            });
        }
    },

    unregister(panel) {
        let shortcuts = self.get(panel);
        for ( let shortcut of shortcuts ) {
            globalShortcut.unregister(shortcut.code);
        }
    },

    //private
    get(panel) {
        //check if panel has swatches
        if ( !panel.swatches.length ) {
            return [];
        }

        let shortcuts = [];
        for ( let swatch of panel.swatches ) {
            if ( !swatch.shortcut_text ) {
                continue;
            }

            shortcuts.push({
                id: swatch.id,
                code: parse_shortcut_details(swatch.shortcut_details),
            });
        }

        return shortcuts;
    },
}

export default self;
