<script>
export default {
    name: 'DatepickerComponent',
    props: {
        modelValue: {
            type: [String, Number],
            required: false,
            default: '',
        },
        inline: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            mounted: false,
            value: null,
            year: null,
            month: null,
            today: new Date(),
            months_text: [
                'January', 'February', 'March',
                'April', 'May', 'June',
                'July', 'August', 'September',
                'October', 'November', 'December',
            ],
            weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
            watch: true,
            show: this.inline,
            debounce_timeout: null,
            is_valid: true,
        }
    },
    computed: {
        days_grouped_by_week() {
            let first_day_of_week = new Date(this.year, this.month, 0).getDay();
            let days_in_month = new Date(this.year, this.month + 1, 0).getDate();
            let days_in_last_month = new Date(this.year, this.month, 0).getDate();

            let days = [];
            for ( let i = 1; i <= days_in_month; i++ ) {
                days.push({
                    day: Str.leading_zero(i),
                    is_current_month: true,
                    date: Str.mysql_date(new Date(this.year, this.month, i)),
                });
            }

            //add previous month days
            for ( let i = 0; i < first_day_of_week; i++ ) {
                days.unshift({
                    day: days_in_last_month - i,
                    is_current_month: false,
                    date: Str.mysql_date(new Date(this.year, this.month - 1, days_in_last_month - i)),
                });
            }

            //add next month days
            let next_days = 7 - (days.length % 7);
            for ( let i = 1; i <= next_days; i++ ) {
                days.push({
                    day: Str.leading_zero(i),
                    is_current_month: false,
                    date: Str.mysql_date(new Date(this.year, this.month + 1, i)),
                });
            }

            //add missing weeks so it's a total 6 weeks every month
            let weeks = days.length / 7;
            let last_day = days[days.length - 1];
            for ( let i = 1; i <= (6 - weeks) * 7; i++ ) {
                let day = parseInt(last_day.day) + i;
                days.push({
                    day: Str.leading_zero(day),
                    is_current_month: false,
                    date: Str.mysql_date(new Date(this.year, this.month + 1, day)),
                });
            }

            //group days by week
            let days_grouped_by_week = [];
            for (let i = 0; i < days.length; i += 7) {
                days_grouped_by_week.push(days.slice(i, i + 7));
            }

            return days_grouped_by_week;
        },

        text() {
            this.is_valid = true;

            let text = Str.prettify_date(this.value);
            if ( text == 'Invalid Date' ) {
                this.is_valid = false;
                return this.value;
            }

            return text;
        },
    },
    methods: {
        mount() {
            this.value = this.modelValue ? Str.mysql_date(Str.string_to_date(this.modelValue)) : Str.mysql_date();
            this.year = new Date(this.value).getFullYear();
            this.month = new Date(this.value).getMonth();
            this.mounted = true;
        },

        changeMonth(direction) {
            let month = this.month;
            let year = this.year;

            if ( direction == 'prev' ) {
                month--;

                if ( month < 0 ) {
                    month = 11;
                    year--;
                }
            }
            else {
                month++;

                if ( month > 11 ) {
                    month = 0;
                    year++;
                }
            }

            this.month = month;
            this.year = year;
        },

        getCellClass(day) {
            let css_class = '';

            if ( !day.is_current_month ) {
                css_class += ' datepicker__cell--other';
            }

            if ( day.date == Str.mysql_date(new Date()) ) {
                css_class += ' datepicker__cell--today';
            }

            if ( day.date == this.value ) {
                css_class += ' datepicker__cell--selected';
            }

            return css_class;
        },

        select(day) {
            this.watch = false;

            this.value = day.date;
            this.year = new Date(this.value).getFullYear();
            this.month = new Date(this.value).getMonth();

            if ( !this.inline ) {
                this.hide();
            }

            this.$emit('update:modelValue', day.date);

            this.watch = true;
        },

        parse() {
            clearTimeout(this.debounce_timeout);
            this.debounce_timeout = setTimeout(() => {
                this.$emit('update:modelValue', Str.mysql_date(Str.string_to_date(this.$refs.input.value)));
            }, 700);
        },

        hide() {
            this.show = false;
        },
    },
    mounted() {
        this.mount();
    },
    watch: {
        modelValue() {
            if ( !this.watch ) {
                return;
            }

            this.mount();
        },
    },
}
</script>

<template>
<div class="datepicker" v-if="mounted">
    <input class="datepicker__input input"
        :class="!is_valid ? 'datepicker__input--invalid' : ''"
        :value="text"
        @keyup="parse"
        @click="show = !show"
        ref="input"
    />

    <transition name="simple-fade">
        <div class="datepicker__content"
            :class="inline ? `datepicker__content--inline` : ''"
            v-show="show"
            v-closable="{ handler: 'hide', exclude: ['input'] }"
        >
            <div class="datepicker__header">
                <a @click="changeMonth('prev')" class="icon-link"><sprite id="arrow-left" /></a>
                <div>
                    {{ months_text[month] }}
                    <template v-if="year != today.getFullYear()">
                        {{ year }}
                    </template>
                </div>
                <a @click="changeMonth('next')" class="icon-link"><sprite id="arrow-right" /></a>
            </div>

            <div class="datepicker__cells datepicker__weekdays">
                <div class="datepicker__cell" v-for="weekday in weekdays">{{ weekday }}</div>
            </div>

            <div class="datepicker__cells" v-for="(days, i) in days_grouped_by_week" :key="`days_${i}`">
                <a v-for="day in days" :key="day.date"
                    class="datepicker__cell"
                    :class="getCellClass(day)"
                    @click="select(day)"
                >
                    {{ day.day }}
                </a>
            </div>
        </div>
    </transition>
</div>
</template>
