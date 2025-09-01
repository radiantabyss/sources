<script>
import InviteModal from './../Modals/InviteModal';

export default {
    name: 'Members',
    components: { InviteModal },
    data() {
        return {
            team: false,
            items: false,
            total: false,
            pages: false,
            loading: true,
            invites: false,
        }
    },
    methods: {
        async mount() {
            this.loading = true;
            let data = await Request.get(`/auth/team/edit/${this.$route.params.id}`);
            this.team = data.item;

            data = await Request.get(`/auth/team/list-members/${this.$route.params.id}`, {
                page: this.$route.query.page || '',
                per_page: this.$route.query.per_page || '',
            });

            this.items = data.items;
            this.total = data.total;
            this.pages = data.pages;
            this.invites = data.invites;
            this.loading = false;
        },

        async changeRole(id, e) {
            let fields = {
                id,
                role: e.target.value,
                team_id: this.$route.params.id,
            };

            await Request.post(`/auth/team/change-role`, fields);
        },

        async deleteItem(id) {
            await Confirm({
                question: 'Are you sure you want to delete this user?',
            });

            await Request.get(`/auth/team/delete-member/${id}`);
            this.items = Items.delete(this.items, id);
        },

        async deleteInvite(id) {
            await Request.get(`/auth/team/delete-invite/${id}`);
            this.invites = Items.delete(this.invites, id);
        },

        async resendInvite(id) {
            let data = await Request.post(`/auth/team/resend-invite/${id}`);
            Alert.show('Invite resent!', 'success');
            this.invites = Items.replace(this.invites, data.invite);
        },

        invitesSubmit(invites) {
            this.invites = Items.addMany(this.invites || [], invites);
        },
    },
    mounted() {
        this.mount();
    },
    watch: {
        $route() {
            this.mount();
        },
    },
}
</script>

<template>

<div class="grid gap-20">
    <div class="panel col-60">
        <div class="subtitle flex space-between">
            <span></span>
            <a @click="Modal.show('invite')" class="btn btn--small btn--auto btn--icon-nm">
                <sprite id="plus"/> Invite Members
            </a>
        </div>

        <div class="table-wrapper">
            <div class="loading-overlay" v-if="loading"><sprite id="request-spinner" /></div>

            <template v-if="items !== false">
                <template v-if="items.length">
                    <pagination :url="`/auth/team/edit/${$route.params.id}?tab=members`" :pages="pages" :total="total" />
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="width: 10px;"></th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in items" :key="item.id">
                                <td>
                                    <miniburger>
                                        <a @click="Modal.show('manage-ad-accounts', { member: item })">
                                            <sprite id="ad_account" /> Manage Ad Accounts
                                        </a>
                                        <a @click="deleteItem(item.id)" class="color-red" v-if="item.role != 'owner'">
                                            <sprite id="trash" class="icon-link-small" /> Delete
                                        </a>
                                    </miniburger>
                                </td>
                                <td>{{ item.user.name }}</td>
                                <td>{{ item.user.email }}</td>
                                <td>
                                    <span v-if="item.role == 'owner'">Owner</span>
                                    <select class="input input--auto" @change="changeRole(item.id, $event)" v-else>
                                        <option v-for="role in Settings.allowed_team_roles" :key="role" :value="role" :selected="role == item.role">
                                            {{ Str.ucwords(role) }}
                                        </option>
                                    </select>
                                </td>
                                <td>{{ Str.pretty_datetime(item.created_at) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </template>
                <template v-else>
                    No members found.
                </template>
            </template>
        </div>
    </div>

    <div class="panel col-40" v-if="invites && invites.length">
        <div class="subtitle">Invites</div>

        <table class="table">
            <thead>
                <tr>
                    <th style="width: 10px;"></th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Expires</th>
                    <th style="width: 10px;"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="invite in invites" :key="invite.id">
                    <td>
                        <a @click="deleteInvite(invite.id)" class="color-red" title="Delete Invite">
                            <sprite id="trash" class="icon-link-small" />
                        </a>
                    </td>
                    <td>{{ invite.email }}</td>
                    <td>{{ Str.ucwords(invite.role) }}</td>
                    <td>{{ Str.pretty_datetime(invite.expires_at) }}</td>
                    <td>
                        <a @click="resendInvite(invite.id)" title="Resend Invite">
                            <sprite id="resend" class="icon-link-small" />
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <InviteModal />
</div>
</template>
