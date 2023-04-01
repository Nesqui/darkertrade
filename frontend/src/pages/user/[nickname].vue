<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ExistingItem, initExistingItemApi, initLimits, initUserApi, User } from '~/hooks'
import CountExistingItem from '~/components/CountExistingItems.vue'
import { useUserStore } from '@/store'
import NicknameOnline from '@/components/NicknameOnline.vue'

const userApi = initUserApi()
const user = ref<User>()
const loading = ref(true)
const discordNotificationLoading = ref(false)
const route = useRoute()
const router = useRouter()
const limits = initLimits()
const userStore = useUserStore()


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

watch(() => route.params.nickname, async () => {
  await initUserData()
})

const initUserData = async () => {
  const userNickname = route.params.nickname
  if (typeof userNickname === 'string') {
    user.value = await userApi.findByNickname(userNickname)
    if (!user.value) {
      router.push('/market')
      return
    }
  }
}

const onDiscordNotificationChange = async (value: boolean) => {
  try {
    discordNotificationLoading.value = true
    await userApi.changeDiscordNotification(value)
  } catch (error) {
  } finally {
    discordNotificationLoading.value = false
  }
}


onBeforeMount(async () => {
  try {
    await initUserData()
  } catch (error) {
    ElNotification({
      message: JSON.stringify(error)
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="profile">
    <div class="wrapper">
      <div @click="push(`/user/${user?.nickname}/items`)" class="tat-frame">
        <div v-if="!user" class="loader">
          <el-skeleton class="skeleton" animated style="--el-skeleton-circle-size: 100px">
            <template #template>
              <el-skeleton-item variant="circle" />
            </template>
          </el-skeleton>
          <h2 class="darker-title user-nickname">Loading</h2>
        </div>
        <div v-else class="profile__info">
          <img src="@/assets/images/avatar.png" alt="" class="bg">
          <h2 class="darker-title user-nickname">
            {{ user.nickname }}
          </h2>
        </div>

      </div>
      <div v-if="user && userStore.currentUser.id === user.id" class="settings">
        <span>Discord DM:</span>
        <div class="settings__discord">
          <el-switch v-model="user.discordNotification" :loading="discordNotificationLoading"
            @change="onDiscordNotificationChange" size="large" active-text="On" inactive-text="Off" />
        </div>
      </div>
      <div v-if="user && userStore.currentUser.id === user.id" class="restrictions">
        <p v-if="!limits.isLoading() && !limits.canCreateWtb()">You cant create more WTB items!</p>
        <p v-if="!limits.isLoading() && !limits.canCreateWts()">You cant create more WTS items!</p>
        <CountExistingItem />
      </div>
    </div>
    <router-view v-if="user" />
  </div>
</template>

<style scoped lang="scss">
.profile {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  $frameHeight: 180px;

  .loader,
  .profile__info {
    text-align: center;
    padding: 1rem 0;
    height: $frameHeight;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  .profile__info {
    h2 {
      font-size: 15px;
    }
  }

  .bg {
    position: absolute;
    left: 0px;
    top: 20px;
    height: 250px;
    opacity: 0.15;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .user-nickname {
    font-size: 24px;
    text-transform: uppercase;
  }

  .restrictions {
    margin-top: 0rem;
  }

  .wrapper {
    gap: 2rem;
    padding: 1rem .5rem;
    width: var(--wrapper-small-width);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 300px;
  }

  .skeleton {
    margin-bottom: 2rem;
  }

  .tat-frame {
    padding: 1rem 2rem;
    flex-shrink: 1;
    font-size: unset;
    width: 190px;
    position: relative;
  }


  .avatar-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: .2rem;
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 1rem;
    font-weight: 400;
  }

  .el-button+.el-button {
    margin-left: 0;
  }

  &__links {
    display: flex;
    flex-direction: column;
    align-items: start;

    &__item {
      width: 100%;
      padding: .25rem 0;
    }

    &__item:not(:last-child) {
      border-bottom: 1px solid var(--el-border-color);
    }

    .el-button {
      font-size: 17px;
    }
  }

  .darker-title {
    text-transform: uppercase;
  }
}

@media (max-width:1280px) {
  .profile {
    flex-direction: column;
    align-items: center;

    .restrictions {
      width: 100%;
    }

    .wrapper {
      width: 100%;
      min-height: unset;
      flex-direction: column;
      align-items: center;
      gap: .5rem;

      .loader,
      .profile__info {
        height: 45px;
        margin-bottom: 0;
      }

      .tat-frame {
        padding: 0;
        width: 100%;

        h2 {
          margin: 0;
        }
      }
    }


    .bg {
      display: none;
    }
  }
}

@media (max-width:420px) {
  .profile {
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      margin: 0;
    }

    .loader,
    .profile__info {
      text-align: center;
      padding: 0;
      height: 85px;
    }

    .bg {
      display: none;
    }

    .tat-frame {
      padding: 2rem 0;
      width: 100%;
    }

    .settings {
      padding: 0rem;
      width: unset;
    }

    .wrapper {
      gap: .5rem;
      min-height: 100px;
    }
  }
}
</style>
