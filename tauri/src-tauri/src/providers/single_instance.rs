// Mirrors app/Providers/SingleInstanceProvider.js, but uses tauri-plugin-single-instance
// instead of the PowerShell process-counting hack. When a second launch is attempted,
// focus the already-running main window.

use tauri::{AppHandle, Manager};

use ra::globals::MAIN_WINDOW;

pub fn on_second_instance(app: &AppHandle) {
    if let Some(main) = app.get_webview_window(MAIN_WINDOW) {
        crate::modules::window::bring_to_front(&main);
    }
}
