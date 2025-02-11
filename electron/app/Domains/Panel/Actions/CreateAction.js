import fs from 'fs-extra';
import Validator from './../Validators/Validator.js';
import Transformer from './../Transformers/Transformer.js';
import Presenter from './../Presenters/Presenter.js';

let self = {
    async run() {
        let data = Invoke.all();

        //validate request
        let validation = await Validator.run(data);
        if ( validation !== true ) {
            return Response.error(validation);
        }

        data = await Transformer.run(data);
        let item = await Model.Panel.create(data);

        if ( AUTOSYNC ) {
            self.sync(item);
        }
    },

    async sync(item) {
        item = Presenter.run(item);

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
