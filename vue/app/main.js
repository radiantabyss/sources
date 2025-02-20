import { createApp } from 'vue';

import Layout from '@/Layout/Layout.vue';
const app = createApp(Layout);

import RABootstrap from '@radiantabyss/vue/src/Bootstrap';
import Bootstrap from '@/Bootstrap';

import AuthServiceProvider from '@/Providers/AuthServiceProvider';
import RouteServiceProvider from '@/Providers/RouteServiceProvider';
import LangServiceProvider from '@/Providers/LangServiceProvider';

RABootstrap(app)
.then(async () => {
    await Bootstrap(app);

    await AuthServiceProvider();
    await RouteServiceProvider(app);
    await LangServiceProvider(app);

    app.mount('#app');
});
