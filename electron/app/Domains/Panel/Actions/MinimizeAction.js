import { BrowserWindow } from 'electron';

let self = {
    async run(event) {
        let win = BrowserWindow.fromWebContents(event.sender);
        Invoke.get('is_pinned') ? win.hide() : win.minimize();
    },
}

export default self;
