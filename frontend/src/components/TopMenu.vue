<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useUserStore } from '../store'

const windowWidth = ref(400)
const userStore = useUserStore()
const isAuth = computed(() => userStore.isAuth)
const activeIndex = ref('/')
const route = useRoute()
const router = useRouter()

const onResize = () => {
  nextTick(() => {
    windowWidth.value = window.innerWidth
  })
}

onMounted(() => {
  window.addEventListener('resize', onResize);
  onResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
})

const openBlank = async (url: string) => {
  if (url && isAuth.value) {
    window.open(url, '_blank')
  }
}
const changeUrl = (url: string) => {
  window.open(url, '_blank')
}
const select = async (url: string) => {
  if (route.path !== url)
    return
  await router.push({
    path: '/redirect'
  })
  await router.push({
    path: url
  })
}
</script>

<template>
  <div class="menu">
    <el-menu router="true" @select="select" :unique-opened="true" menu-trigger="click" :ellipsis="windowWidth < 1200"
      :default-active="activeIndex" mode="horizontal">
      <el-menu-item @click.middle="() => openBlank('/')" index="/">
        <div class="logo">
          <img src="../assets/logo.png" alt="">
        </div>
      </el-menu-item>
      <div class="flex-grow" />
      <el-menu-item @click.middle="() => openBlank('/admin')" index="/admin"
        v-if="userStore.currentUser.isAdmin">Admin</el-menu-item>
      <el-menu-item @click.middle="() => openBlank('/market')" index="/market">Browse offers</el-menu-item>
      <el-menu-item @click.middle="() => openBlank('/creator')" :disabled="!isAuth" index="/creator">Create
        offer</el-menu-item>
      <el-menu-item @click.middle="() => openBlank(`/user/${userStore.currentUser.nickname}/items`)" :disabled="!isAuth"
        :index="`/user/${userStore.currentUser.nickname}/items`">My items</el-menu-item>
      <el-menu-item @click.middle="() => openBlank('/bids/')" :disabled="!isAuth" index="/bids/">My bids</el-menu-item>
      <el-menu-item @click.middle="() => openBlank('/faq')" index="/faq">How's it works?</el-menu-item>
      <el-menu-item @click.middle="() => changeUrl('https://discord.gg/VT6grnfD6t')"
        @click="changeUrl('https://discord.gg/VT6grnfD6t')" index="">Discord</el-menu-item>
      <div class="flex-grow" />
      <el-menu-item :disabled="!isAuth" @click.middle="() => openBlank(`/user/${userStore.currentUser.nickname}/items`)"
        :index="`/user/${userStore.currentUser.nickname}/items`">
        {{ userStore.currentUser.nickname }}
      </el-menu-item>
      <el-menu-item v-if="isAuth" @click="userStore.logout" index="/">Logout</el-menu-item>
      <el-menu-item v-else index="/auth">Sign In</el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
$menuHeight: 50px;
$menuMobileHeight: 30px;

.menu {
  // display: flex;
  // align-items: center;
  // background-color: transparent;
  // width: 100%;
  height: var(--menu-height);

  .logo {
    cursor: pointer;
    min-width: 209px;

    >img {
      height: calc(var(--menu-height) - 15px);
    }
  }


  .logout,
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logout {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: end;
  }

}

@media (max-width:420px) {

  .menu {
    height: var(--menu-mobile-height);

    .el-menu {
      padding: .9rem 0;
    }

    .logo {
      img {
        height: var(--menu-mobile-height);
      }
    }
  }
}
</style>

<style lang="scss">
.el-menu--horizontal {
  align-items: center;
}

.el-menu-item {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

}
</style>