import { Menu, Tray } from 'electron';
import PanelWindow from './../Windows/PanelWindow.js';

let self = {
    create(item) {
        //check if tray already exists
        if ( PANEL_TRAYS[item.id] ) {
            return;
        }

        //check if panel is open
        if ( !PANEL_WINDOWS[item.id] ) {
            return;
        }

        let win = PANEL_WINDOWS[item.id];
        let tray = new Tray(item.icon ? `${STATIC_PATH}` + item.icon : `${STATIC_PATH}/images/icon.png`);
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show/Hide',
                click: () => {
                    win.isVisible() ? win.hide() : win.show();
                }
            },
            {
                label: 'Toggle Transparency',
                click: () => {
                    PanelWindow.toggleClickThrough(win);
                }
            },
            {
                label: 'Reset Position',
                click: () => {
                    let bounds = {
                        width: 800,
                        height: 600,
                        x: 0,
                        y: 0,
                    };

                    win.setBounds(bounds);
                    Model.Panel.update({
                        window_settings: encode_json({...item.window_settings, ...bounds}),
                    }, {
                        where: { id: item.id },
                    });
                }
            },
            {
                label: 'Close',
                click: () => {
                    win.close();
                }
            },
        ]);

        tray.on('double-click', function(e) {
            win.show();
        });

        tray.setToolTip(item.name);
        tray.setContextMenu(contextMenu);

        PANEL_TRAYS[item.id] = tray;
    },

    destroy(item) {
        if ( !PANEL_TRAYS[item.id] ) {
            return;
        }

        PANEL_TRAYS[item.id].destroy();
        delete PANEL_TRAYS[item.id];
    },
}

export default self;
