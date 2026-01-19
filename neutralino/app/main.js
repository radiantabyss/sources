'use strict'

import RABootstrap from '@radiantabyss/neutralino/src/Bootstrap.js';
import Bootstrap from './Bootstrap.js';

import SingleInstanceProvider from './Providers/SingleInstanceProvider.js';
import CLIProvider from './Providers/CLIProvider.js';
import UpdateProvider from './Providers/UpdateProvider.js';
import RouteProvider from './Providers/RouteProvider.js';
import AppProvider from './Providers/AppProvider.js';
import AppEventsProvider from './Providers/AppEventsProvider.js';

(async () => {
    await RABootstrap();
    await Bootstrap();
    await SingleInstanceProvider();

    if ( IS_PACKAGED && NL_ARGS.length > 1 ) {
        await CLIProvider();
    }
    else {
        await UpdateProvider();
        await RouteProvider();
        await AppEventsProvider();
        await AppProvider();
    }
})();
