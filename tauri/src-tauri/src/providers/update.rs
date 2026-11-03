// Mirrors app/Providers/UpdateProvider.js: check for updates (only in packaged builds,
// only on Mondays) and install + relaunch if a newer version exists. Uses
// tauri-plugin-updater instead of the custom manifest/ping logic.
//
// Requires the backend to serve a Tauri-format update endpoint and the app to be built
// with a matching signing key (see tauri.conf.json `plugins.updater`). Until that is in
// place the check simply fails and is ignored.

use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;

pub fn check(app: AppHandle) {
    // Never self-update a dev build: neither `tauri dev` (debug) nor a `tauri build` from
    // tauri.conf.json (devtools on), which would otherwise replace itself with the release.
    if !ra::globals::is_packaged() || ra::globals::is_dev_build(&app) {
        return;
    }

    // Match the original "check only on Monday" gate (1970-01-01 was a Thursday).
    let days_since_epoch = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs() / 86_400)
        .unwrap_or(0);
    let weekday = (days_since_epoch + 4) % 7; // 0 = Sunday ... 1 = Monday
    if weekday != 1 {
        return;
    }

    tauri::async_runtime::spawn(async move {
        if let Err(e) = run(app).await {
            log::warn!("update check failed: {e}");
        }
    });
}

async fn run(app: AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let updater = app.updater()?;
    if let Some(update) = updater.check().await? {
        update.download_and_install(|_chunk, _total| {}, || {}).await?;
        app.restart();
    }
    Ok(())
}
