// Mirrors app/Bootstrap.js: the boot steps that wire the app up before main.rs adds the ra
// plugin and runs the providers.

pub fn run() -> tauri::Builder<tauri::Wry> {
    // WebKitGTK's DMA-BUF renderer draws a blank/invisible page on some GPUs (NVIDIA, VMs):
    // the page is live but nothing paints. Fall back to the shared-memory renderer unless
    // the user has set the var themselves. Must run before the webview is created.
    #[cfg(target_os = "linux")]
    if std::env::var_os("WEBKIT_DISABLE_DMABUF_RENDERER").is_none() {
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    }

    tauri::Builder::default()
        // Single instance must be the first plugin registered.
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            crate::providers::single_instance::on_second_instance(app);
        }))
        // Writes the log:: calls to stdout and to a rolling file under the app log dir
        // (%LOCALAPPDATA%\{identifier}\logs on Windows).
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Stdout),
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::LogDir {
                        file_name: None,
                    }),
                ])
                .level(log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        // ra::storage keeps its settings.json in this store.
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(
            tauri_plugin_window_state::Builder::default()
                // We control the main window's visibility ourselves (start-minimized).
                .with_state_flags(
                    tauri_plugin_window_state::StateFlags::SIZE
                        | tauri_plugin_window_state::StateFlags::POSITION
                        | tauri_plugin_window_state::StateFlags::MAXIMIZED,
                )
                .build(),
        )
}
