<script setup lang="ts">
import { ref } from 'vue'
import { TradeMeta } from '../App.vue'

defineProps<{ tradeMeta: TradeMeta }>()

const count = ref(0)
</script>

<template>
  <h1>{{ tradeMeta.mode }}</h1>
</template>

<style scoped>
</style>
