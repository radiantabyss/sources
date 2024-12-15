<script>
export default {
    name: 'PasswordComponent',
    props: {
        modelValue: {
            type: [String, Number],
            required: false,
            default: '',
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            value: '',
            show: false,
        }
    },
    methods: {
        mount() {
            this.value = this.modelValue;

            for ( let css_class of this.$el.classList ) {
                if ( ['password'].includes(css_class) ) {
                    continue;
                }

                this.$el.getElementsByTagName('input')[0].classList.add(css_class);
            }

            this.$el.className = `password`;
        },

        handleInput() {
            this.$emit('update:modelValue', this.$refs.input.value);
        },

        toggle() {
            this.show = !this.show;
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
<div class="password">
    <input :type="show ? 'text' : 'password'"
        class="input"
        name="password"
        v-model="value"
        @input="$emit('update:modelValue', value)"
    />
    <a @click="toggle"><sprite :id="show ? 'eye-crossed' : 'eye'" /></a>
</div>
</template>
