<script>
import InviteModal from './../Modals/InviteModal';

export default {
    name: 'Members',
    components: { InviteModal },
    data() {
        return {
            items: false,
            total: false,
            pages: false,
            invites: false,
        }
    },
    methods: {
        async mount() {
            let data = await Request.get(`/auth/team/list-members/${Auth.user.team.id}`);

            this.items = data.items;
            this.total = data.total;
            this.pages = data.pages;
            this.invites = data.invites;
        },

        changeRole(id, e) {
            Request.post(`/auth/team/change-role`, {
                id,
                role: e.target.value,
                team_id: Auth.user.team.id,
            }, true);
        },

        async deleteItem(id) {
            await Confirm({
                question: 'Are you sure you want to delete this team member?',
                button_text: 'Delete Team Member',
            });

            await Request.get(`/auth/team/delete-member/${id}`);
            this.items = Items.delete(this.items, id);
        },

        async deleteInvite(id) {
            await Confirm({
                question: 'Are you sure you want to delete this invite?',
            });

            await Request.get(`/auth/team/delete-invite/${id}`);
            this.invites = Items.delete(this.invites, id);
        },

        async resendInvite(id) {
            let data = await Request.post(`/auth/team/resend-invite/${id}`);
            Alert.show(__('Invite resent!'), 'success');
            this.invites = Items.replace(this.invites, data.invite);
        },
    },
    mounted() {
        this.mount();
    },
}
</script>

<template>

<div class="panel col-50">
    <div class="subtitle flex space-between">
        <t>Members</t>
        <a @click="Modal.show('invite')" class="btn btn--small btn--auto btn--icon-nm">
            <sprite id="plus"/> <t>Invite Members</t>
        </a>
    </div>

    <template v-if="items !== false">
        <template v-if="items.length">
            <pagination :url="`/auth/team/list-members/${Auth.user.team.id}`" :pages="pages" :total="total" />
            <table class="table">
                <thead>
                    <tr>
                        <th style="width: 40px;"></th>
                        <th><t>Name</t></th>
                        <th><t>Email</t></th>
                        <th><t>Role</t></th>
                        <th><t>Joined</t></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id">
                        <td>
                            <miniburger v-if="Gate.allows('role', 'admin')">
                                <a @click="deleteItem(item.id)" class="color-red" v-if="item.role != 'owner'">
                                    <sprite id="trash" class="icon-link-small" /> <t>Delete</t>
                                </a>
                            </miniburger>
                        </td>
                        <td>{{ item.user.name }}</td>
                        <td>{{ item.user.email }}</td>
                        <td>
                            <span v-if="item.role == 'owner'"><t>Owner</t></span>
                            <select class="input input--auto" @change="changeRole(item.id, $event)" v-else>
                                <option v-for="role in Settings.allowed_team_roles" :key="role" :value="role" :selected="role == item.role">
                                    {{ Str.ucwords(role) }}
                                </option>
                            </select>
                        </td>
                        <td>{{ Str.prettify_datetime(item.created_at) }}</td>
                    </tr>
                </tbody>
            </table>
            <pagination :url="`/auth/team/list-members/${Auth.user.team.id}`" :pages="pages" :total="total" />
        </template>
        <template v-else>
            <t>No {{ Str.plural($route.params.type) }} found.</t>
        </template>
    </template>

    <div class="row mti-40" v-if="invites && invites.length">
        <div class="subtitle"><t>Invites</t></div>

        <table class="table">
            <thead>
                <tr>
                    <th style="width: 40px;"></th>
                    <th><t>Email</t></th>
                    <th><t>Role</t></th>
                    <th><t>Expires at</t></th>
                    <th style="width: 40px;"></th>
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
                    <td><t>{{ Str.ucwords(invite.role) }}</t></td>
                    <td>{{ Str.prettify_datetime(invite.expires_at) }}</td>
                    <td>
                        <a @click="resendInvite(invite.id)" title="Resend Invite">
                            <sprite id="resend" class="icon-link-small" />
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <InviteModal @submit="mount" />
</div>
</template>
