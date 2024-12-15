<script>
import Form from './../Forms/Form.vue';

export default {
    components: { Form },
    methods: {
        async submit(fields) {
            let data = await Request.post('/auth/team/create', fields, true);
            localStorage.setItem('jwt_token', data.jwt_token);
            window.location.href = '/dashboard';
        },
    }
}
</script>

<template>

<div>
    <div class="page-title">
        <div>
            New Team
            <div class="crumbs">
                <router-link to="/"><sprite id="home" /></router-link>
                <sprite id="arrow-right" />
                <router-link to="/auth/user/account"><t>My Account</t></router-link>
                <sprite id="arrow-right" />
                <span><t>New Team</t></span>
            </div>
        </div>
    </div>

    <Form @submit="submit" />
</div>
</template>
