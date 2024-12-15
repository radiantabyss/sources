<style lang="scss">@import "@/Sass/app.scss";</style>

<script>
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import Footer from './Footer.vue';

let metaInfo = {
    titleTemplate: '%s - Timereport',
    meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
    ],
    script: [],
    __dangerouslyDisableSanitizersByTagID: {
        'google-tag-manager': ['innerHTML']
    },
};

export default {
    name: 'Layout',
    metaInfo,
    components: { Header, Sidebar, Footer },
    computed: {
        app_class() {
            let css_class = '';

            if ( Auth.user ) {
                css_class += ' ' + (Auth.user.meta.dark_mode == 1 ? 'dark-mode' : 'light-mode');
            }
            else {
                css_class += ' device-mode';
            }

            if ( !Auth.user || (this.$route.meta.settings && this.$route.meta.settings.disable_header) ) {
                css_class += ' header-disabled';
            }

            if ( !Auth.user || (this.$route.meta.settings && this.$route.meta.settings.disable_sidebar) ) {
                css_class += ' sidebar-disabled';
            }

            return css_class;
        },

        in_production() {
            return import.meta.env.VITE_ENV == 'production';
        },
    },
    mounted() {
        let env = import.meta.env.VITE_ENV;
        document.body.classList.add(`env--${env}`);
        document.body.classList.add('default-transition');
    },
}
</script>

<template>
<div class="app" :class="`${app_class}`">
    <alert />
    <confirm />

    <template v-if="Auth.user">
        <Header />
        <Sidebar />

        <transition name="fade">
            <div class="action-content">
                <router-view :key="$route.path" />
            </div>
        </transition>

        <Footer />
    </template>

    <template v-else>
        <router-view />
    </template>
</div>
</template>
