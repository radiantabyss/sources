<script>
import Form from './../Forms/Form.vue';
import Members from './../Partials/Members';

export default {
    components: { Form, Members },
    data() {
        return {
            item: false,
        }
    },
    methods: {
        async submit(fields) {
            let data = await Request.post(`/auth/team/update/${this.$route.params.id}`, fields, true);

            //update store
            this.$store.commit('Auth/UPDATE_TEAM', data.item);
            Alert.show(__('Team updated!'), 'success');
        },
    },
    async mounted() {
        let data = await Request.get(`/auth/team/edit/${this.$route.params.id}`);
        this.item = data.item;
    },
}
</script>

<template>

<div v-if="item !== false">
    <div class="page-title">
        <div>
            Edit Team
            <div class="crumbs">
                <router-link to="/"><sprite id="home" /></router-link>
                <sprite id="arrow-right" />
                <router-link :to="`${Domain.url()}/${$route.params.type}`"><t>Teams</t></router-link>
                <sprite id="arrow-right" />
                <span><t>Edit Team</t></span>
            </div>
        </div>
    </div>

    <Form :item="item" @submit="submit" v-if="item" />

    <div class="page-title mti-40">
        <div><t>Manage Members</t></div>
    </div>

    <Members :team="item" />
</div>
</template>
