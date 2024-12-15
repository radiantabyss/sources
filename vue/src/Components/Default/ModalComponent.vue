<script>
export default {
    name: 'ModalComponent',
    props: {
        name: {
            type: String,
            required: true,
        },
        click_to_close: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    data() {
        return {
            is_visible: false,
        }
    },
    methods: {
        show(e) {
            if ( e.detail.name != this.name ) {
                return;
            }
            
            this.is_visible = true;
            this.$emit('before-open', e.detail);
        },

        hide(e) {
            if ( e.detail.name != this.name ) {
                return;
            }

            this.is_visible = false;
            this.$emit('before-close');
        },

        mousedown(e) {
            if ( !this.$el.classList.contains('visible') || this.$el.contains(e.target) || !this.click_to_close ) {
                return;
            }

            this.hide({
                detail: {
                    name: this.name,
                }
            });
        },
    },
    mounted() {
        window.addEventListener('modal-show', this.show);
        window.addEventListener('modal-hide', this.hide);
        window.addEventListener('mousedown', this.mousedown);
    },
    beforeDestroy() {
        window.removeEventListener('modal-show', this.show);
        window.removeEventListener('modal-hide', this.hide);
        window.removeEventListener('mousedown', this.mousedown);
    },
}
</script>

<template>
<div class="inline-modal" :class="is_visible ? 'visible' : ''">
    <slot />
</div>
</template>
