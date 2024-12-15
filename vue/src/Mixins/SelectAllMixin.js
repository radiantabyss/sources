export default {
    data() {
        return {
            selected: [],
            select_all: false,
        }
    },
    methods: {
        select() {
            this.select_all = this.selected.length == this.items.length;
        },

        selectAll() {
            this.selected = this.select_all ? Items.pluck(this.items) : [];
        },
    },
}
