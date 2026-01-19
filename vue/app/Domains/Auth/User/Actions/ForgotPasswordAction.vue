<script>
export default {
    data() {
        return {
            fields: {},
        }
    },
    methods: {
        async submit(e) {
            let fields = {
                _event: e,
                ...this.fields,
            };

            await Request.post('/auth/user/forgot-password', fields);
            this.fields = {};
            Alert.show('You will receive shortly an email with a reset link.');
        },
    },
}
</script>

<template>
<div class="auth">
    <div class="auth__left">
        <div class="auth__logo"><img src="/images/logo.png" /></div>
        <div>
            <div class="title"><t>Reset Password</t></div>

            <form>
                <div class="row">
                    <label><t>Email</t></label>
                    <input type="email" v-model="fields.email" class="password--big" v-focus />
                </div>
                <div class="row">
                    <button type="submit" @click.prevent="submit" class="btn mb-20"><t>Submit</t></button>
                    <div class="mt-10">
                        <router-link to="/login" class="font-12">&laquo; <t>Back to Login</t></router-link>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="auth__right"></div>
</div>
</template>
