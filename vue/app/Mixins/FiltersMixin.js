export default {
    data() {
        return {
            fields: {},
            initial_fields: {},
            store: false,
            trigger_watch_fields: false,
        }
    },
    methods: {
        mount() {
            this.trigger_watch_fields = false;
            this.fields = {
                ...this.fields,
                ...this.$route.query
            };

            setTimeout(() => {
                this.trigger_watch_fields = true;
            }, 10);

            //save to storage
            if ( this.store ) {
                store_url_filters(this.$route.path, this.$route.query);
            }
        },

        submit() {
            let query = {...this.fields};

            //remove empty
            for ( let key in query ) {
                if ( query[key] === '' ) {
                    delete query[key];
                }
            }

            //reset page
            query.page = 1;

            this.$router.push({
                path: this.$route.path,
                query,
            });

            //save to storage
            if ( this.store ) {
                store_url_filters(this.$route.path, query);
            }
        },

        clear() {
            this.trigger_watch_fields = false;

            let query = {};
            if ( this.$route.query.tab ) {
                query.tab = this.$route.query.tab;
            }

            this.fields = { ...this.initial_fields };

            this.$router.push({
                path: this.$route.path,
                query,
            });

            setTimeout(() => {
                this.trigger_watch_fields = true;
            }, 10);

            //save to storage
            if ( this.store ) {
                store_url_filters(this.$route.path, {});
            }
        },

        toggle(key) {
            if ( this.fields[key] ) {
                this.fields = Item.setKey(this.fields, key, 1);
            }
            else {
                delete this.fields[key];
            }

            this.submit();
        },

        exportResults() {
            window.open(`${BACK_URL}${window.location.pathname}${window.location.search || '?'}&export=1&jwt_token=${localStorage.getItem('jwt_token')}`, '__blank');
        },
    },
    mounted() {
        this.mount();
        this.initial_fields = { ...this.fields };
    },
    watch: {
        $route() {
            this.mount();
        },
        fields: {
            handler() {
                if ( !this.trigger_watch_fields ) {
                    return;
                }

                this.submit();
            },
            deep: true,
        },
    },
}
