<style lang="scss">@import "@/Sass/app.scss";</style>

<script>
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import Footer from './Footer.vue';

export default {
    components: { Header, Sidebar, Footer },
    methods: {
        mount() {
            let env = import.meta.env.VITE_ENV;
            let css_class = `app env--${env} default-transition`;

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

            document.getElementById('app').className = css_class;
        }
    },
    mounted() {
        this.mount();
    },
    watch: {
        $route() {
            this.mount();
        }
    },
}
</script>

<template>
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

    <!-- Global Chrome Autofill Honeypot -->
    <div style="position: absolute; top: -9999px; left: -9999px; width: 0; height: 0; overflow: hidden; pointer-events: none;" aria-hidden="true">
        <input type="text" name="chrome_autofill_user" autocomplete="username" tabindex="-1" />
        <input type="email" name="chrome_autofill_email" autocomplete="email" tabindex="-1" />
        <input type="password" name="chrome_autofill_pass" autocomplete="current-password" tabindex="-1" />
    </div>
</template>

<template v-else>
    <router-view />
</template>
</template>
