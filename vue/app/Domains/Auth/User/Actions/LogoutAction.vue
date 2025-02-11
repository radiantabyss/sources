<script>
export default {
    mounted() {
        localStorage.removeItem('jwt_token');
        window.location.href = '/login';
    },
}
</script>

<template>
<div>

</div>
</template>
