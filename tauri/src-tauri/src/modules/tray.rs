// System tray. Mirrors app/Modules/Tray.js: the menu, each item naming a tray action
// (tray/*, registered in main.rs). Call set() again to rebuild it.

use ra::{Tray, TrayItem};
use tauri::AppHandle;

pub fn set(app: &AppHandle) -> Result<(), String> {
    // Respect the has_tray setting (default: enabled), like the original Tray.set().
    if ra::storage::get(app, "has_tray") == Some(serde_json::json!(false)) {
        return Ok(());
    }

    ra::tray::set(app, Tray::new("main").on_click("Show").items([
        TrayItem::new("Show", "Show"),
        TrayItem::new("Exit", "Exit"),
    ]))
}
