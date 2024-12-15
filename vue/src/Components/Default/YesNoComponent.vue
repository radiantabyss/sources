<script>
export default {
    name: 'YesNoComponent',
    props: {
        value: {
            type: [Boolean, Number, String],
            required: true,
        },
        yes_green: {
            type: Boolean,
            required: false,
            default: false,
        },
        no_red: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    computed: {
        yes() {
            if ( typeof this.value == 'string' && this.value !== '0' ) {
                return true;
            }

            if ( typeof this.value == 'number' && this.value != 0 ) {
                return true;
            }

            if ( typeof this.value == 'boolean' ) {
                return this.value;
            }

            return false;
        },

        css_class() {
            if ( this.yes && this.yes_green ) {
                return 'color-green';
            }

            if ( !this.yes && this.no_red ) {
                return 'color-red';
            }

            return '';
        },
    },
}
</script>

<template>
<span class="yes-no" :class="css_class">
    {{ yes ? __('Yes') : __('No') }}
</span>
</template>
