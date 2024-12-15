<script>
export default {
    name: 'RangeSliderComponent',
    props: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        modelValue: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },
        is_percetage: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    emits: ['change'],
    data() {
        return {
            value: [],
            timeout: null,
        }
    },
    computed: {
        value_min: {
            get() {
                let value_min = this.value[0];
                if ( value_min < this.min ) {
                    value_min = this.min;
                }

                if ( this.is_percetage ) {
                    value_min = Str.to_percetange(value_min);
                }
                else {
                    value_min = Str.add_commas(value_min);
                }

                return value_min;
            },
            set(value) {
                this.$refs.slider.setValue([parseFloat(value), this.parseNumber(this.value[1])]);
            },
        },
        value_max: {
            get() {
                let value_max = this.value[1];
                if ( value_max > this.max ) {
                    value_max = this.max;
                }

                if ( this.is_percetage ) {
                    value_max = Str.to_percetange(value_max);
                }
                else {
                    value_max = Str.add_commas(value_max);
                }

                return value_max;
            },
            set(value) {
                this.$refs.slider.setValue([this.parseNumber(this.value[0]), parseFloat(value)]);
            },
        },
    },
    methods: {
        change() {
            if ( this.timeout ) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            this.timeout = setTimeout(() => {
                this.$emit('change', this.value);
            }, 200);
        },

        parseNumber(number) {
            if ( number === undefined ) {
                return null;
            }

            return parseFloat((number+'').replace(/,/g, '').replace(/%/g, ''));
        },
    },
    mounted() {
        this.value = [...this.modelValue];

        if ( this.value[0] === undefined ) {
            this.value[0] = this.min;
        }

        if ( this.value[1] === undefined ) {
            this.value[1] = this.max;
        }
    }
}
</script>

<template>
<div class="slider">
    <div class="slider__slider">
        <vue-slider
            ref="slider"
            dotSize="15"
            v-model="value"
            :dragOnClick="true"
            :duration="0"
            tooltip="none"
            :min="min"
            :max="max"
            @change="change"
        />
    </div>
    <div class="slider__values">
        <input type="text" v-model="value_min" class="input input--small" />
        <input type="text" v-model="value_max" class="input input--small" />
    </div>
</div>
</template>
