<script>
export default {
    name: 'PermissionComponent',
}
</script>

<template>
<template v-if="Gate.allows('permission', this.$attrs)">
    <slot />
</template>
</template>
