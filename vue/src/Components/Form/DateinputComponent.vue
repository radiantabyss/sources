<script>
export default {
    name: 'DateinputComponent',
    props: {
        modelValue: {
            type: [String, Object],
            required: false,
            default: '',
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            fields: {
                day: '',
                month: '',
                year: '',
            },
        }
    },
    methods: {
        mount() {
            if ( typeof this.modelValue == 'object' ) {
                this.fields = { ...this.modelValue };
            }
            else if ( this.modelValue.match(/\d{4}-\d{2}-\d{2}/) ) {
                let split = this.modelValue.split('-');
                this.fields = {
                    day: split[2],
                    month: split[1],
                    year: split[0],
                };
            }
            else if ( this.modelValue.match(/\d{2}-\d{2}-\d{4}/) ) {
                let split = this.modelValue.split('-');
                this.fields = {
                    day: split[0],
                    month: split[1],
                    year: split[2],
                };
            }
        },

        keyup(e) {
            let inputs = [
                'day', 'month', 'year',
            ];

            for ( let i = 0; i < inputs.length; i++ ) {
                if ( e.target == this.$refs[inputs[i]]
                        && i < inputs.length - 1
                        && event.target.value.length === event.target.maxLength
                ) {
                    this.$refs[inputs[i + 1]].focus();
                }
            }

            this.$emit('update:modelValue', `${this.fields.year}-${this.fields.month}-${this.fields.day}`);
        },
    },
    mounted() {
        this.mount();
    },
    watch: {
        modelValue() {
            this.mount();
        }
    },
}
</script>

<template>
<div class="input-group">
    <input ref="day" type="text" class="input" placeholder="DD"
        pattern="\d*"
        maxlength="2"
        v-model="fields.day"
        @input="keyup"
    />

    <input ref="month" type="text" class="input" placeholder="MM"
        pattern="\d*"
        maxlength="2"
        v-model="fields.month"
        @input="keyup"
    />

    <input ref="year" type="text" class="input" placeholder="YYYY"
        pattern="\d*"
        maxlength="4"
        v-model="fields.year"
        @input="keyup"
    />
</div>
</template>
