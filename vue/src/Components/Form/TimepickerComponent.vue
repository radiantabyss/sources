<script>
export default {
    props: {
        modelValue: {
            type: String,
            required: false,
            default: '',
        },
        placeholder: {
            type: String,
            required: false,
            default: '',
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            hour: 0,
            minute: 0,
            view: 'none',
        }
    },
    computed: {
        value() {
            return `${Str.leading_zero(this.hour)}:${Str.leading_zero(this.minute)}`;
        },
    },
    methods: {
        show(view) {
            this.view = view;
        },

        hide() {
            this.view = 'none';
        },

        select(component, i) {
            this[component] = i;
            this.view = 'time';
            this.$emit('update:modelValue', this.value);
        },

        changeComponent(component, direction) {
            let value = this[component] + (direction == 'increment' ? 1 : -1);
            let max = component == 'hour' ? 23 : 59;

            if ( direction == 'increment' && value > max ) {
                value = 0;
            }
            else if ( direction == 'decrement' && value < 0 ) {
                value = max;
            }

            this[component] = value;

            this.$emit('update:modelValue', this.value);
        },
    },
    mounted() {
        let date = new Date();
        let split = this.modelValue.split(':');
        this.hour = isNaN(parseFloat(split[0])) ? date.getHours() : parseFloat(split[0]);
        this.minute = isNaN(parseFloat(split[1])) ? date.getMinutes() : parseFloat(split[1]);
        this.$emit('update:modelValue', this.value);

        for ( let css_class of this.$el.classList ) {
            if ( ['timepicker'].includes(css_class) ) {
                continue;
            }

            this.$refs.input.classList.add(css_class);
        }

        this.$el.className = `timepicker`;
    }
}
</script>

<template>
<div class="timepicker" @keydown.esc="hide">
    <input type="text" :placeholder="placeholder" autocomplete="off" readonly
        @click="show('time')" ref="input" :value="value"
    />

    <div class="timepicker__time" ref="time"
        v-show="view == 'time'"
        v-closable="{exclude:['input', 'time', 'hour', 'minute'], handler: 'hide'}"
    >
        <div class="timepicker__time-hour">
            <a @click="changeComponent('hour', 'increment')"><sprite id="caret-up" /></a>
            <a @click="show('hour')">{{ Str.leading_zero(hour) }}</a>
            <a @click="changeComponent('hour', 'decrement')"><sprite id="caret-down" /></a>
        </div>
        <div class="timepicker__time-minute">
            <a @click="changeComponent('minute', 'increment')"><sprite id="caret-up" /></a>
            <a @click="show('minute')">{{ Str.leading_zero(minute) }}</a>
            <a @click="changeComponent('minute', 'decrement')"><sprite id="caret-down" /></a>
        </div>
    </div>

    <div class="numberpicker numberpicker--hour">
        <ul :class="view == 'hour' ? 'visible' : ''"
            ref="hour"
            v-closable="{exclude:['input', 'time', 'hour', 'minute'], handler: 'hide'}"
        >
            <li v-for="i in range(0, 23)" :key="i" @click="select('hour', i)" :class="i == hour ? 'selected' : ''">
                {{ Str.leading_zero(i) }}
            </li>
        </ul>
    </div>

    <div class="numberpicker numberpicker--minute">
        <ul :class="view == 'minute' ? 'visible' : ''"
            ref="minute"
            v-closable="{exclude:['input', 'time', 'hour', 'minute'], handler: 'hide'}"
        >
            <li v-for="i in range(0, 59)" :key="i"
                :class="i == minute ? 'selected' : ''"
                @click="select('minute', i)"
            >
                {{ Str.leading_zero(i) }}
            </li>
        </ul>
    </div>
</div>
</template>
