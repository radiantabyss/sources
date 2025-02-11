import { screen } from 'electron';

const Bounds = {
    getForTop(win, panel) {
        let bounds = win.getBounds();
        let current_screen = screen.getDisplayNearestPoint({x: bounds.x, y: bounds.y});
        let width = Bounds.getWidth(win, panel, Config.getKey('settings', 'has_smart_snap'));
        let height = Bounds.getHeight(win, panel);

        return {
            width,
            height,
            x: current_screen.workArea.x,
            y: current_screen.workArea.y,
        };
    },

    getForBottom(win, panel) {
        let bounds = win.getBounds();
        let current_screen = screen.getDisplayNearestPoint({x: bounds.x, y: bounds.y});
        let width = Bounds.getWidth(win, panel, Config.getKey('settings', 'has_smart_snap'));
        let height = Bounds.getHeight(win, panel);

        return {
            width,
            height,
            x: current_screen.workArea.x,
            y: current_screen.workArea.height + current_screen.workArea.y - height,
        };
    },

    getForRight(win, panel) {
        let bounds = win.getBounds();
        let current_screen = screen.getDisplayNearestPoint({x: bounds.x, y: bounds.y});
        let width = Bounds.getWidth(win, panel);
        let height = Bounds.getHeight(win, panel, Config.getKey('settings', 'has_smart_snap'));

        return {
            width,
            height,
            x: current_screen.workArea.width + current_screen.workArea.x - width,
            y: current_screen.workArea.y,
        };
    },

    getForLeft(win, panel) {
        let bounds = win.getBounds();
        let current_screen = screen.getDisplayNearestPoint({x: bounds.x, y: bounds.y});
        let width = Bounds.getWidth(win, panel);
        let height = Bounds.getHeight(win, panel, Config.getKey('settings', 'has_smart_snap'));

        return {
            width,
            height,
            x: current_screen.workArea.x,
            y: current_screen.workArea.y,
        };
    },

    //private
    getConstants(panel) {
        let swatch_width = 95;
        let swatch_height = 95;
        let swatch_margin = 20;
        let panel_padding = 20;
        let header_height = 20;
        let header_visible_height = 20;

        if ( panel.show_swatch_text ) {
            swatch_height = 119;
        }

        if ( panel.swatch_icon_size == 'small' ) {
            swatch_width = 70;
            swatch_height = 70;

            if ( panel.show_swatch_text ) {
                swatch_height = 94;
            }
        }
        else if ( panel.swatch_icon_size == 'tiny' ) {
            swatch_width = 50;
            swatch_height = 50;

            if ( panel.show_swatch_text ) {
                swatch_height = 74;
            }
        }

        return { swatch_width, swatch_height, swatch_margin, panel_padding, header_height, header_visible_height };
    },

    //private
    getWidth(win, panel, is_horizontal = false) {
        let bounds = win.getBounds();
        let current_screen = screen.getDisplayNearestPoint({x: bounds.x, y: bounds.y});
        let constants = Bounds.getConstants(panel);

        let swatches_per_row = is_horizontal ? 1 : Math.ceil(current_screen.workArea.height / constants.swatch_height);
        let rows = Math.ceil(panel.swatches.length / swatches_per_row);
        let width = rows * constants.swatch_width - constants.swatch_margin + constants.panel_padding + (is_horizontal ? 20 : 0);

        return width;
    },

    //private
    getHeight(win, panel, is_vertical = false) {
        let bounds = win.getBounds();
        let current_screen = screen.getDisplayNearestPoint({x: bounds.x, y: bounds.y});
        let constants = Bounds.getConstants(panel);

        let swatches_per_row = is_vertical ? 1 : Math.ceil(current_screen.workArea.width / constants.swatch_width);
        let rows = Math.ceil(panel.swatches.length / swatches_per_row);
        let height = rows * constants.swatch_height - constants.swatch_margin + constants.panel_padding + constants.header_height;

        if ( panel.window_settings.is_header_visible ) {
            height += constants.header_visible_height;
        }

        return height;
    },
}

export default Bounds;
