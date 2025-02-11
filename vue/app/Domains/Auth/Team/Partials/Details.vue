<script>
export default {
    name: 'Details',
    data() {
        return {
            fields: false,
        }
    },
    methods: {
        async mount() {
            let data = await Request.get(`/auth/team/edit/${this.$route.params.id}`);
            this.fields = data.item;
        },

        async submit(e) {
            let fields = {
                _event: e,
                ...this.fields,
            };

            let data = await Request.post(`/auth/team/update/${this.$route.params.id}`, fields);

            //update store
            this.$store.commit('Auth/UPDATE_TEAM', data.item);
            Alert.show('Team updated!', 'success');
        },

        cancel() {
            this.$router.push('/auth/user/account');
        },
    },
    mounted() {
        this.mount();

        setTimeout(() => {
            document.getElementsByTagName('input')[0].focus();
        }, 150);
    },
}
</script>

<template>
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
                    Save Changes
                </button>
                <a @click="$emit('cancel')"><sprite id="cancel" /> Cancel</a>
            </div>
        </div>
    </div>
</form>
</template>
