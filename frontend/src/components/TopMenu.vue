<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useUserStore } from '../store'

const windowWidth = ref(400)

const userStore = useUserStore()
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
      <el-menu-item index="/admin" v-if="userStore.currentUser.isAdmin">Admin</el-menu-item>
      <el-menu-item index="/market">Browse offers</el-menu-item>
      <el-menu-item index="/creator">Create offer</el-menu-item>
      <el-menu-item :index="`/user/${userStore.currentUser.nickname}/items`">My items</el-menu-item>
      <el-menu-item index="/bids/">My bids</el-menu-item>
      <div class="flex-grow" />
      <el-menu-item :index="`/user/${userStore.currentUser.nickname}/items`">
        {{ userStore.currentUser.nickname }}
      </el-menu-item>
      <el-menu-item @click="userStore.logout" index="/">Logout</el-menu-item>
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