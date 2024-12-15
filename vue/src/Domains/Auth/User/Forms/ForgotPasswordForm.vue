<script>
export default {
    name: 'ForgotPasswordForm',
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
        <label><t>Email</t></label>
        <input type="email" v-model="fields.email" class="input input--full input--big" id="email" />
    </div>
    <div class="row">
        <button type="submit" @click.prevent="submit" class="btn mb-20"><t>Submit</t></button>
        <div class="mt-10">
            <router-link to="/login" class="font-12">&laquo; <t>Back to Login</t></router-link>
        </div>
    </div>
</form>
</template>
