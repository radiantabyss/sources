// GET /settings/start-minimized — mirrors app/Domains/Settings/Actions/StartMinimizedAction.js.
// Returns whether the main window starts hidden in the tray.

use ra::{Invoked, Response};
use serde_json::Value;
use tauri::AppHandle;

pub fn run(app: &AppHandle, _params: &[String], _invoked: &Invoked) -> Response {
    Ok(Value::Bool(crate::modules::window::start_minimized(app)))
}
