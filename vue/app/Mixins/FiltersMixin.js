export default {
    data() {
        return {
            fields: {},
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
            this.$router.push({
                path: this.$route.path,
                query: {},
            });

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
    },
    mounted() {
        this.mount();
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
