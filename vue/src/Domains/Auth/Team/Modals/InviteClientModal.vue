<script>
export default {
    name: 'InviteClientModal',
    data() {
        return {
            name: 'client',
            fields: {},
        }
    },
    methods: {
        async submit(e) {
            let fields = {
                _event: e,
                ...this.fields,
            };

            await Request.post(`/auth/team/invite-client`, fields, true);
            Alert.show('Client was invited!');
            this.$emit('close');
            Modal.hide(this.name);
        },
    },
}
</script>

<template>
<modal :name="name" classes="modal modal--small">
    <a @click="Modal.hide(name)" class="modal__close">
        <sprite id="x" class="small" />
    </a>

    <div class="modal__content">
        <div class="subtitle text-center"><t>Invite Clients</t></div>
        <div class="row">
            <label><div><t>Email</t></div></label>
            <input class="input input--full" v-model="fields.email" />
        </div>
        <div class="row">
            <label><t>Client</t></label>
            <autocomplete domain="client"
                v-model="fields.client_id"
                :autosearch="true"
                :autosearch_limit="20"
                :autosearch_params="{order_by: 'id', order: 'desc'}"
                css_class="autocomplete--inline"
            />
        </div>
        <div class="row row--nm row--submit mt-30-i">
            <button type="submit" @click.prevent="submit" class="btn btn--medium"><t>Invite Client</t></button>
            <a @click="Modal.hide(name)"><sprite id="cancel" /><t> Cancel</t></a>
        </div>
    </div>
</modal>
</template>
