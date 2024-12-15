<script>
export default {
    name: 'MiniburgerComponent',
    props: {
        sprite: {
            type: String,
            required: false,
            default: '',
        }
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        hide() {
            this.show = false;
        },
    },
}
</script>

<template>
<div class="miniburger">
    <a @click="show = !show" :class="!sprite ? 'icon-dots' : ''" ref="trigger">
        <sprite :id="sprite" v-if="sprite" />
        <i v-else></i>
    </a>

    <transition name="simple-fade">
        <div v-show="show" v-closable="{ handler: 'hide', exclude: ['trigger'] }">
            <slot />
        </div>
    </transition>
</div>
</template>
