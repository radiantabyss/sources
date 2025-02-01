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
                email: this.$route.query.email,
                code: this.$route.query.code,
                ...this.fields,
            };

            let data = await Request.post('/auth/user/accept-invite', fields);
            localStorage.setItem('jwt_token', data.jwt_token);

            //redirect the old fashion way to load lang and other settings
            window.location.href = import.meta.env.VITE_LOGIN_REDIRECT;
        },
    },
}
</script>

<template>
<div class="auth">
    <div class="auth__left">
        <div class="auth__logo"><img src="/images/logo.png" /></div>
        <div>
            <div class="title"><t>Accept Invite</t></div>

            <form>
                <div class="row">
                    <label><t>Choose a password</t></label>
                    <password v-model="fields.password" class="input--big input--full" v-focus />
                </div>
                <div class="row">
                    <button type="submit" @click.prevent="submit" class="btn mb-20"><t>Submit</t></button>
                </div>
            </form>
        </div>
    </div>
    <div class="auth__right"></div>
</div>
</template>
