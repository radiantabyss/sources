'use strict'

import RABootstrap from '@radiantabyss/capacitor/src/Bootstrap.js';
import Bootstrap from './Bootstrap.js';

import RouteProvider from './Providers/RouteProvider.js';
import AppEventsProvider from './Providers/AppEventsProvider.js';
import AppProvider from './Providers/AppProvider.js';

(async () => {
    await RABootstrap();
    await Bootstrap();
    await RouteProvider();
    await AppEventsProvider();
    await AppProvider();
})();
