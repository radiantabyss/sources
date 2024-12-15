<script>
export default {
    name: 'Header',
    data() {
        return {
            menu_visible: false,
            menu_teams_visible: false,
        }
    },
    methods: {
        toggleMenu(show = false) {
            this.menu_visible = show;

            if ( show ) {
                document.body.classList.add('no-scroll-m');
            }
            else {
                document.body.classList.remove('no-scroll-m');
                this.menu_teams_visible = false;
            }
        },

        async logout() {
            localStorage.removeItem('jwt_token');
            window.location.href = '/login';
        },

        async switchTeam(team_id) {
            let data = await Request.post(`/auth/team/switch/${team_id}`);
            localStorage.setItem('jwt_token', data.jwt_token);
            window.location.href = '/dashboard';
        },
    },
    async mounted() {
        let data = await Request.get('/auth/team');
        this.$store.commit('Auth/SET_TEAMS', data.items);
    },
    watch: {
        $route() {
            this.toggleMenu();
        },
    }
}
</script>

<template>
<header class="header">
    <div class="header__left"></div>
    <div class="header__right">
        <div class="header__user" v-if="Auth.user">
            <div class="header__user-details">
                <div>{{ Auth.user.name }}</div>
            </div>
            <div class="header__team-image" @click="toggleMenu(!menu_visible)" ref="show_menu">
                <img :src="uploads_url + Auth.user.meta.profile_image_path" v-if="Auth.user.meta.profile_image_path" />

                <div class="header__user-image">
                    <img :src="uploads_url + Auth.user.team.meta.image_path" v-if="Auth.user.team.meta.image_path" />
                </div>
            </div>
        </div>
        <transition name="simple-fade">
            <div class="menu" v-show="menu_visible" v-if="Auth.user" v-closable="{exclude: ['show_menu'], handler: 'toggleMenu'}">
                <div class="menu-user">
                    <div>
                        <img :src="uploads_url + Auth.user.meta.profile_image_path" v-if="Auth.user.meta.profile_image_path" />
                    </div>
                    <span>
                        {{ Auth.user.name }}
                        <p>{{ Auth.user.team.role }}</p>
                    </span>
                </div>
                <div class="menu-links" :class="menu_teams_visible ? 'menu-links--teams-visible' : ''">
                    <div class="menu-links__links">
                        <router-link to="/auth/user/account"><t>Settings</t></router-link>
                        <a @click="logout" class="color-red">Logout <sprite id="logout" class="icon-link-small" /><t> </t></a>
                    </div>
                    <div class="menu-links__teams" v-if="$store.state.Auth.teams !== false">
                        <a @click="menu_teams_visible = false">
                            <sprite id="arrow-left" class="icon-link-small" /> <t>Back</t>
                        </a>

                        <div v-show="menu_teams_visible">
                            <a v-for="team in $store.state.Auth.teams" :key="team.id" @click="switchTeam(team.id)" class="menu-links__team">
                                <div><img :src="uploads_url + team.meta.image_path" v-if="team.meta.image_path" /></div>
                                {{ team.name }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</header>
</template>
