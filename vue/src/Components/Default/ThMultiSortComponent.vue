<script>
export default {
    name: 'ThMultiSortComponent',
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

            let order_by = [];
            let order = [];

            if ( this.$route.query[this.order_by_param] ) {
                order_by = this.$route.query[this.order_by_param].split(',');
            }

            if ( this.$route.query[this.order_param] ) {
                order = this.$route.query[this.order_param].split(',');
            }

            if ( !order_by.includes(this.field) ) {
                icon = 'caret-up-down';
            }
            else if ( order_by.includes(this.field) && order[order_by.indexOf(this.field)] == 'asc' ) {
                icon = 'caret-up';
            }
            else if ( order_by.includes(this.field) && order[order_by.indexOf(this.field)]  == 'desc' ) {
                icon = 'caret-down';
            }

            return icon;
        },

        url() {
            let query = {...this.$route.query};
            let order_by = [];
            let order = [];

            if ( query[this.order_by_param] ) {
                order_by = query[this.order_by_param].split(',');
            }

            if ( query[this.order_param] ) {
                order = query[this.order_param].split(',');
            }

            if ( order_by.includes(this.field) ) {
                let order_by_index = order_by.indexOf(this.field);
                if ( order[order_by_index] == 'asc' ) {
                    order[order_by_index] = 'desc';
                }
                else if ( order[order_by_index] == 'desc' ) {
                    order_by.splice(order_by_index, 1);
                    order.splice(order_by_index, 1);
                }
            }
            else {
                order_by.push(this.field);
                order.push('asc');
            }

            query.order_by = order_by.join(',');
            query.order = order.join(',');
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
