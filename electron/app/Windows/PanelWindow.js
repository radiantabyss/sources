import { BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Protocol from './../Modules/Protocol.js';
import PanelTray from './../Modules/PanelTray.js';
import PanelShortcut from './../Modules/PanelShortcut.js';
import Executor from './../Services/Executor.js';

let self = {
    create(item) {
        //check if window is already opened
        if ( PANEL_WINDOWS[item.id] ) {
            PANEL_WINDOWS[item.id].show();
            PANEL_WINDOWS[item.id].focus();
            return;
        }

        let options = self.getOptions(item);
        let win = new BrowserWindow(options);

        self.applySettings(win, item);
        self.setUrl(win, item);
        self.registerEvents(win, item);

        PANEL_WINDOWS[item.id] = win;
    },

    //private
    getOptions(item) {
        let options = {
            show: false,
            frame: false,
            backgroundColor: '#181425',
            minHeight: 15,
            icon: item.icon !== undefined ? `${STATIC_PATH}${item.icon}` : `${STATIC_PATH}/images/icon.png`,
            webPreferences: {
                preload: join(dirname(fileURLToPath(import.meta.url)), '/../preload.js'),
                additionalArguments: ['--is-panel'],
            },
            custom: {
                type: 'panel',
            },
        };

        if ( item.window_settings.width ) {
            options.width = item.window_settings.width;
        }

        if ( item.window_settings.height ) {
            options.height = item.window_settings.height;
        }

        return options;
    },

    //private
    applySettings(win, item) {
        //remove menu
        win.removeMenu();

        //adjust window based on settings
        if ( item.window_settings.x !== null && item.window_settings.y !== null ) {
            win.setPosition(item.window_settings.x, item.window_settings.y);
        }

        if ( item.window_settings.is_maximized == 1 ) {
            win.maximize();
        }

        win.setAlwaysOnTop(item.window_settings.is_pinned ? true : false, 'screen');
        win.setSkipTaskbar(item.window_settings.is_pinned ? true : false);
    },

    //private
    setUrl(win, item) {
        let url = `/panel/single/${item.id}`;

        if ( IS_PACKAGED ) {
            Protocol.create();
            win.loadURL(`${Protocol.scheme}://index.html${url}`);
        }
        else {
            win.loadURL(`${ENV.FRONT_URL}${url}`);
        }

        if ( ENV.ENABLE_DEV_TOOLS ) {
            win.webContents.openDevTools();
        }
    },

    //private
    registerEvents(win, item) {
        win.once('ready-to-show', () => {
            win.show();
            PanelShortcut.register(win, item);
        });

        win.on('close', async () => {
            //kill services
            for ( let swatch of item.swatches ) {
                if ( swatch.type != 'swatch' || !swatch.commands ) {
                    continue;
                }

                let commands = decode_json(swatch.commands);
                if ( !commands ) {
                    continue;
                }

                for ( let command of commands ) {
                    if ( !Executor.services[command.id] ) {
                        continue;
                    }

                    await tree_kill_promise(Executor.services[command.id].pid);
                }
            }

            PanelTray.destroy(item);
            win.destroy();
            delete PANEL_WINDOWS[item.id];
            PanelShortcut.unregister(item);
        });

        let events = ['move', 'resize', 'maximize', 'pin'];
        for ( let event of events ) {
            win.on(event, () => {
                self.updateSettings(win, item.id);
            });
        }
    },

    //private
    async updateSettings(win, id) {
        let item = await Model.Panel.find(id);
        let window_settings = decode_json(item.window_settings);

        //get is maximized/minimized
        window_settings.is_maximized = win.isMaximized() ? 1 : 0;
        window_settings.is_pinned = win.isAlwaysOnTop() ? 1 : 0;

        //set bounds
        if ( !window_settings.is_maximized ) {
            window_settings = {...window_settings, ...win.getBounds()};
        }

        Model.Panel.update({
            window_settings: encode_json(window_settings),
        }, {
            where: { id }
        });

        win.webContents.send('panel:refresh');
    },

    async setClickThrough(win, click_through, handle_all = true) {
        let settings = Config.get('settings');
        win.setOpacity(click_through ? parseFloat(settings.transparency_amount) : 1);
        win.setIgnoreMouseEvents(click_through);
        win.click_through = click_through;

        //create or destroy tray
        let item = await Model.Panel.find(get_panel_id_from_window(win))
        click_through ? PanelTray.create(item) : PanelTray.destroy(item);

        //handle all windows click though
        if ( handle_all ) {
            let all_click_through = true;
            for ( let panel_id in PANEL_WINDOWS ) {
                if ( !PANEL_WINDOWS[panel_id].click_through ) {
                    all_click_through = false;
                    break;
                }
            }

            if ( all_click_through && !CLICK_THROUGH_PANEL_WINDOWS ) {
                CLICK_THROUGH_PANEL_WINDOWS = true;
            }
            else if ( !all_click_through && CLICK_THROUGH_PANEL_WINDOWS ) {
                CLICK_THROUGH_PANEL_WINDOWS = false;
            }
        }
    },

    toggleClickThrough(win) {
        self.setClickThrough(win, !win.click_through);
    },

    toggleClickThroughAll() {
        CLICK_THROUGH_PANEL_WINDOWS = !CLICK_THROUGH_PANEL_WINDOWS;

        for ( let panel_id in PANEL_WINDOWS ) {
            self.setClickThrough(PANEL_WINDOWS[panel_id], CLICK_THROUGH_PANEL_WINDOWS, false);
        }
    },
};

export default self;
