// Tray "Exit" action. Mirrors app/Tray/Exit.js (which dispatched 'quit').
// app.exit() bypasses the main window's close-to-hide handler and ends the process;
// tauri-plugin-window-state persists window geometry on exit.

use tauri::AppHandle;

pub fn run(app: &AppHandle, _params: &[String]) {
    app.exit(0);
}
