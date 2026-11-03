// Mirrors app/Providers/AppEventsProvider.js: closing the main window hides it (the app
// keeps running in the tray) instead of quitting.

use tauri::{AppHandle, Manager, WindowEvent};

use ra::globals::MAIN_WINDOW;

pub fn register(app: &AppHandle) {
    if let Some(main) = app.get_webview_window(MAIN_WINDOW) {
        let main_for_event = main.clone();
        main.on_window_event(move |event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                // Hide instead of close; quitting happens via the tray "Exit".
                api.prevent_close();
                let _ = main_for_event.hide();
            }
        });
    }
}
