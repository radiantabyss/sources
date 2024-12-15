<script>
export default {
    name: 'SpriteComponent',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        let version = import.meta.env.VITE_SPRITE_VERSION;

        if ( is_dev ) {
            const now = new Date();
            const rounded_seconds = Math.round(now.getSeconds() / 3) * 3;
            now.setSeconds(rounded_seconds, 0);
            version = Math.floor(now.getTime() / 1000);
        }

        return {
            version,
        }
    },
}
</script>

<template>
<svg :class="`svg-${id}`">
    <use :xlink:href="`/sprites.svg?v=${version}#${id}`"></use>
</svg>
</template>
