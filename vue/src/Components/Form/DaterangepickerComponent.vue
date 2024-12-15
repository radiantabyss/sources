<script>
export default {
    name: 'DaterangepickerComponent',
    props: {
        modelValue: {
            type: [String, Number],
            required: false,
            default: '',
        },
    },
    emits: ['update:modelValue', 'submit'],
    data() {
        return {
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
            is_selecting: false,
            hovered: null,
            selection: null,
        }
    },
    computed: {
        years_months() {
            let start_year = this.year;
            let start_month = this.month;
            let end_year = start_year;
            let end_month = start_month + 1;

            if ( end_month > 11 ) {
                end_month = 0;
                end_year++;
            }

            return [
                { year: start_year, month: start_month },
                { year: end_year, month: end_month },
            ];
        },
    },
    methods: {
        mount() {
            this.value = this.modelValue;

            if ( this.value ) {
                let value_split = this.value.split(':');
                let start_date = new Date(value_split[0]);
                let end_date = new Date(value_split[1]);

                this.selection = [
                    {
                        day: start_date.getMonth(),
                        is_current_month: start_date.getMonth() == new Date().getMonth(),
                        date: value_split[0],
                    },
                    {
                        day: end_date.getMonth(),
                        is_current_month: end_date.getMonth() == new Date().getMonth(),
                        date: value_split[1],
                    },
                ];
                this.year = start_date.getFullYear();
                this.month = start_date.getMonth();
            }
            else {
                this.year = new Date().getFullYear();
                this.month = new Date().getMonth();
            }
        },

        getDaysGroupedByWeek(year, month) {
            let first_day_of_week = new Date(year, month, 0).getDay();
            let days_in_month = new Date(year, month + 1, 0).getDate();
            let days_in_last_month = new Date(year, month, 0).getDate();

            let days = [];
            for ( let i = 1; i <= days_in_month; i++ ) {
                days.push({
                    day: Str.leading_zero(i),
                    is_current_month: true,
                    date: Str.mysql_date(new Date(year, month, i)),
                });
            }

            //add previous month days
            for ( let i = 0; i < first_day_of_week; i++ ) {
                days.unshift({
                    day: days_in_last_month - i,
                    is_current_month: false,
                    date: Str.mysql_date(new Date(year, month - 1, days_in_last_month - i)),
                });
            }

            //add next month days
            let next_days = 7 - (days.length % 7);
            for ( let i = 1; i <= next_days; i++ ) {
                days.push({
                    day: Str.leading_zero(i),
                    is_current_month: false,
                    date: Str.mysql_date(new Date(year, month + 1, i)),
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
                    date: Str.mysql_date(new Date(year, month + 1, day)),
                });
            }

            //group days by week
            let days_grouped_by_week = [];
            for (let i = 0; i < days.length; i += 7) {
                days_grouped_by_week.push(days.slice(i, i + 7));
            }

            return days_grouped_by_week;
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
                css_class += ' daterangepicker__cell--other';
            }

            if ( day.date == Str.mysql_date(new Date()) ) {
                css_class += ' daterangepicker__cell--today';
            }

            if ( (this.selection && (day.date == this.selection[0].date || (this.selection.length == 2 && day.date == this.selection[1].date)))
                || (this.hovered && day.date == this.hovered.date)
            ) {
                css_class += ' daterangepicker__cell--selected';
            }

            //check if day is in range
            if ( (this.is_selecting && this.hovered) || (this.selection && this.selection.length == 2) ) {
                let date = new Date(day.date);
                let start = new Date(this.selection[0].date);
                let end = new Date(this.selection.length == 2 ? this.selection[1].date : this.hovered.date);

                // check if start is greater than end
                if ( start > end ) {
                    let temp = start;
                    start = end;
                    end = temp;
                }

                if ( date >= start && date < end ) {
                    css_class += ' daterangepicker__cell--in-range';
                }
            }

            return css_class;
        },

        select(day) {
            this.hovered = null;

            if ( this.is_selecting ) {
                this.is_selecting = false;
                this.selection.push(day);
            }
            else {
                this.is_selecting = true;
                this.selection = [day];
            }
        },

        hover(day) {
            if ( !this.is_selecting ) {
                return;
            }

            this.hovered = day;
        },

        submit() {
            this.watch = false;

            if ( !this.selection || this.selection.length != 2 ) {
                this.watch = true;
                return;
            }

            this.value = `${this.selection[0].date}:${this.selection[1].date}`;
            this.year = new Date(this.selection[0].date).getFullYear();
            this.month = new Date(this.selection[0].date).getMonth();

            this.$emit('update:modelValue', this.value);
            this.$emit('submit', this.value);

            this.watch = true;
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
<div class="daterangepicker" v-if="year">
    <a @click="changeMonth('prev')" class="daterangepicker__prev icon-link"><sprite id="arrow-left" /></a>
    <a @click="changeMonth('next')" class="daterangepicker__next icon-link"><sprite id="arrow-right" /></a>

    <div v-for="year_month in years_months" :key="`${year_month.year}_${year_month.month}`">
        <div class="daterangepicker__header">
            <div>
                {{ months_text[year_month.month] }}
                <template v-if="year_month.year != today.getFullYear()">
                    {{ year_month.year }}
                </template>
            </div>
        </div>

        <div class="daterangepicker__cells daterangepicker__weekdays">
            <div class="daterangepicker__cell" v-for="weekday in weekdays">{{ weekday }}</div>
        </div>

        <div class="daterangepicker__cells" v-for="(days, i) in getDaysGroupedByWeek(year_month.year, year_month.month)" :key="`days_${i}`">
            <a v-for="day in days" :key="day.date"
                class="daterangepicker__cell"
                :class="getCellClass(day)"
                @click="select(day)"
                @mouseover="hover(day)"
            >
                {{ day.day }}
            </a>
        </div>
    </div>

    <div class="daterangepicker__footer">
        <a @click="submit" class="btn btn--small btn--auto"><sprite id="success" class="relative top-1" /><t> Apply</t></a>
    </div>
</div>
</template>
