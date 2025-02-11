import { dialog } from 'electron';
import Executor from './../Services/Executor.js';

export default function(actions, parameters, win) {
    return {
        label: 'View Logs',
        visible: is_panel_window(win) && (parameters.linkURL.match(/\/swatch\/.*?$/) ? true : false),
        click: () => {
            let swatch_id = parameters.linkURL.match(/\/swatch\/(.*)?$/)[1];
            let logs = Executor.logs[swatch_id] || null;
            if ( !logs ) {
                return dialog.showMessageBox(win, { message: 'No logs.'});
            }

            let message = '';
            for ( let command_id in logs ) {
                if ( !logs[command_id] ) {
                    continue;
                }

                message += logs[command_id].join('\n')+'\n';
            }

            if ( !message ) {
                return dialog.showMessageBox(win, { message: 'No logs.'});
            }

            return dialog.showMessageBox(win, { message });
        }
    }
}
