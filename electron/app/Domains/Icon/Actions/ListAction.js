import fs from 'fs-extra';

let self = {
    async run() {
        let paged = [];
        let folders = await fs.readdir(`${STATIC_PATH}/icons`);

        for ( let i = 0; i < folders.length; i++ ) {
            let files = await fs.readdir(`${STATIC_PATH}/icons/${folders[i]}`);
            let items = [];

            for ( let j = 0; j < files.length; j++ ) {
                if ( files[j].match(/\.ico$/i) ) {
                    continue;
                }

                items.push(`/icons/${folders[i]}/${files[j]}`);
            }

            paged.push(items);
        }

        return Response.success({ paged });
    },
}

export default self;
