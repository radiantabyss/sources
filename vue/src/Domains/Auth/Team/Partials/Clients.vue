<script>
import InviteClientModal from "../Modals/InviteClientModal";

export default {
    name: 'Clients',
    components: { InviteClientModal },
    data() {
        return {
            items: false,
            total: false,
            pages: false,
        }
    },
    methods: {
        async mount() {
            let data = await Request.get(`/auth/team/list-clients`);
            this.items = data.items;
            this.total = data.total;
            this.pages = data.pages;
        },

        async deleteItem(id) {
            await Confirm({
                question: 'Are you sure you want to delete this client account?',
                button_text: 'Delete Client Account',
            });

            await Request.get(`/auth/team/delete-client/${id}`);
            this.items = Items.delete(this.items, id);
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
        <t>Clients</t>
        <a @click="Modal.show('client')" class="btn btn--small btn--auto btn--icon-nm">
            <sprite id="plus"/> <t>Invite Clients</t>
        </a>
    </div>

    <template v-if="items !== false">
        <template v-if="items.length">
            <pagination url="/auth/team/list-clients" :pages="pages" :total="total" />
            <table class="table">
                <thead>
                    <tr>
                        <th style="width: 40px;"></th>
                        <th><t>Client</t></th>
                        <th><t>Email</t></th>
                        <th><t>Invited at</t></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id">
                        <td>
                            <miniburger v-if="Gate.allows('role', 'admin')">
                                <a @click="deleteItem(item.id)" class="color-red">
                                    <sprite id="trash" class="icon-link-small" /> <t>Delete</t>
                                </a>
                            </miniburger>
                        </td>
                        <td>{{ item.client_name }}</td>
                        <td>{{ item.email }}</td>
                        <td>{{ Str.prettify_datetime(item.created_at) }}</td>
                    </tr>
                </tbody>
            </table>
            <pagination url="/auth/team/list-clients" :pages="pages" :total="total" />
        </template>
        <template v-else>
            <t>No Clients found.</t>
        </template>
    </template>

    <InviteClientModal @close="mount" />
</div>
</template>
