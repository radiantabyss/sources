import { App } from '@capacitor/app';

let last_active = null;

let self = {
    register() {
        App.addListener('appStateChange', ({ isActive }) => {
            self.foreground(isActive);
        });

        //appStateChange does not fire for screen-off on every Android version, so pair it
        //with the visibility event, which does
        document.addEventListener('visibilitychange', () => {
            self.foreground(document.visibilityState === 'visible');
        });

        window.addEventListener('pagehide', () => {
            self.foreground(false);
        });
    },

    //screen lock doesn't kill the app and a backgrounded webview gets its timers frozen at
    //android's discretion, so front listens with IPC.on('app-foreground') to pause or tear
    //down sockets and polling. several signals fire for one departure, so send changes only
    foreground(active) {
        if ( active === last_active ) {
            return;
        }

        last_active = active;
        IPC.send('app-foreground', { active });
    },
};

export default () => {
    self.register();
}
