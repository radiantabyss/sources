import RATray from '@radiantabyss/neutralino/src/Tray.js';

let self = {
    async set() {
        //check if tray is enabled from env
        if ( !NL_ENABLE_TRAY ) {
            return;
        }

        //check if tray is enabled from config
        if ( await Storage.get('has_tray') === false ) {
            return;
        }

        items.push({ id: 'Show', text: 'Show' });
        items.push({ id: 'Exit', text: 'Exit' });

        RATray({
            for_window: 'main',
            icon: `/front/images/icon.ico`,
            menuItems: items,
        });
    },
};

export default self;
