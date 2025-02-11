import { BrowserWindow } from 'electron';

let self = {
    async run(id, event) {
        let item = await Model.Panel.find(id);
        if ( !item ) {
            return Response.error('Panel not found.');
        }

        let win = BrowserWindow.fromWebContents(event.sender);

        // update panel
        let data = Invoke.all();
        let window_settings = decode_json(item.window_settings);
        window_settings.is_pinned = data.is_pinned;

        await Model.Panel.update({
            window_settings: encode_json(window_settings),
        }, {
            where: { id }
        });

        win.setAlwaysOnTop(window_settings.is_pinned ? true : false, 'screen');
        win.setSkipTaskbar(window_settings.is_pinned ? true : false);
    },
}

export default self;
