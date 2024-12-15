<script>
export default {
    name: 'Sidebar',
    data() {
        let links = [
            { url: '/', name: __('Dashboard'), icon: 'dashboard' },
            { url: '/client', name: __('Clients'), icon: 'client' },
            { url: '/project', name: __('Projects'), icon: 'project' },
            { url: '/timereport', name: __('Timereport'), icon: 'timereport' },
            { url: '/timereport/new', name: __('Log Time'), icon: 'log-time' },
            { url: '' },
            { url: '/invoice', name: __('Invoices'), icon: 'invoice' },
            { url: '/statement', name: __('Statements'), icon: 'statement' },
            { url: '/homebank-statement', name: __('Homebank Stmts'), icon: 'statement' },
            { url: '/expense', name: __('Expenses'), icon: 'expense' },
            { url: '/withdrawal', name: __('Withdrawals'), icon: 'withdrawal' },
            { url: '/upwork-statement', name: __('Upwork Stmts'), icon: 'upwork' },
            { url: '/report', name: __('Report'), icon: 'calculator' },
        ];

        if ( Auth.user.team.role == 'accountant' ) {
            links = [
                { url: '/timereport', name: __('Timereport'), icon: 'timereport' },
                { url: '/invoice', name: __('Invoices'), icon: 'invoice' },
                { url: '/statement', name: __('Statements'), icon: 'statement' },
                { url: '/homebank-statement', name: __('Homebank Stmts'), icon: 'statement' },
                { url: '/expense', name: __('Expenses'), icon: 'expense' },
                { url: '/withdrawal', name: __('Withdrawals'), icon: 'withdrawal' },
                { url: '/upwork-statement', name: __('Upwork Stmts'), icon: 'upwork' },
            ];
        }

        return {
            links,
        }
    },
    computed: {
        computed_links() {
            let computed_links = [];

            for ( let link of this.links ) {
                let _link = {...link};

                if ( _link.gate && !Gate.allows([_link.gate]) ) {
                    continue;
                }

                if ( _link.url ) {
                    _link.url = url_with_filters(_link.url);
                }

                if ( _link.children ) {
                    let _children = [];
                    for ( let child of _link.children ) {
                        let _child = {...child};
                        if ( _child.url ) {
                            _child.url = url_with_filters(_child.url);
                        }
                        _children.push(_child);
                    }
                    _link.children = _children;
                }

                computed_links.push(_link);
            }

            return computed_links;
        },
    },
    methods: {
        isSelected(link) {
            if ( link.url == this.$route.path ) {
                return true;
            }

            if ( link.children && link.children.length ) {
                for ( let child of link.children ) {
                    if ( child.url.replace(/\?[\s\S]+?$/, '') == this.$route.path ) {
                        return true;
                    }
                }
            }

            return false;
        },

        goTo(url) {
            this.$router.push(url);

            for ( let children of this.$refs.children ) {
                children.classList.add('click-through');

                setTimeout(() => {
                    children.classList.remove('click-through');
                }, 50);
            }
        },

        showSubmenu(i) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                for ( let link of this.$refs.links ) {
                    if ( link.$el ) {
                        link.$el.classList.remove('hover');
                    }
                    else {
                        link.classList.remove('hover');
                    }
                }

                this.$refs.links[i].classList.add('hover');
            }, 150);
        },

        hideSubmenu(i) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.$refs.links[i].classList.remove('hover');
            }, 150);
        },

        getLinkClass(link) {
            let css_class = '';

            if ( this.isSelected(link) ) {
                css_class += 'sidebar__link--selected active';
            }

            return css_class;
        },
    },
}
</script>

<template>
<aside class="sidebar">
    <div class="sidebar__logo"><img src="/images/logo.png" /></div>

    <template v-for="(link, i) in computed_links">
        <div :key="`${i}_with_children`"
            class="sidebar__link sidebar__link--with-children"
            :class="getLinkClass(link)"
            @mouseover="showSubmenu(i)"
            @mouseout="hideSubmenu(i)"
            ref="links"
             v-if="link.children && link.children.length"
        >
            <router-link :to="link.url">
                <sprite :id="link.icon" v-if="link.icon" /> {{ link.name }}
            </router-link>
            <div class="sidebar__link-children" ref="children">
                <div>
                    <a :href="child.url" @click.prevent="goTo(child.url)" v-for="child in link.children" :key="child.url">
                        <sprite :id="child.icon" v-if="child.icon" />
                        {{ child.name }}
                    </a>
                </div>
            </div>
        </div>

        <router-link :key="i" :to="link.url"
            class="sidebar__link"
            :class="link.url.replace(/\?.*$/, '') == $route.path ? 'active' : ''"
            ref="links"
             v-else-if="link.url"
        >
            <sprite :id="link.icon" v-if="link.icon" /> {{ link.name }}
        </router-link>

        <div class="sidebar__label" :key="`${i}_label`"
            ref="links"
            v-else
        >
            <sprite :id="link.icon" v-if="link.icon" /> {{ link.name }}
        </div>
    </template>
</aside>
</template>
