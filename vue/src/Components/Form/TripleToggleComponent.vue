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
            name: Math.ceil(Math.random() * 10000),
            value: null,
        }
    },
    methods: {
        mount() {
            let value = this.modelValue;

            if ( this.modelValue === 1 || this.modelValue === '1' ) {
                value = 1;
            }
            else if ( this.modelValue === '0' || this.modelValue === 0 ) {
                value = 0;
            }
            else {
                value = '';
            }

            this.value = value;
        },

        click() {
            if ( this.value === null || this.value === '' ) {
                this.value = 1;
            }
            else if ( this.value === 1 || this.value === '1' ) {
                this.value = 0;
            }
            else {
                this.value = '';
            }

            this.$emit('update:modelValue', this.value);
            this.$emit('change', this.value);
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
<label class="triple-toggle" :class="disabled ? 'disabled' : ''" v-if="value !== null">
    <input type="radio" value="" :name="name" :checked="value === ''" @click="click">
    <input type="radio" value="1" :name="name" :checked="value === 1" @click="click">
    <input type="radio" value="0" :name="name" :checked="value === 0" @click="click">
    <span></span>
</label>
</template>
