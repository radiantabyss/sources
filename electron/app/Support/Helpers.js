import fs from 'fs-extra';

let self = {
    parse_shortcut_details(details) {
        details.code = details.code.replace('Key', '')
            .replace('Digit', '')
            .replace('Arrow', '')
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s) {
                return s.toUpperCase();
            });

        let map = {
            Backquote: '`',
            Minus: '-',
            Plus: '+',
            BracketLeft: '[',
            BracketRight: ']',
            Semicolon: ';',
            Quote: '\'',
            Backslash: '\\',
            Comma: ',',
            Period: '.',
            Slash: '/',
            NumpadEnter: 'Enter',
        };

        let key = map[details.code] !== undefined ? map[details.code] : details.code;

        let numpads = {
            NumpadDivide: 'numdiv',
            NumpadMultiply: 'nummult',
            NumpadSubstract: 'numsub',
            NumpadAdd: 'numadd',
            NumpadDecimal: 'numdec',
        };

        if ( details.code.match(/Numpad/) ) {
            key = numpads[details.code];
            if ( !key ) {
                key = details.code.replace('Numpad', 'num');
            }
        }

        return `${details.ctrl ? 'CmdOrCtrl+': ''}`+
            `${details.shift ? 'Shift+' : ''}`+
            `${details.alt ? 'Alt+' : ''}`+
            `${key}`;
    },

    get_panel_id_from_window(win) {
        let id = null;
        for ( let panel_id in PANEL_WINDOWS ) {
            if ( PANEL_WINDOWS[panel_id].id == win.id ) {
                id = panel_id;
                break;
            }
        }

        return id;
    },

    is_panel_window(win) {
        return self.get_panel_id_from_window(win) ? true : false;
    },
}

export default self;
