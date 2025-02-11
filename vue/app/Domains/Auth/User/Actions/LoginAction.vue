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

            let data = await Request.post('/auth/user/login', fields);
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
            <div class="title"><t>Login</t></div>

            <form>
                <div class="row">
                    <label><t>Email</t></label>
                    <input type="email" v-model="fields.email" class="input input--full input--big" v-focus />
                </div>
                <div class="row">
                    <label><t>Password</t></label>
                    <password v-model="fields.password" class="input--big input--full" style="display: block;" />
                </div>
                <div class="row">
                    <button type="submit" @click.prevent="submit" class="btn mb-20"><t>Login</t></button>
                    <div class="mt-10 flex space-between">
                        <router-link to="/forgot-password" class="font-12"><t>Forgot password?</t></router-link>
                        <router-link to="/register" class="font-12"><t>Register</t></router-link>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="auth__right"></div>
</div>
</template>
