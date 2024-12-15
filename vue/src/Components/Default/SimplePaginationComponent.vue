<script>
export default {
    name: 'SimplePaginationComponent',
    props: {
        page: {
            type: Number,
            required: false,
            default: 1,
        },
        per_page: {
            type: Number,
            required: false,
            default: 25,
        },
        pages: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
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
    emits: ['change', 'change-per-page'],
    data() {
        return {
            current_page: this.page,
            current_per_page: this.per_page,
        }
    },
    computed: {
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
            return this.total < this.current_per_page * this.current_page ? this.total : this.current_per_page * this.current_page;
        },
    },
    methods: {
        changePage(page) {
            this.current_page = page;
            this.$emit('change', page);
        },

        changePerPage(per_page) {
            this.current_per_page = per_page;
            this.$emit('change-per-page', per_page);
        },
    },
    watch: {
        page() {
            this.current_page = this.page;
        },

        per_page() {
            this.current_per_page = this.per_page;
        },
    },
}
</script>

<template>
<div class="pagination">
    <div class="flex items-center" v-if="show_entries_count">
        <div>
            <t>Showing</t> {{ current_per_page * (current_page - 1) + 1 }} -
            {{ visible_entries }} <t>of</t> {{ total }} <t>entries</t>
        </div>

        <div class="ml-10">
            <select class="input" v-model="current_per_page" @change="changePerPage">
                <option v-for="value in per_page_options" :key="value" :value="value">{{ value }}</option>
            </select> <t>per page</t>
        </div>
    </div>
    <div class="flex items-center" v-if="pages > 1">
        <a @click="changePage(1)" class="page page--arrow" v-if="show_controls">
            <sprite id="control-start" />
        </a>

        <a @click="changePage(current_page - 1)" class="page page--arrow" v-if="current_page > 1">
            <sprite id="arrow-left" />
        </a>
        <div class="page page--arrow page--disabled" v-else><sprite id="arrow-left" /></div>

        <div class="pages">
            <template v-for="i in visible_pages">
                <div class="page page--current" :key="`${i}_current`" v-if="i == current_page">{{ i }}</div>
                <a @click="changePage(i)" class="page" :key="i" v-else>{{ i }}</a>
            </template>
        </div>

        <a @click="changePage(current_page + 1)" class="page page--arrow" v-if="current_page < pages">
            <sprite id="arrow-right" />
        </a>
        <div class="page page--arrow page--disabled" v-else><sprite id="arrow-right" /></div>

        <a @click="changePage(pages)" class="page page--arrow" v-if="show_controls">
            <sprite id="control-end" />
        </a>
    </div>
</div>
</template>
