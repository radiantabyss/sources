import Bounds from './Bounds.js';
import SmartSnap from './SmartSnap.js';

const Aligner = {
    async run(direction, win, panel) {
        let bounds = Bounds[`getFor${Str.ucfirst(direction)}`](win, panel);

        //check if smart snap is enabled
        if ( !Config.getKey('settings', 'has_smart_snap') ) {
            Aligner.apply(win, panel, bounds);
            return;
        }

        //run smart snap
        bounds = await SmartSnap.run(direction, panel, bounds);
        Aligner.apply(win, panel, bounds);
    },

    //private
    apply(win, panel, bounds) {
        //set bounds
        win.setBounds(bounds);

        //send refresh event
        win.webContents.send('panel:refresh');

        //toggle header
        if ( Config.getKey('settings', 'has_smart_snap') && panel.window_settings.is_header_visible ) {
            win.webContents.send('toggle-header');
        }
    }
}

export default Aligner;
