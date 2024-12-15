<script>
export default {
    name: 'ThSortComponent',
    props: {
        field: {
            type: String,
            required: true,
        },
        order_by_param: {
            type: String,
            required: false,
            default: 'order_by',
        },
        order_param: {
            type: String,
            required: false,
            default: 'order',
        }
    },
    data() {
        return {

        }
    },
    computed: {
        icon() {
            let icon = '';

            if ( this.$route.query[this.order_by_param] != this.field ) {
                icon = 'caret-up-down';
            }
            else if ( this.$route.query[this.order_param] == 'asc' ) {
                icon = 'caret-up';
            }
            else if ( this.$route.query[this.order_param] == 'desc' ) {
                icon = 'caret-down';
            }

            return icon;
        },

        url() {
            let query = {...this.$route.query};
            let direction = 'desc';

            if ( query[this.order_by_param] == this.field && query[this.order_param] == 'desc' ) {
                direction = 'asc';
            }

            query[this.order_by_param] = this.field;
            query[this.order_param] = direction;
            query.page = 1;

            return this.$route.path + '?' + new URLSearchParams(query).toString();
        },
    },
}
</script>

<template>
<th class="table-sort">
    <router-link :to="url">
        <span><slot /></span><sprite :id="icon" />
    </router-link>
</th>
</template>
