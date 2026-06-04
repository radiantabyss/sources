<script>
export default {
    name: 'InviteModal',
    data() {
        return {
            name: 'invite',
            team_id: null,
            fields: {
                role: Settings.team_roles[0],
            },
        }
    },
    methods: {
        beforeOpen(e) {
            this.fields = {
                role: Settings.team_roles[0],
            };
            
            this.team_id = e.params;
            await this.$nextTick();
            this.$refs.emails.focus();
        },

        async submit(e) {
            let fields = {
                _event: e,
                ...this.fields,
            };

            let data = await Request.post(`/auth/team/invite/${this.team_id}`, fields);

            Alert.show('Invites sent!', 'success');
            this.$emit('submit', data.invites);
            Modal.hide(this.name);
        },
    }
}
</script>

<template>
<modal :name="name" class="modal--small" @before-open="beforeOpen">
    <div class="subtitle text-center">Invite Members</div>
    <div class="row">
        <label><div>Emails <i>separated by space or commas</i></div></label>
        <textarea class="input input--full" v-model="fields.emails" />
    </div>
    <div class="row">
        <label>Role</label>
        <select class="input input--full" v-model="fields.role">
            <option v-for="role in Settings.team_roles" :key="role" :value="role">
                {{ Str.ucwords(role) }}
            </option>
        </select>
    </div>
    <div class="row row--nm row--submit mt-30">
        <button type="submit" @click.prevent="submit" class="btn btn--medium">Send Invites</button>
        <a @click="Modal.hide(name)"><sprite id="cancel" /> Cancel</a>
    </div>
</modal>
</template>
