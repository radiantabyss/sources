<script>
import LoginForm from './../Forms/LoginForm.vue';

export default {
    settings: {
        title: 'Login',
    },
    components: { LoginForm },
    methods: {
        async submit(fields) {
            let data = await Request.post('/auth/user/login', fields, true);
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
            <div class="title"><t>Login</t></div>
            <LoginForm @submit="submit" />
        </div>
    </div>
    <div class="auth__right"></div>
</div>
</template>
