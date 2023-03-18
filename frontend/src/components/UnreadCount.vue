<template>
  <el-tooltip v-if="count" class="box-item" effect="dark" content="New messages count" placement="top-start">
    <div class="counter">{{ count > 9 ? '9+' : count }}</div>
  </el-tooltip>
</template>

<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    required: true,
  }
})
</script>