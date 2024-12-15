<script>
export default {
    name: 'AutocompleteComponent',
    props: {
        modelValue: {
            type: [String, Number],
            required: false,
            default: '',
        },
        text: {
            type: String,
            required: false,
            default: '',
        },
        domain: {
            type: String,
            required: false,
            default: '',
        },
        url: {
            type: String,
            required: false,
            default: '',
        },
        limit: {
            type: Number,
            required: false,
            default: 20,
        },
        placeholder: {
            type: String,
            required: false,
            default: '',
        },
        search_params: {
            type: Object,
            required: false,
            default: () => {
                return {};
            },
        },
        autosearch: {
            type: Boolean,
            required: false,
            default: false,
        },
        autosearch_limit: {
            type: Number,
            required: false,
            default: 10,
        },
        autosearch_params: {
            type: Object,
            required: false,
            default: () => {
                return {};
            },
        },
        enable_modal: {
            type: Boolean,
            required: false,
            default: false,
        },
        css_class: {
            type: String,
            required: false,
            default: '',
        },
        create: {
            type: Boolean,
            required: false,
            default: false,
        },
        create_url: {
            type: String,
            required: false,
            default: '',
        },
    },
    emits: ['update:modelValue', 'select'],
    data() {
        return {
            term: this.text,
            results: false,
            results_visible: false,
        }
    },
    methods: {
        async search(is_autosearch = false) {
            if ( !is_autosearch && this.term.length < 2 ) {
                this.results = false;
                this.results_visible = false;
                return;
            }

            let params = {
                term: this.term,
                limit: is_autosearch ? this.autosearch_limit : this.limit,
                ...this.search_params,
            };

            if ( is_autosearch ) {
                params = {
                    term: '',
                    limit: is_autosearch ? this.autosearch_limit : this.limit,
                    ...this.search_params,
                    ...this.autosearch_params
                };
            }

            let data = await Request.get(this.url ? this.url : `/${this.domain}/search`, params);
            this.results = data.items;
            this.results_visible = is_autosearch ? false : true;
        },

        select(result) {
            this.term = result.text;
            this.results_visible = false;
            this.$emit('update:modelValue', result.value);
            this.$emit('select', result);
        },

        clear() {
            this.term = '';
            this.results = false;
            this.results_visible = false;
            this.$emit('update:modelValue', '');
            this.$emit('select', false);
            this.$refs.input.focus();

            if ( this.autosearch ) {
                this.search(true);
            }
        },

        hide() {
            this.results_visible = false;
        },

        async setTerm() {
            if ( this.modelValue == '' || this.text ) {
                this.term = '';
                return;
            }

            let data = await Request.get(this.url ? this.url : `/${this.domain}/search`, { id: this.modelValue, limit: 1 });
            if ( data.items.length ) {
                this.term = data.items[0].text;
            }
        },
    },
    async mounted() {
        await this.setTerm();

        if ( this.term == '' && this.autosearch ) {
            this.search(true);
        }

        for ( let css_class of this.$el.classList ) {
            if ( ['autocomplete', 'autocomplete--inline'].includes(css_class) ) {
                continue;
            }

            this.$refs.input.classList.add(css_class);
        }

        this.$el.className = `autocomplete ${this.css_class}`;
    },
    watch: {
        modelValue() {
            this.setTerm();
        },

        search_params() {
            if ( this.autosearch ) {
                this.search(true);
            }
        },
    },
}
</script>

<template>
<div class="autocomplete">
    <input type="text" class="input"
        :placeholder="this.placeholder || __('Search '+Str.ucwords(this.domain.replace('/', ' ')))"
        v-model="term"
        ref="input"
        @input="search(false)"
        @click="results_visible = true"
    />

    <div class="autocomplete__results"
        v-show="results_visible"
        v-closable="{exclude: ['input'], handler: 'hide'}"
        v-if="results !== false"
    >
        <template v-if="results.length">
            <a @click="select(result)" v-for="result in results" :key="result.value">
                {{ result.text }}
            </a>
        </template>
        <div class="flex items-center" v-else>
            <t>No results.</t>
            <a @click="submit" class="ml-20 btn btn--tiny btn--auto" v-if="create"><t>Create</t></a>
        </div>
    </div>

    <a @click="Modal.show('')" v-if="enable_modal" class="autocomplete__search">
        <sprite id="search" />
    </a>

    <a @click="clear" v-show="term" class="autocomplete__clear">
        <sprite id="x" />
    </a>
</div>
</template>
