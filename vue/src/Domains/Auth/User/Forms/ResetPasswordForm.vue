<script>
export default {
    name: 'ResetPasswordForm',
    data() {
        return {
            fields: {},
        }
    },
    methods: {
        submit(e) {
            this.$emit('submit', {
                _event: e,
                ...this.fields,
                code: this.$route.params.code,
            });
        },
    },
    mounted() {
        setTimeout(() => {
            this.$refs.form.getElementsByTagName('input')[0].focus();
        }, 150);
    },
}
</script>

<template>
<form ref="form">
    <div class="row">
        <label><t>Password</t></label>
        <password v-model="fields.password" class="input--big input--full" />
    </div>
    <div class="row">
        <button type="submit" @click.prevent="submit" class="btn mb-20"><t>Submit</t></button>
        <div class="mt-10">
            <router-link to="/login" class="font-12">&laquo; <t>Back to Login</t></router-link>
        </div>
    </div>
</form>
</template>
