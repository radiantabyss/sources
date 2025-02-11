import PanelTray from './../Modules/PanelTray.js';

export default function(actions, parameters, win) {
    return {
        label: 'Make Transparent',
        visible: is_panel_window(win),
        click: async () => {
            let click_through = !win.click_through;
            let settings = Config.get('settings');
            win.setOpacity(click_through ? parseFloat(settings.transparency_amount) : 1);
            win.setIgnoreMouseEvents(click_through);
            win.click_through = click_through;

            //create or destroy tray
            let item = await Model.Panel.find(get_panel_id_from_window(win))
            click_through ? PanelTray.create(item) : PanelTray.destroy(item);

            //handle all windows click though
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
    }
}
