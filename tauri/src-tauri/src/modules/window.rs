// Startup visibility of the main window. The window is created hidden (tauri.conf.json
// `visible: false`) and revealed on setup unless the user chose to start minimized.

use tauri::{AppHandle, Manager, WebviewWindow};

use ra::globals::MAIN_WINDOW;

/// The stored start_minimized setting (default: false).
pub fn start_minimized(app: &AppHandle) -> bool {
    ra::storage::get(app, "start_minimized") == Some(serde_json::json!(true))
}

/// Reveal the main window, unless it should start minimized to the tray.
pub fn apply(app: &AppHandle) {
    if start_minimized(app) {
        return;
    }

    if let Some(win) = app.get_webview_window(MAIN_WINDOW) {
        bring_to_front(&win);
    }
}

/// Show, restore and focus a window (tray "Show", second launch).
/// On Linux we skip set_focus(): GNOME treats a focus request without an activation token as
/// focus stealing and posts an "app is ready" notification instead of raising it;
/// showing the window is enough to bring it up there.
pub fn bring_to_front(win: &WebviewWindow) {
    let _ = win.show();
    let _ = win.unminimize();

    #[cfg(not(target_os = "linux"))]
    let _ = win.set_focus();
}
