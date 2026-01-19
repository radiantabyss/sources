import Route from '@radiantabyss/neutralino/src/Routing/Route.js';

Route.get('/dialog/select-path', 'Dialog/SelectPathAction');
Route.post('/dialog/open-external-link', 'Dialog/OpenExternalLinkAction');

Route.get('/settings/start-minimized', 'Settings/StartMinimizedAction');
Route.post('/settings/update-start-minimized', 'Settings/UpdateStartMinimizedAction');
Route.get('/settings/usage', 'Settings/UsageAction');
Route.post('/settings/update-usage', 'Settings/UpdateUsageAction');
