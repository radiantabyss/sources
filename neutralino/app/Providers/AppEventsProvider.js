let self = {
    register() {
        Neutralino.events.on('windowClose', self.windowClose);
        Neutralino.events.on('quit', self.quit);

        let timeout = null;
        window.addEventListener('resize', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                self.saveWindowSetings();
            }, 100);
        });
    },

    async windowClose(e) {
        await Neutralino.window.hide();

        setTimeout(async () => {
            await self.saveWindowSetings();

            if ( WINDOW_TYPE != 'main' ) {
                //close normal windows from powershell by pid
                await Neutralino.os.execCommand(`taskkill /PID ${e.target.NL_PID} /F /T`);
                return;
            }

            //check if window closed is main window and it doesn't have tray, then close the app
            if ( WINDOW_TYPE == 'main' && !NL_ENABLE_TRAY && await Storage.get('has_tray') === false ) {
                self.quit();
            }
        }, 10);
    },

    async quit() {
        await self.saveWindowSetings();
        await Neutralino.app.exit();
    },

    async saveWindowSetings() {
        //save settings only if the window is visible
        if ( !await Neutralino.window.isVisible() ) {
            return;
        }

        let size = await Neutralino.window.getSize();
        let position = await Neutralino.window.getPosition();

        await Storage.set(`window_settings_${string_to_id(DISPLAY_PROFILE+'_'+WINDOW_TYPE)}`, {
            width: size.width,
            height: size.height,
            x: position.x,
            y: position.y,
            is_maximized: await Neutralino.window.isMaximized(),
        });
    },
};


export default () => {
    self.register();
}
