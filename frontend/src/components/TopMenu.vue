<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../store'
import NicknameOnline from './NicknameOnline.vue';

const windowWidth = ref(400)

const userStore = useUserStore()
const isAuth = computed(() => userStore.isAuth)
const router = useRouter()
const route = useRoute()
const activeIndex = ref('/')

const onResize = () => {
  nextTick(() => {
    windowWidth.value = window.innerWidth
  })
}

onMounted(() => {
  window.addEventListener('resize', onResize);
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
})

// const handleSelect = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
// const push = async (url: string, newWindow = false) => {
//   if (newWindow && url) {
//     window.open(url, '_blank')
//     return
//   }
//   let redirect = false
//   if (route.path === url) {
//     redirect = true
//   }
//   await router.push({
//     path: url,
//   })
//   if (redirect)
//     router.go(0)
// }
</script>

<template>
  <div class="menu">
    <el-menu router="true" :unique-opened="true" menu-trigger="click" :ellipsis="windowWidth < 1200"
      :default-active="activeIndex" mode="horizontal">
      <el-menu-item index="/">
        <div class="logo">
          <img src="../assets/logo.png" alt="">
        </div>
      </el-menu-item>
      <div class="flex-grow" />

      <el-menu-item index="/market">Browse offers</el-menu-item>
      <el-menu-item index="/creator">Create offer</el-menu-item>
      <el-menu-item :index="`/user/${userStore.currentUser.nickname}/items`">My items</el-menu-item>
      <el-menu-item index="/bids/">My bids</el-menu-item>
      <div class="flex-grow" />
      <el-menu-item :index="`/user/${userStore.currentUser.nickname}/items`">
        <div>
          <NicknameOnline :user="userStore.currentUser" />
        </div>
      </el-menu-item>
      <el-menu-item @click="userStore.logout" index="/">Logout</el-menu-item>
    </el-menu>

    <!-- <div class="top-menu">
        <div class="top-menu__item">
          <a link @click="() => push('/market')" @click.middle="() => push('/market', true)">Browse offers</a>
        </div>
        <div class="top-menu__item">
          <a link @click="() => push('/creator')" @click.middle="() => push('/creator', true)">Create offer</a>
        </div>
        <div class="top-menu__item">
          <a link @click="() => push(`/user/${userStore.currentUser.nickname}/items`)"
            @click.middle="() => push(`/user/${userStore.currentUser.nickname}/items`, true)">My items</a>
        </div>
        <div class="top-menu__item">
          <a link @click="() => push(`/bids/`)" @click.middle="() => push(`/bids/`, true)">My bids</a>
        </div>
      </div>
      <div v-if="isAuth" class="logout">
        <div class="top-menu__item">
          <a link @click="push(`/user/${userStore.currentUser.nickname}/items`)"
            @click.middle="() => push(`/user/${userStore.currentUser.nickname}/items`, true)">{{
              userStore.currentUser.nickname }}</a>
        </div>
        <div class="top-menu__item">
          <a link @click="userStore.logout">Logout</a>
        </div>
      </div> -->
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

  .logo {
    cursor: pointer;
    min-width: 209px;

    >img {
      height: calc($menuHeight - 15px);
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
    .el-menu {
      padding: .9rem 0;
    }

    .logo {
      img {
        height: $menuMobileHeight;
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