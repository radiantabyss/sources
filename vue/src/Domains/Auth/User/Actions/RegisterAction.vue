<script>
import RegisterForm from './../Forms/RegisterForm.vue';

export default {
    metaInfo() {
        return {
            title: 'Register',
        }
    },
    components: { RegisterForm },
    methods: {
        async submit(fields) {
            let data = await Request.post('/auth/user/register', fields, true);
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
            <RegisterForm @submit="submit" />
        </div>
    </div>
    <div class="auth__right"></div>
</div>
</template>
