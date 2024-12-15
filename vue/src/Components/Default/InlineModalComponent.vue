<script>
export default {
    name: 'InlineModalComponent',
    methods: {
        hide() {
            this.$el.classList.remove('visible');
        },
        mousedown(e) {
            if ( !this.$el.classList.contains('visible') ) {
                return;
            }

            if ( !this.$el.contains(e.target) ) {
                this.hide();
            }
        },
    },
    mounted() {
        document.addEventListener('mousedown', this.mousedown);
    },
    beforeDestroy() {
        document.removeEventListener('mousedown', this.mousedown);
    },
}
</script>

<template>
<div class="inline-modal">
    <a @click="hide" class="inline-modal__close"><sprite id="x" class="small" /></a>
    <slot />
    <a @click="hide" class="btn btn--small btn--auto mt-20"><t>Close</t></a>
</div>
</template>
