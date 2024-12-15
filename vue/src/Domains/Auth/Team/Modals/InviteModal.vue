<script>
export default {
    name: 'InviteModal',
    data() {
        return {
            name: 'invite',
            fields: {
                role: Settings.allowed_team_roles[0],
            },
        }
    },
    methods: {
        beforeOpen() {
            setTimeout(() => {
                this.$refs.form.getElementsByTagName('textarea')[0].focus();
            }, 150);
        },

        async submit(e) {
            let fields = {
                _event: e,
                ...this.fields,
            };

            let data = await Request.post(`/auth/team/invite/${Auth.user.team.id}`, fields, true);
            Alert.show(__('Invites sent!'), 'success');
            this.$emit('submit', data.invites);
            Modal.hide(this.name);
        },
    }
}
</script>

<template>
<modal :name="name" classes="modal modal--small">
    <a @click="Modal.hide(name)" class="modal__close">
        <sprite id="x" class="small" />
    </a>

    <div class="modal__content" ref="form" >
        <div class="subtitle text-center"><t>Invite Members</t></div>
        <div class="row">
            <label><div>Emails <i><t>separated by space or commas</t></i></div></label>
            <textarea class="input input--full" v-model="fields.emails" />
        </div>
        <div class="row">
            <label><t>Role</t></label>
            <select class="input input--full" v-model="fields.role">
                <option v-for="role in Settings.allowed_team_roles" :key="role" :value="role">
                    {{ __(Str.ucwords(role)) }}
                </option>
            </select>
        </div>
        <div class="row row--nm row--submit mti-30">
            <button type="submit" @click.prevent="submit" class="btn btn--medium"><t>Send Invites</t></button>
            <a @click="Modal.hide(name)"><sprite id="cancel" /><t> Cancel</t></a>
        </div>
    </div>
</modal>
</template>
