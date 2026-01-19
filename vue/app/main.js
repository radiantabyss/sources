import { createApp } from 'vue';

import Layout from '@/Layout/Layout.vue';
const app = createApp(Layout);

import RABootstrap from '@radiantabyss/vue/src/Bootstrap.js';
import Bootstrap from '@/Bootstrap.js';

import AuthProvider from '@/Providers/AuthProvider.js';
import RouteProvider from '@/Providers/RouteProvider.js';
import LangProvider from '@/Providers/LangProvider.js';

RABootstrap(app)
.then(async () => {
    await Bootstrap(app);

    await AuthProvider();
    await RouteProvider(app);
    await LangProvider(app);

    app.mount('#app');
});
