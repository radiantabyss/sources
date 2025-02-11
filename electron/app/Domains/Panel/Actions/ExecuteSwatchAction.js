import { BrowserWindow } from 'electron';
import Executor from './../../../Services/Executor.js';

let self = {
    async run(id, swatch_id) {
        let item = await Model.Panel.find(id);
        if ( !item ) {
            return Response.error('Panel not found.');
        }

        for ( let swatch of decode_json(item.swatches) ) {
            if ( swatch.id == swatch_id ) {
                await Executor.run(item, swatch);
            }
        }
    },
}

export default self;
