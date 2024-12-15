<script>
export default {
    name: 'EditLiveSelectComponent',
    props: {
        modelValue: {
            type: String,
            required: false,
        },
        options: {
            type: [Array, Object],
            required: true,
        },
        css_class: {
            type: String,
            required: false,
        },
    },
    emits: ['submit'],
    data() {
        return {
            is_visible: false,
            value: this.modelValue,
            input: this.modelValue,
        }
    },
    methods: {
        show() {
            this.is_visible = true;
            setTimeout(() => {
                this.$refs.input.focus();
            }, 0);
        },

        hide() {
            this.input = this.value;
            this.is_visible = false;
        },

        submit() {
            this.value = this.input;
            this.$emit('submit', this.input);
            this.hide();
        },
    },
    watch: {
        modelValue() {
            this.value = this.modelValue;
        },
    },
}
</script>

<template>
<div class="edit-live" :class="css_class" v-closable="{exclude:['edit'], handler: 'hide'}" @keydown.esc="hide">
    <span v-show="!is_visible" @click="show">{{ Array.isArray(options) ? value : options[value] }}</span>
    <a @click="show" v-show="!is_visible" ref="edit">
        <sprite id="edit" class="tiny" />
    </a>
    <form class="inline-flex items-center" v-show="is_visible">
        <select type="text" v-model="input" class="input edit-live__input" ref="input">
            <template v-if="Array.isArray(options)">
                <option v-for="option in options" :key="option" :value="option">
                    {{ option }}
                </option>
            </template>
            <template v-else>
                <option v-for="(option_text, option) in options" :key="option" :value="option">
                    {{ option_text }}
                </option>
            </template>
        </select>
        <button type="submit" @click.prevent="submit" class="btn-clear">
            <sprite id="check" class="tiny" />
        </button>
    </form>
</div>
</template>
