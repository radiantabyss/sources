export default function(actions, parameters, win) {
    return {
        label: 'Close',
        visible: is_panel_window(win),
        click: async () => {
            win.close();
        }
    }
}
