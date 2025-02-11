import { v4 as uuid } from 'uuid';

let self = {
    async run(data, id = null) {
        if ( !id ) {
            data.uuid = uuid();
            data.position = await Model.Panel.max('position') + 1;
        }

        //set default window settings
        if ( !id ) {
            data.window_settings = {
                width: null,
                height: null,
                x: null,
                y: null,
                is_maximized: 0,
                is_pinned: 0,
                is_header_visible: 1,
                is_header_actions_visible: 1,
            };
        }

        data.swatches = encode_json(data.swatches, false);
        data.theme_settings = encode_json(data.theme_settings);
        data.window_settings = encode_json(data.window_settings);

        return data;
    },
}

export default self;
