// Mirrors app/Routes/routes.js. A domain's CRUD routes go in with
// routes.extend(ra::route_crud!(peer, [list, single, create])).

use ra::Route;

use crate::domains::{dialog, settings};

pub fn all() -> Vec<Route> {
    vec![
        Route::get("/dialog/select-path", dialog::actions::select_path::run),
        Route::post("/dialog/open-external-link", dialog::actions::open_external_link::run),

        Route::get("/settings/start-minimized", settings::actions::start_minimized::run),
        Route::post("/settings/update-start-minimized", settings::actions::update_start_minimized::run),
    ]
}
