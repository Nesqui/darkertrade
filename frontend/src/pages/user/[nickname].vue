<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ExistingItem, initExistingItemApi, initLimits, initUserApi, User } from '~/hooks'
import CountExistingItem from '~/components/CountExistingItems.vue'
import { useUserStore } from '@/store'

const userApi = initUserApi()
const user = ref<User>()
const loading = ref(true)
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
            ElNotification('User not found')
            return
        }
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
                <div class="profile__info">
                    <h2 class="darker-title user-nickname">{{ user?.nickname || 'NICKNAME' }}</h2>
                    <div class="avatar-wrapper">
                        <div class="img-avatar"></div>
                    </div>
                    <span v-if="user?.name">Name: {{ user.name }}</span>
                    <span v-if="user?.lastName">Name: {{ user.lastName }}</span>
                    <span>Banned: {{ user?.active ? 'no' : 'yes' }}</span>
                    <span>Online: no</span>
                </div>
                <!-- <div class="profile__links">
                            <div class="profile__links__item">
                            </div>
                        </div> -->

            </div>
            <div v-if="user && userStore.currentUser.id === user.id" class="restrictions">
                <p v-if="!limits.canCreateWtb()">You cant create more WTB items!</p>
                <p v-if="!limits.canCreateWts()">You cant create more WTS items!</p>
                <CountExistingItem />
            </div>
        </div>
        <router-view />
    </div>
</template>

<style scoped lang="scss">
.profile {
    display: flex;
    align-items: flex-start;
    gap: 2rem;

    .user-nickname {
        font-size: 24px;
        text-transform: uppercase;
    }

    .restrictions {
        margin-top: 1rem;
    }

    .wrapper {
        gap: 2rem;
        padding: 1rem .5rem;
    }

    .avatar-wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
    }

    .tat-frame {
        padding: 1rem 2rem;
        flex-shrink: 1;
        font-size: unset;
        width: 190px;
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
</style>
