import { BrowserWindow } from 'electron';

let self = {
    async run(id, event) {
        let item = await Model.Panel.find(id);
        if ( !item ) {
            return Response.error('Panel not found.');
        }

        let data = Invoke.all();
        let win = BrowserWindow.fromWebContents(event.sender);
        let window_settings = decode_json(item.window_settings);

        if ( data.is_header_visible != window_settings.is_header_visible ) {
            if ( data.is_header_visible ) {
                window_settings.height += 20;
            }
            else {
                window_settings.height -= 20;
            }
        }

        window_settings.is_header_visible = data.is_header_visible ? 1 : 0;
        window_settings.is_header_actions_visible = data.is_header_actions_visible ? 1 : 0;

        await Model.Panel.update({
            window_settings: encode_json(window_settings),
        }, {
            where: { id }
        });

        win.setBounds({
            height: window_settings.height,
        });
    },
}

export default self;
