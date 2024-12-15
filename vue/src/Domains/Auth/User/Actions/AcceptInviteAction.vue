<script>
import AcceptInviteForm from './../Forms/AcceptInviteForm.vue';

export default {
    metaInfo() {
        return {
            title: 'Accept Invite',
        }
    },
    components: { AcceptInviteForm },
    methods: {
        async submit(fields) {
            let data = await Request.post('/auth/user/accept-invite', fields, true);
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
            <div class="title"><t>Accept Invite</t></div>
            <AcceptInviteForm @submit="submit" />
        </div>
    </div>
    <div class="auth__right"></div>
</div>
</template>
