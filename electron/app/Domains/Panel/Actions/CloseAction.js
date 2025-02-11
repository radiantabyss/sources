import { BrowserWindow } from 'electron';

let self = {
    async run(event) {
        let win = BrowserWindow.fromWebContents(event.sender);
        win.close();
    },
}

export default self;
