<script>
export default {
    name: 'AcceptInviteForm',
    data() {
        return {
            fields: {
                password: '',
            },
        }
    },
    methods: {
        submit(e) {
            this.$emit('submit', {
                _event: e,
                email: this.$route.query.email,
                code: this.$route.query.code,
                ...this.fields,
            });
        },
    },
    mounted() {
        this.$el.getElementsByTagName('input')[0].focus();
    },
}
</script>

<template>
<form>
    <div class="row">
        <label><t>Choose a password</t></label>
        <password v-model="fields.password" class="input--big input--full" style="display: block;" />
    </div>
    <div class="row">
        <button type="submit" @click.prevent="submit" class="btn mb-20"><t>Submit</t></button>
    </div>
</form>
</template>
