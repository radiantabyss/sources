<script>
import Teams from './../Partials/Teams';

export default {
    components: { Teams },
    data() {
        return {
            name: Auth.user.name,
            profile_image_path: Auth.user.meta.profile_image_path || '',
            dark_mode: Auth.user.meta.dark_mode || 0,
            lang: Auth.user.meta.lang || '',

            current_password: '',
            password: '',
        }
    },
    methods: {
        async submit(e) {
            let fields = {
                _event: e,
                name: this.name,
                meta: {
                    profile_image_path: this.profile_image_path || '',
                    dark_mode: this.dark_mode || 0,
                    lang: this.lang || '',
                }
            };

            let data = await Request.post(`/auth/user/patch`, fields);

            //if lang has changed, refresh the page
            if ( this.lang != Auth.user.meta.lang ) {
                window.location.reload();
            }

            this.$store.commit('Auth/SET', data.item);
            Alert.show('Changes saved!', 'success');
        },

        async submitChangePassword(e) {
            let fields = {
                _event: e,
                current_password: this.current_password,
                password: this.password,
            };

            await Request.post(`/auth/user/patch`, fields);
            Alert.show('Changes saved!', 'success');
        },
    },
}
</script>

<template>
<div v-if="Auth.user">
    <div class="page-title">
        <div>
            <t>My Account</t>
            <div class="crumbs">
                <router-link to="/"><sprite id="home" /></router-link>
                <sprite id="arrow-right" />
                <span><t>My Account</t></span>
            </div>
        </div>
    </div>

    <div class="grid">
        <form class="panel col-50">
            <div class="subtitle"><t>Account Details</t></div>

            <div class="row">
                <label><t>Email</t></label>
                <div class="font-16">{{ Auth.user.email }}</div>
            </div>
            <div class="row">
                <label><t>Name</t></label>
                <input type="text" class="input" v-model="name" />
            </div>
            <div class="row">
                <label><t>Profile Image</t></label>
                <image-upload v-model="profile_image_path" path="/auth/user/upload-profile-image" />
            </div>
            <div class="row">
                <label><t>Dark Mode</t></label>
                <toggle v-model="dark_mode" />
            </div>
            <div class="row row--submit mti-30">
                <button type="submit" @click.prevent="submit" class="btn btn--medium"><t>Save Changes</t></button>
            </div>
        </form>

        <form class="panel col-50">
            <div class="subtitle"><t>Change Password</t></div>

            <div class="row">
                <label><t>Current Password</t></label>
                <password v-model="current_password" />
            </div>
            <div class="row">
                <label><t>New Password</t></label>
                <password v-model="password" />
            </div>
            <div class="row row--submit">
                <button type="submit" @click.prevent="submitChangePassword" class="btn btn--medium"><t>Change Password</t></button>
            </div>
        </form>

        <Teams />
    </div>
</div>
</template>
