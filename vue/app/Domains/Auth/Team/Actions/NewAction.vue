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

            let data = await Request.post('/auth/team/create', fields);
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

    <form v-if="fields !== false">
        <div class="grid mb-20">
            <div class="panel col-50">
                <div class="row">
                    <label>Name</label>
                    <input type="text" class="input" v-model="fields.name" />
                </div>

                <div class="row">
                    <label>Logo</label>
                    <image-upload v-model="fields.meta.image_path" :path="`/auth/team/upload-image/${fields.id}`" />
                </div>
            </div>
        </div>

        <div class="grid">
            <div class="panel panel--rows col-50">
                <div class="row row--submit">
                    <button type="submit" @click.prevent="submit" class="btn btn--medium">
                        Save
                    </button>
                    <a @click="$emit('cancel')"><sprite id="cancel" /> Cancel</a>
                </div>
            </div>
        </div>
    </form>
</div>
</template>
