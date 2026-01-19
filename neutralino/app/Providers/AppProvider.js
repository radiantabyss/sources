import Tray from './../Modules/Tray.js';
import Start from '@/Domains/Service/Services/Start.js';
import AddExeToOSEnvPath from '@/Domains/Service/Services/AddExeToOSEnvPath.js';

export default async () => {
    Tray.set();
    autostartServices();
    loadFrontend();
    await applyWindowSettings();

    if ( !await Storage.get('start_minimized') ) {
        await Neutralino.window.show();
    }
}

async function autostartServices() {
    let services = await Config.get('services');
    for ( let service_id in services ) {
        let service = services[service_id];

        if ( !service.current_version ) {
            continue;
        }

        if ( service.autostart && service.is_process ) {
            setTimeout(() => {
                Start.run(service_id);
            }, 1000);
        }

        setTimeout(() => {
            AddExeToOSEnvPath.run(service_id, service.exe);
        }, 1000);
    }
}

function loadFrontend() {
    let script = document.createElement('script');
    script.src = VUE_SCRIPT_URL;
    script.type = 'module';
    document.head.appendChild(script);
}

async function applyWindowSettings() {
    let window_settings = await Storage.get(`window_settings_${string_to_id(DISPLAY_PROFILE+'_'+WINDOW_TYPE)}`);
    if ( !window_settings ) {
        window_settings = {
            width: 1200 * window.devicePixelRatio,
            height: 700 * window.devicePixelRatio,
            is_maximized: 0,
        };
    }

    await Neutralino.window.setSize({
        width: window_settings.width,
        height: window_settings.height,
    });

    if ( window_settings.x && window_settings.x > 0 && window_settings.y > 0 ) {
        await Neutralino.window.move(window_settings.x, window_settings.y);
    }
    else {
        await Neutralino.window.center();
    }

    if ( window_settings.is_maximized == 1 ) {
        await Neutralino.window.maximize();
    }
}
