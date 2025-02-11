import { app, dialog } from 'electron';

import Shortcut from './../Modules/Shortcut.js';
import Tray from './../Modules/Tray.js';
import MainWindow from './../Windows/MainWindow.js';
import UpdateWindow from './../Windows/UpdateWindow.js';
import PanelWindow from './../Windows/PanelWindow.js';
import PanelPresenter from './../Domains/Panel/Presenters/Presenter.js';

let self = {
    register() {
        app.on('ready', self.ready);
        app.on('window-all-closed', self.windowAllClosed);
        app.on('activate', self.activate);
        app.on('before-quit', self.beforeQuit);
        app.on('second-instance', self.secondInstance);
    },

    async ready() {
        if ( ENV.ENABLE_TRAY ) {
            Tray.create();
        }

        Shortcut.registerAll();

        //parse args
        let args = {};
        for ( let arg of process.argv ) {
            if ( !arg.match(/\-\-/) ) {
                continue;
            }

            arg = arg.replace('--', '');

            if ( arg.match(/\=/) ) {
                let split = arg.split('=');
                args[split[0]] = split[1];
            }
            else {
                args[arg] = true;
            }
        }

        //create a panel window if args.panel is set
        if ( args.panel_id ) {
            try {
                let panel = await Model.Panel.find(args.panel_id);
                panel = PanelPresenter.run(panel);
                PanelWindow.create(panel);
            }
            catch(e) {
                dialog.showMessageBoxSync({
                    type: 'error',
                    buttons: ['Ok'],
                    title: 'Error',
                    message: 'Panel not found.'
                });
                app.quit();
            }
        }
        else {
            UpdateWindow.create();
        }
    },

    windowAllClosed() {
        if ( Config.getKey('settings', 'has_tray') && ENV.ENABLE_TRAY ) {
            return;
        }

        if ( process.platform !== 'darwin' ) {
            app.quit();
        }
    },

    activate() {
        if ( MAIN_WINDOW === null ) {
            MainWindow.create();
        }
    },

    beforeQuit() {
        Shortcut.unregisterAll();
        Tray.destroy();
    },

    async secondInstance(e, argv) {
        //parse args
        let args = {};
        for ( let arg of argv ) {
            if ( !arg.match(/\-\-/) ) {
                continue;
            }

            arg = arg.replace('--', '');

            if ( arg.match(/\=/) ) {
                let split = arg.split('=');
                args[split[0]] = split[1];
            }
            else {
                args[arg] = true;
            }
        }

        if ( args.panel_id ) {
            try {
                let panel = await Model.Panel.find(args.panel_id);
                panel = PanelPresenter.run(panel);
                PanelWindow.create(panel);
            }
            catch(e) {
                dialog.showMessageBoxSync({
                    type: 'error',
                    buttons: ['Ok'],
                    title: 'Error',
                    message: 'Panel not found.'
                });
            }
        }
        else {
            MainWindow.show();
        }
    },
};

export default () => {
    self.register();
}
