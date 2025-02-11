import axios from 'axios';
import fs from 'fs-extra';
import Presenter from './../Presenters/Presenter.js';
import Transformer from './../Transformers/Transformer.js';

let self = {
    async run() {
        await self.upload();
        await self.download();
    },

    async upload() {
        let items = await Model.Panel.findAll();
        for ( let item of items ) {
            item = Presenter.run(item);

            //upload bg image
            if ( item.theme == 'custom' && item.theme_settings.bg_image_path ) {
                const buffer = await fs.readFile(`${STATIC_PATH}/uploads${item.theme_settings.bg_image_path}`);
                item.bg_image = new Blob([buffer], { type: 'application/octet-stream' })
            }

            //upload icon

            await Request.upload('/panel/sync', item);
        }
    },

    async download() {
        let { items } = await Request.get('/panel');
        let local_items = keyBy(await Model.Panel.findAll(), 'uuid');

        for ( let item of items ) {
            //ignore existing items
            if ( local_items[item.uuid] ) {
                continue;
            }

            let item_data = {...item};

            //remove useless keys
            delete item_data.user_id;
            delete item_data.created_at;
            delete item_data.modified_at;

            item_data =  await Transformer.run(item_data, item.id);
            await Model.Panel.create(item_data);

            //download theme bg
            if ( item.theme == 'custom' && item.theme_settings.bg_image_path ) {
                const writer = fs.createWriteStream(`${STATIC_PATH}/uploads${item.theme_settings.bg_image_path}`);
                const response = await axios({
                    url: `${ENV.UPLOADS_URL}${item.theme_settings.bg_image_path}`,
                    method: 'GET',
                    responseType: 'stream',
                });

                try {
                    await new Promise((resolve, reject) => {
                        response.data.pipe(writer);
                        writer.on('finish', resolve);
                        writer.on('error', (e) => {
                            reject(e);
                        });
                    });
                }
                catch(e) {}
            }

            //download icon

        }
    },
}

export default self;
