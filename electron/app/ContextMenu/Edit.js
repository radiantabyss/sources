import MainWindow from './../Windows/MainWindow.js';

export default function(actions, parameters, win) {
    return {
        label: 'Edit',
        visible: is_panel_window(win),
        click: () => {
            let id = get_panel_id_from_window(win);

            if ( MAIN_WINDOW ) {
                MAIN_WINDOW.show();
                ipc_send('goto', `/panel/edit/${id}`, MAIN_WINDOW);
            }
            else {
                MainWindow.create(`/panel/edit/${id}`);
            }
        }
    }
}
