<script>
export default {
    name: 'Form',
    props: {
        item: {
            type: Object,
            required: false,
            default: null,
        }
    },
    data() {
        let fields = {
            meta: {},
        };

        if ( this.item && Object.keys(this.item).length ) {
            fields = {...fields, ...this.item};
        }

        return {
            fields,
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
        setTimeout(() => {
            document.getElementsByTagName('input')[0].focus();
        }, 150);
    },
}
</script>

<template>
<form>
    <div class="grid mb-20">
        <div class="panel col-50">
            <div class="row">
                <label><t>Name</t></label>
                <input type="text" class="input" v-model="fields.name" />
            </div>

            <div class="row">
                <label><t>Logo</t></label>
                <image-upload v-model="fields.meta.image_path" path="/auth/team/upload-image" />
            </div>
        </div>
    </div>

    <div class="grid">
        <div class="panel panel--rows col-50">
            <div class="row row--submit">
                <button type="submit" @click.prevent="submit" class="btn btn--medium"><t>Save</t></button>
                <router-link to="/auth/account"><sprite id="cancel" /><t> Cancel</t></router-link>
            </div>
        </div>
    </div>
</form>
</template>
