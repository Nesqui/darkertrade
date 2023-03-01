<script setup lang="ts">
import { computed, ref } from 'vue'
import { TradeMeta } from '../App.vue'
import { User } from '../hooks'
import { useUserStore } from '../store'

const userStore = useUserStore()
const isAuth = computed(() => userStore.isAuth)
</script>

<template>
  <div class="top-menu">
    <div v-if="isAuth" class="top-menu__item">
      <el-button link @click="$router.push('/market')">Public Items (Browse)</el-button>
    </div>
    <div v-if="isAuth" class="top-menu__item">
      <el-button link @click="$router.push('/creator')">Item creator</el-button>
    </div>
    <div v-if="isAuth" class="top-menu__item">
      <el-button link @click="$router.push(`/user/${userStore.currentUser.nickname}/items`)">My items</el-button>
    </div>
    <div v-if="isAuth" class="top-menu__item">
      <el-button link @click="userStore.logout">Logout</el-button>
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
