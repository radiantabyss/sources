<script>
export default {
    props: {
        modelValue: {
            type: [Boolean, Number, String],
            required: false,
            default: false,
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    emits: ['update:modelValue', 'change'],
    data() {
        return {
            checked: null,
        }
    },
    methods: {
        mount() {
            let checked = this.modelValue ? true : false;
            if ( this.modelValue === '0' ) {
                checked = false;
            }

            this.checked = checked;
        },

        change() {
            this.$emit('update:modelValue', this.checked ? 1 : 0);
            this.$emit('change', this.checked ? 1 : 0);
        },
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
<label class="toggle" :class="disabled ? 'disabled' : ''" v-if="checked !== null">
    <input type="checkbox" ref="input" v-model="checked" @change="change">
    <span></span>
</label>
</template>
