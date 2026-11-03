// POST /dialog/open-external-link { url } — mirrors app/Domains/Dialog/Actions/OpenExternalLinkAction.js.
// Opens a URL in the user's default browser.

use ra::{Invoked, Response};
use serde_json::Value;
use tauri::AppHandle;
use tauri_plugin_opener::OpenerExt;

pub fn run(app: &AppHandle, _params: &[String], invoked: &Invoked) -> Response {
    let url = invoked.str("url")?;

    // only web/mail urls, never file:// or custom protocol handlers
    let lower = url.trim().to_ascii_lowercase();
    if !["http://", "https://", "mailto:"].iter().any(|scheme| lower.starts_with(scheme)) {
        return Err("Only http(s) and mailto links can be opened.".to_string());
    }

    app.opener()
        .open_url(url, None::<&str>)
        .map_err(|e| e.to_string())?;

    Ok(Value::Null)
}
