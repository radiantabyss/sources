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

            let data = await Request.post('/auth/user/register', fields);
            localStorage.setItem('jwt_token', data.jwt_token);
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
            <div class="title"><t>Register</t></div>

            <form>
                <div class="row">
                    <label><t>Your Name</t></label>
                    <input type="text" v-model="fields.name" class="input input--full input--big" v-focus />
                </div>
                <div class="row">
                    <label><t>Email</t></label>
                    <input type="email" v-model="fields.email" class="input input--full input--big" />
                </div>
                <div class="row">
                    <label><t>Password</t></label>
                    <password v-model="fields.password" class="input--big input--full" style="display: block;" />
                </div>
                <div class="row">
                    <t>By continuing you agree to our</t> <a href="/terms" target="_blank"><t>Terms</t></a>
                </div>
                <div class="row">
                    <button type="submit" @click.prevent="submit" class="btn mb-20">
                        <t>Register</t>
                    </button>
                    <div class="mt-10">
                        <router-link to="/login" class="font-12"><t>Already have an account?</t></router-link>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="auth__right"></div>
</div>
</template>
