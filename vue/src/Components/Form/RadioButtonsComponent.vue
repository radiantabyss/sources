<script>
export default {
    name: 'RadioButtonsComponent',
    props: {
        modelValue: {
            type: String,
            required: false,
            default: '',
        },
        options: {
            type: [Array, Object],
            required: true,
        },
        full: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            selected: '',
            is_object: !Array.isArray(this.options),
        }
    },
    methods: {
        mount() {
            this.selected = this.modelValue;

            if ( this.selected === '' ) {
                this.select(Array.isArray(this.options) ? this.options[0] : Object.keys(this.options)[0]);
            }
        },

        select(value) {
            this.selected = value;
            this.$emit('update:modelValue', value);
        }
    },
    mounted() {
        this.mount();
    },
    watch: {
        modelValue() {
            this.mount();
        },
    },
}
</script>

<template>
<div class="radio-buttons" :class="full ? `grid-${options.length}` : ''">
    <a class="btn btn--small btn--auto"
        v-for="(text, value) in options"
        :key="value"
        :class="selected === (is_object ? value : text) ? '' : 'btn--outline'"
        @click="select(is_object ? value : text)"
    >
        {{ is_object ? text : Str.ucwords(text) }}
    </a>
</div>
</template>
