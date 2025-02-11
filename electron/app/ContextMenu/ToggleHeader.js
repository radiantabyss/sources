export default function(actions, parameters, win) {
    return {
        label: 'Toggle Header',
        visible: is_panel_window(win),
        click: async () => {
            let id = get_panel_id_from_window(win);
            let panel = await Model.Panel.find(id);
            ipc_send('panel:toggle-header', panel);
        }
    }
}
