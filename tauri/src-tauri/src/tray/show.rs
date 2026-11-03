// Tray "Show" action. Mirrors app/Tray/Show.js.

use tauri::{AppHandle, Manager};

use ra::globals::MAIN_WINDOW;

pub fn run(app: &AppHandle, _params: &[String]) {
    if let Some(main) = app.get_webview_window(MAIN_WINDOW) {
        crate::modules::window::bring_to_front(&main);
    }
}
