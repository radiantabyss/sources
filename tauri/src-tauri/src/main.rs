// Mirrors app/main.js: the ra plugin with the app's routes, tray and context menu, then the
// providers in order. Tauri builds the app before running it, so the providers go in setup(),
// which runs once the app is up.

// Prevents an additional console window on Windows in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod bootstrap;
mod domains;
mod modules;
mod providers;
mod routes;
mod tray;

fn main() {
    bootstrap::run()
        .plugin(
            ra::Builder::new()
                .routes(routes::all())
                .tray_action("Show", tray::show::run)
                .tray_action("Exit", tray::exit::run)
                .context_menu(["Copy", "Paste", "", "Inspect"])
                .build(),
        )
        .setup(|app| {
            let app = app.handle();

            modules::tray::set(app)?;
            providers::app_events::register(app);
            providers::update::check(app.clone());

            // The window is created hidden; reveal it unless the user chose to start minimized.
            modules::window::apply(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
