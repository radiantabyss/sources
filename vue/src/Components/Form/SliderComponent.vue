<script>
export default {
    name: 'SliderComponent',
    props: {
        modelValue: {
            type: [String, Number],
            required: false,
            default: '',
        },
        values: {
            type: [Array, Object],
            required: true,
        },
        texts: {
            type: Array,
            required: false,
        },
        value_key: {
            type: String,
            required: false,
            default: 'value',
        },
        text_key: {
            type: String,
            required: false,
            default: 'text',
        },
        debounce_timeout: {
            type: Number,
            required: false,
            defualt: 200,
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            value: '',
            timeout: null,
        }
    },
    computed: {
        slider_data() {
            let slider_data = [];
            if ( Array.isArray(this.modelValues) && this.texts ) {
                for ( let i = 0; i < this.modelValues.length; i++ ) {
                    let entry = {};
                    entry[this.modelValue_key] = this.modelValues[i];
                    entry[this.text_key] = this.texts[i];
                    slider_data.push(entry);
                }

                return slider_data;
            }

            return this.modelValues;
        },

        current_text() {
            if ( Array.isArray(this.modelValues) && !this.texts ) {
                return this.value;
            }

            return Items.findByKey(this.slider_data, 'value', this.value, true).text;
        },
    },
    methods: {
        mount() {
            this.value = this.modelValue || this.modelValues[0];
        },

        change() {
            if ( this.timeout ) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            this.timeout = setTimeout(() => {
                this.$emit('update:modelValue', this.value);
            }, this.debounce_timeout);
        },

        parseNumber(number) {
            if ( number === undefined ) {
                return null;
            }

            return parseFloat((number+'').replace(/,/g, '').replace(/%/g, ''));
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
<div class="slider">
    <div class="slider__value">{{ current_text }}</div>
    <div class="slider__slider">
        <vue-slider
            ref="slider"
            dotSize="15"
            v-model="value"
            :dragOnClick="true"
            :duration="0"
            tooltip="none"
            :data="slider_data"
            :data-value="value_key"
            :data-label="text_key"
            @change="change"
        />
    </div>
</div>
</template>
