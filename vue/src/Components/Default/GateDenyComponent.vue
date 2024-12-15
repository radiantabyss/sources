<script>
export default {
    name: 'GateDenyComponent',
}
</script>

<template>
<template v-if="Gate.denies(Object.keys(this.$attrs)[0], this.$attrs[Object.keys(this.$attrs)[0]])">
    <slot />
</template>
</template>
