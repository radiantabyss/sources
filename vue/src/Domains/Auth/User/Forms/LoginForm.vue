<script>
export default {
    name: 'LoginForm',
    data() {
        return {
            fields: {
                password: '',
            },
        }
    },
    methods: {
        submit(e) {
            this.$emit('submit', {
                _event: e,
                ...this.fields,
            });
        },
    },
    mounted() {
        this.$el.getElementsByTagName('input')[0].focus();
    },
}
</script>

<template>
<form>
    <div class="row">
        <label><t>Email</t></label>
        <input type="email" v-model="fields.email" id="email" class="input input--full input--big" />
    </div>
    <div class="row">
        <label><t>Password</t></label>
        <password v-model="fields.password" class="input--big input--full" style="display: block;" />
    </div>
    <div class="row">
        <button type="submit" @click.prevent="submit" class="btn mb-20"><t>LOGIN</t></button>
        <div class="mt-10 flex space-between">
            <router-link to="/forgot-password" class="font-12"><t>Forgot password?</t></router-link>
            <!-- <router-link to="/register" class="font-12"><t>Register</t></router-link> -->
        </div>
    </div>
</form>
</template>
