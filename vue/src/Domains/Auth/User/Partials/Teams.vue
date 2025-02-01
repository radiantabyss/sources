<script>
export default {
    name: 'Teams',
    data() {
        return {
            teams: false,
        }
    },
    methods: {
        async switchTeam(team_id) {
            let data = await Request.post(`/auth/team/switch/${team_id}`);

            this.$store.dispatch('Auth/login', {
                item: data.user,
                jwt_token: data.jwt_token,
            });

            //redirect to dashboard
            this.$router.push('/dashboard');

            Alert.show(`Switched to ${data.user.team.name}`, 'info');
        },

        async deleteTeam(id) {
            await Confirm({
                question: 'Are you sure you want to delete this team?',
                text: 'Warning! Connected Social Accounts, Objects, Stats and Rules will also be deleted. This is permanent.',
            });

            let data = await Request.get(`/auth/team/delete/${id}`);

            if ( data ) {
                this.$store.dispatch('Auth/login', {
                    item: data.user,
                    jwt_token: data.jwt_token,
                });
            }

            //update teams
            this.$store.commit('Auth/DELETE_TEAM', e.id);
        },

        async leaveTeam(id) {
            await Confirm({
                question: 'Are you sure you want to leave this team?',
                button_text: 'Leave Team',
            });

            let data = await Request.get(`/auth/team/leave/${id}`);

            if ( data ) {
                this.$store.dispatch('Auth/login', {
                    item: data.user,
                    jwt_token: data.jwt_token,
                });
            }

            //update teams
            this.$store.commit('Auth/DELETE_TEAM', e.id);
        },
    },
    async mounted() {
        let data = await Request.get('/auth/team');
        this.teams = data.items;
    },
}
</script>

<template>
<div class="panel pb-20 col-50">
    <div class="subtitle flex space-between">
        Teams
        <router-link to="/auth/team/new" class="btn btn--auto btn--small">
            <sprite id="plus" /> New Team
        </router-link>
    </div>

    <template v-if="teams !== false">
        <table class="table" v-if="teams.length">
            <thead>
                <tr>
                    <th style="width: 10px;"></th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Joined on</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="team in teams" :key="team.id">
                    <td>
                        <miniburger>
                            <a @click="switchTeam(team.id)" v-if="team.id != Auth.user.team.id">
                                <sprite id="goto" /> Switch Team
                            </a>
                            <gate :manage-team="team">
                                <router-link :to="`/auth/team/edit/${team.id}`">
                                    <sprite id="edit" /> Edit
                                </router-link>
                                <a @click="deleteTeam(team.id)" class="color-red">
                                    <sprite id="trash" /> Delete
                                </a>
                            </gate>

                            <a @click="leaveTeam(team.id)" class="color-red" v-if="Gate.denies('owns-team', team)">
                                <sprite id="leave" /> Leave
                            </a>
                        </miniburger>
                    </td>
                    <td class="menu-links__teams">
                        <div class="menu-links__team">
                            <div><img :src="uploads_url + team.meta.image_path" v-if="team.meta.image_path" /></div>
                            {{ team.name }}
                        </div>
                    </td>
                    <td>{{ Str.ucwords(team.role) }}</td>
                    <td>{{ Str.prettify_datetime(team.joined_at) }}</td>
                </tr>
            </tbody>
        </table>
        <template v-else>
            You aren't in any teams.
        </template>
    </template>
</div>
</template>
