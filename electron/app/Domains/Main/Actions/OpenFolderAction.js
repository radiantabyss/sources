import { shell } from 'electron';
import path from 'path';

let self = {
    async run() {
        let data = Invoke.all();
        shell.openPath(path.resolve(`${STATIC_PATH}${data}`));
    },
}

export default self;
