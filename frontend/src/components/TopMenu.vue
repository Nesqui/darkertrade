<script setup lang="ts">
import { ref } from 'vue'
import { TradeMeta } from '../App.vue'

</script>

<template>
  <div class="top-menu">
    <div class="top-menu__item">
      <el-button link @click="$router.push('wtb')">Want to buy</el-button>
    </div>
    <div class="top-menu__item">
      <el-button link @click="$router.push('wts')">Want to sell</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.top-menu {
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);

  &__item {
    padding: 0 25px;
  }

  &__item:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
  }
}
</style>
