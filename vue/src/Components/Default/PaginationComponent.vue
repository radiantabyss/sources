<script>
export default {
    name: 'PaginationComponent',
    props: {
        url: {
            type: String,
            required: false,
            default: '',
        },
        pages: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        page_param: {
            type: String,
            required: false,
            default: 'page',
        },
        pages_left: {
            type: Number,
            required: false,
            default: 3,
        },
        pages_right: {
            type: Number,
            required: false,
            default: 3,
        },
        show_controls: {
            type: Boolean,
            required: false,
            default: true,
        },
        show_entries_count: {
            type: Boolean,
            required: false,
            default: true,
        },
        per_page_options: {
            type: Array,
            required: false,
            default() {
                return [25, 50, 100];
            },
        },
    },
    data() {
        return {
            per_page: 0,
        }
    },
    computed: {
        page() {
            if ( this.$route.query[this.page_param] ) {
                return parseInt(this.$route.query[this.page_param]);
            }

            return 1;
        },

        computed_url() {
            return this.url || this.$route.path;
        },

        full_url() {
            let params = {...this.$route.query};
            delete params[this.page_param];

            return this.computed_url.replace(/\?$/) + '?' + new URLSearchParams(params).toString();
        },

        start() {
            let start = this.page - this.pages_left;
            if ( start < 1 ) {
                start = 1;
            }

            return start;
        },

        end() {
            let end = this.page + this.pages_right;
            if ( end > this.pages ) {
                end = this.pages;
            }

            return end;
        },

        visible_pages() {
            let visible_pages = [];

            for ( let i = this.start; i <= this.end; i++ ) {
                visible_pages.push(i);
            }

            return visible_pages;
        },

        visible_entries() {
            return this.total < this.per_page * this.page ? this.total : this.per_page * this.page;
        },
    },
    methods: {
        changePerPage() {
            let params = {...this.$route.query};
            params.per_page = this.per_page;
            params[this.page_param] = 1;

            let url = this.computed_url.replace(/\?$/) + '?' + new URLSearchParams(params).toString();
            this.$router.push(`${url}`)
        },
    },
    mounted() {
        if ( !localStorage.getItem(`${this.computed_url}__per_page`) ) {
            localStorage.setItem(`${this.computed_url}__per_page`, this.per_page_options[0]);
        }

        this.per_page = localStorage.getItem(`${this.computed_url}__per_page`);
    },
}
</script>

<template>
<div class="pagination">
    <div class="flex items-center" v-if="show_entries_count">
        <div><t>Showing</t> {{ per_page * (page - 1) + 1 }} - {{ visible_entries }} <t>of</t> {{ total }} <t>entries</t></div>

        <div class="ml-10">
            <select class="input" v-model="per_page" @change="changePerPage">
                <option v-for="value in per_page_options" :key="value" :value="value">{{ value }}</option>
            </select> <t>per page</t>
        </div>
    </div>
    <div v-else></div>
    <div class="flex items-center" v-if="pages > 1">
        <router-link :to="`${full_url}&${page_param}=1`" class="page page--arrow" v-if="show_controls">
            <sprite id="control-start" />
        </router-link>

        <router-link :to="`${full_url}&${page_param}=${page - 1}`" class="page page--arrow" v-if="page > 1">
            <sprite id="arrow-left" />
        </router-link>
        <div class="page page--arrow page--disabled" v-else><sprite id="arrow-left" /></div>

        <div class="pages">
            <template v-for="i in visible_pages">
                <div class="page page--current" :key="`${i}_current`" v-if="i == page">{{ i }}</div>
                <router-link :to="`${full_url}&${page_param}=${i}`" class="page" :key="i" v-else>{{ i }}</router-link>
            </template>
        </div>

        <router-link :to="`${full_url}&${page_param}=${page + 1}`" class="page page--arrow" v-if="page < pages">
            <sprite id="arrow-right" />
        </router-link>
        <div class="page page--arrow page--disabled" v-else><sprite id="arrow-right" /></div>

        <router-link :to="`${full_url}&${page_param}=${pages}`" class="page page--arrow" v-if="show_controls">
            <sprite id="control-end" />
        </router-link>
    </div>
</div>
</template>
