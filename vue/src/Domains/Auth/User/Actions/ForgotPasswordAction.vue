<script>
import ForgotPasswordForm from './../Forms/ForgotPasswordForm.vue';

export default {
    metaInfo() {
        return {
            title: 'Forgot your password?',
        }
    },
    components: { ForgotPasswordForm },
    methods: {
        async submit(fields) {
            await Request.post('/auth/user/forgot-password', fields, true);
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
            <ForgotPasswordForm @submit="submit" />
        </div>
    </div>
    <div class="auth__right"></div>
</div>
</template>
