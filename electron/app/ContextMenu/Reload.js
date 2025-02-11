export default function(actions, parameters, win) {
    return {
        label: 'Reload',
        visible: is_panel_window(win),
        click: async () => {
            ipc_send('reload');
        }
    }
}
