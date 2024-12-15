<script>
import { Container, Draggable } from "vue3-smooth-dnd";

export default {
    name: 'RepeatableComponent',
    props: {
        modelValue: {
            type: Array,
            required: false,
            default: () => {
                return [];
            },
        },
        inputs: {
            type: Object,
            required: true,
        },
        name: {
            type: String,
            required: false,
            default: '',
        },
        show_labels: {
            type: Boolean,
            required: false,
            default: false,
        },
        show_numbers: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    components: { Container, Draggable },
    data() {
        return {
            items: this.modelValue || [],
        }
    },
    methods: {
        add() {
            let item = {};
            for ( let input_name in this.inputs )  {
                let input = this.inputs[input_name];

                if ( input.type == 'select' ) {
                    let options = input.options_are_grouped ? input.options[Object.keys(input.options)[0]] : input.options;
                    item[input_name] = input.options_have_text ? Object.keys(options)[0] : options[0];
                }
                else {
                    item[input_name] = '';
                }
            }

            this.items.push(item);
        },

        remove(i) {
            this.items.splice(i, 1);
        },

        removeAll() {
            this.items = [];
        },

        sort(e) {
            this.items = Items.sort(this.items, e.removedIndex, e.addedIndex);
        },

        //hack for draggable bug
        setSelected(input_name, i, e) {
            setTimeout(() => {
                for ( let option of e.target.querySelectorAll(`option`) ) {
                    option.value == this.items[i][input_name] ? option.setAttribute('selected', 'selected') : option.removeAttribute('selected');
                }
            }, 10);
        },
    },
    mounted() {
        //hack for draggable bug
        for ( let i = 0; i < this.items.length; i++ ) {
            for ( let input_name in this.inputs ) {
                if ( this.inputs[input_name].type != 'select' ) {
                    continue;
                }

                for ( let select of this.$refs[`select_${i}`] ) {
                    this.setSelected(input_name, i, {
                        target: select
                    });
                }
            }
        }
    },
    watch: {
        items() {
            this.$emit('update:modelValue', this.items);
        }
    },
}
</script>

<template>
<div>
    <div class="grid" v-if="show_labels && items && items.length">
        <div v-for="(input, input_name) in inputs" :key="input_name">
            <div :class="input.input_css_class ? input.input_css_class : ''">{{ Str.ucwords(input_name) }}</div>
        </div>
        <div></div>
    </div>

    <Container @drop="sort" drag-handle-selector=".handle" v-if="items && items.length">
        <Draggable v-for="(item, i) in items" :key="i">
            <div class="grid items-center mb-10">
                <div class="col-5 font-12" v-if="show_numbers">{{ i + 1 }}. </div>
                <div v-for="(input, input_name) in inputs" :key="input_name" :class="input.css_class">
                    <input type="text" class="input"
                        :class="input.input_css_class ? input.input_css_class : ''"
                        :key="`${input_name}_input`"
                        :placeholder="input.placeholder"
                        v-model="item[input_name]"
                        v-if="input.type == 'text'"
                    />

                    <textarea type="text" class="input"
                        :class="input.input_css_class ? input.input_css_class : ''"
                        :key="`${input_name}_input`"
                        :placeholder="input.placeholder"
                        v-model="item[input_name]"
                        v-if="input.type == 'textarea'"
                    ></textarea>

                    <select class="input"
                        :class="input.input_css_class ? input.input_css_class : ''"
                        :key="`${input_name}_select`"
                        :ref="`select_${i}`"
                        v-model="item[input_name]"
                        @input="setSelected(input_name, i, $event)"
                        v-else-if="input.type == 'select'"
                    >
                        <template v-if="input.options_are_grouped">
                            <optgroup v-for="(options, group) in input.options" :key="group" :label="Str.ucwords(group)">
                                <option v-for="(text, value) in options" :key="value" :value="input.options_have_text ? value : text">
                                    {{ input.options_have_text ? text : Str.ucwords(text) }}
                                </option>
                            </optgroup>
                        </template>
                        <template v-else>
                            <option v-for="(text, value) in input.options"
                                :key="value"
                                :value="input.options_have_text ? value : text"
                            >
                                {{ input.options_have_text ? text : Str.ucwords(text) }}
                            </option>
                        </template>
                    </select>

                    <autocomplete :key="`${input_name}_autocomplete`"
                        :class="input.input_css_class ? input.input_css_class : ''"
                        :text="value[i][input.text_key]"
                        :domain="input.autocomplete_settings.domain"
                        :url="input.autocomplete_settings.url || ''"
                        :limit="input.autocomplete_settings.limit || 20"
                        :search_params="input.autocomplete_settings.search_params || {}"
                        :placeholder="input.autocomplete_settings.placeholder || ''"
                        :autosearch="input.autocomplete_settings.autosearch || false"
                        :autosearch_limit="input.autocomplete_settings.autosearch_limit || 10"
                        :enable_modal="input.autocomplete_settings.enable_modal || false"
                        :can_create="input.autocomplete_settings.can_create || false"
                        v-model="item[input_name]"
                        v-if="input.type == 'autocomplete'"
                    />
                </div>

                <div class="col-5">
                    <a class="icon-link-small handle"><sprite id="move" class="color-text" /></a>
                </div>
                <div class="col-5">
                    <a @click="remove(i)" class="icon-link-small"><sprite id="trash" class="color-red" /></a>
                </div>
            </div>
        </Draggable>
    </Container>

    <a @click="add" class="btn btn--auto btn--small mt-10"><sprite id="plus"/> <t>Add </t>{{ name }}</a>
</div>
</template>
