<script>
export default {
    name: 'GateComponent',
}
</script>

<template>
<template v-if="Gate.allows(Object.keys(this.$attrs)[0], this.$attrs[Object.keys(this.$attrs)[0]])">
    <slot />
</template>
</template>
