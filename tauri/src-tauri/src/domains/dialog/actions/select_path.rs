// GET /dialog/select-path — mirrors app/Domains/Dialog/Actions/SelectPathAction.js.
// Opens a native folder picker; returns the selected path (or null if cancelled).
// Safe to block here: the router runs actions on a blocking thread.

use ra::{Invoked, Response};
use serde_json::Value;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

pub fn run(app: &AppHandle, _params: &[String], _invoked: &Invoked) -> Response {
    match app.dialog().file().blocking_pick_folder() {
        Some(path) => Ok(Value::String(path.to_string())),
        None => Ok(Value::Null),
    }
}
