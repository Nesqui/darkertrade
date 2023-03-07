<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../store'

const userStore = useUserStore()
const isAuth = computed(() => userStore.isAuth)
const router = useRouter()
const route = useRoute()
const push = async (url: string) => {
  let redirect = false
  if (route.path === url) {
    redirect = true
  }
  await router.push({
    path: url,
  })
  if (redirect)
    router.go(0)
}
</script>

<template>
  <div class="menu">
    <div class="logo" @click="push('/')">
      <img src="../assets/logo.png" alt="">
    </div>
    <div v-if="isAuth" class="top-menu">
      <div class="top-menu__item">
        <el-button link @click="() => push('/market')">Public Items (Browse)</el-button>
      </div>
      <div class="top-menu__item">
        <el-button link @click="() => push('/creator')">Item creator</el-button>
      </div>
      <div class="top-menu__item">
        <el-button link @click="() => push(`/user/${userStore.currentUser.nickname}/items`)">My items</el-button>
      </div>
    </div>
    <div v-if="isAuth" class="top-menu">
      <div class="top-menu__item">
        <el-button link @click="userStore.logout">Logout</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$menuHeight: 50px;
$padding: 25px;

.menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--el-border-color);

  width: 100%;
  height: $menuHeight;

  .logo {
    padding-left: $padding;
    cursor: pointer;

    >img {
      height: calc($menuHeight - 15px);
    }
  }

  .top-menu {
    display: flex;
    justify-content: center;
    align-items: center;

    &__item {
      padding: 0 25px;
    }

    &__item:not(:last-child) {
      border-right: 1px solid var(--el-border-color);
    }
  }
}
</style>
