<script>
import { h } from 'vue';

export default {
    name: 'TComponent',
    render() {
        const slot_nodes = this.$slots.default?.();

        if (!slot_nodes) {
            return null; // Return nothing if no slots
        }

        const slot_text = slot_nodes
            .map(node => node.children)
            .join('')
            .trim();

        return slot_text ? __(slot_text) : null; // Return the processed slot text
    },
};
</script>
