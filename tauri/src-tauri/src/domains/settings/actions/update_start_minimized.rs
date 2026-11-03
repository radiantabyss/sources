// POST /settings/update-start-minimized  { start_minimized }
// Mirrors app/Domains/Settings/Actions/UpdateStartMinimizedAction.js. Only affects the next
// launch, see modules::window::apply.

use ra::{Invoked, Response};
use serde_json::Value;
use tauri::AppHandle;

pub fn run(app: &AppHandle, _params: &[String], invoked: &Invoked) -> Response {
    ra::storage::set(app, "start_minimized", Value::Bool(invoked.bool("start_minimized")))?;

    Ok(Value::Null)
}
