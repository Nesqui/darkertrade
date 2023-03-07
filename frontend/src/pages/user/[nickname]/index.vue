<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()
router.push(`/user/${route.params.nickname}/items`)
</script>

<template>
  <div></div>
</template>


<style>

</style>