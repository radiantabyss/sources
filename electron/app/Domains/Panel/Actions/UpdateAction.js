import fs from 'fs-extra';
import Validator from './../Validators/Validator.js';
import Transformer from './../Transformers/Transformer.js';
import Presenter from './../Presenters/Presenter.js';
import CustomTheme from './../../../Services/CustomTheme.js';

let self = {
    async run(id) {
        let data = Invoke.all();

        //validate request
        let validation = await Validator.run(data);
        if ( validation !== true ) {
            return Response.error(validation);
        }

        data = await Transformer.run(data, id);
        await Model.Panel.update(data, {
            where: { id }
        });

        //update theme css
        data.theme_settings = decode_json(data.theme_settings);
        CustomTheme.update(data);

        //notify panel window of the update
        let item = await Model.Panel.find(id);
        item = Presenter.run(item);

        if ( PANEL_WINDOWS[id] ) {
            ipc_send('panel:update', item, PANEL_WINDOWS[id]);
        }

        if ( AUTOSYNC ) {
            self.sync(item);
        }
    },

    async sync(item) {
        //upload bg image
        if ( item.theme == 'custom' && item.theme_settings.bg_image_path ) {
            const buffer = await fs.readFile(`${STATIC_PATH}/uploads${item.theme_settings.bg_image_path}`);
            item.bg_image = new Blob([buffer], { type: 'application/octet-stream' })
        }

        //upload icon

        await Request.upload('/panel/sync', item);
    },
}

export default self;
