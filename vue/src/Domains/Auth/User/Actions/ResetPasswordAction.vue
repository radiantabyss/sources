<script>
import ResetPasswordForm from './../Forms/ResetPasswordForm.vue';

export default {
    metaInfo() {
        return {
            title: 'Set your new password',
        }
    },
    components: { ResetPasswordForm },
    methods: {
        async submit(fields) {
            let data = await Request.post('/auth/user/reset-password', fields, true);
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
            <div class="title"><t>Reset Password</t></div>
            <ResetPasswordForm @submit="submit" />
        </div>
    </div>
    <div class="auth__right"></div>
</div>
</template>
