Route.post('/main/set-jwt', 'Main/SetJwtAction');
Route.post('/main/set-autosync', 'Main/SetAutosyncAction');

Route.get('/main/get-config', 'Main/GetConfigAction');
Route.post('/main/patch-config', 'Main/PatchConfigAction');
Route.post('/main/toggle-tray', 'Main/ToggleTrayAction');
Route.post('/main/set-shortcut', 'Main/SetShortcutAction');
Route.get('/main/register-all-shortcuts', 'Main/RegisterAllShortcutsAction');
Route.get('/main/unregister-all-shortcuts', 'Main/UnregisterAllShortcutsAction');
Route.get('/main/open-folder', 'Main/OpenFolderAction');

RouteCrud.run('Panel');

Route.post('/panel/sort', 'Panel/SortAction');
Route.get('/panel/open/{id}', 'Panel/OpenAction');
Route.get('/panel/close', 'Panel/CloseAction');
Route.post('/panel/create-shortcut/{id}', 'Panel/CreateShortcutAction');
Route.post('/panel/upload-bg-image', 'Panel/UploadBgImageAction');
Route.post('/panel/sync', 'Panel/SyncAction');

Route.post('/panel/pin/{id}', 'Panel/PinAction');
Route.get('/panel/minimize', 'Panel/MinimizeAction');
Route.post('/panel/set-bounds/{id}', 'Panel/SetBoundsAction');

Route.post('/panel/validate-swatch', 'Panel/ValidateSwatchAction');
Route.get('/panel/execute-swatch/{id}/{swatch_id}', 'Panel/ExecuteSwatchAction');

Route.get('/icon', 'Icon/ListAction');
Route.post('/icon/upload', 'Icon/UploadAction');
