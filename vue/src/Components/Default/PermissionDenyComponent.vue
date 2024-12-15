<script>
export default {
    name: 'PermissionDenyComponent',
}
</script>

<template>
<template v-if="Gate.denies('permission', this.$attrs)">
    <slot />
</template>
</template>
