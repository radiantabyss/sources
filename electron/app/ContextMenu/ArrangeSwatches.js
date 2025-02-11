export default function(actions, parameters, win) {
    let panel_id = get_panel_id_from_window(win);

    return {
        label: SWATCH_ARRANGING[panel_id] ? 'Done Arranging' : 'Arrange Swatches',
        visible: is_panel_window(win),
        click: () => {
            SWATCH_ARRANGING[panel_id] = !SWATCH_ARRANGING[panel_id];
            ipc_send('panel:arrange', SWATCH_ARRANGING[panel_id]);
        }
    }
}
