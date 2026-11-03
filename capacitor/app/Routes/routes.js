import Route from '@radiantabyss/capacitor/src/Routing/Route.js';

Route.get('/settings', 'Settings/SettingsAction');
Route.post('/settings/update', 'Settings/UpdateSettingsAction');

Route.get('/secure/get', 'Secure/GetAction');
Route.post('/secure/set', 'Secure/SetAction');
Route.post('/secure/remove', 'Secure/RemoveAction');
