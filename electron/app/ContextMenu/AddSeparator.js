export default function(actions, parameters, win) {
    return {
        label: 'Add Separator',
        visible: is_panel_window(win),
        click: () => {
            ipc_send('panel:add-separator');
        }
    }
}
