<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ExistingItem, initExistingItemApi, initUserApi, User } from '../../hooks'

const userApi = initUserApi()
const user = ref<User>()
const loading = ref(true)
const route = useRoute()

onBeforeMount(async () => {
    try {
        const userNickname = route.params.nickname
        if (typeof userNickname === 'string') {
            user.value = await userApi.findByNickname(userNickname)
            if (!user.value) {
                ElNotification('User not found')
                return
            }
        }
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
            <div class="item-frame no-hover">
                <div class="profile__info">
                    <h2 class="darker-title user-nickname">{{ user?.nickname || 'NICKNAME' }}</h2>
                    <div class="avatar-wrapper">
                        <div class="img-avatar"></div>
                    </div>
                    <span v-if="user?.name">Name: {{ user.name }}</span>
                    <span v-if="user?.lastName">Name: {{ user.lastName }}</span>
                    <span>Baned: {{ user?.active ? 'no' : 'yes' }}</span>
                    <span>Online: no</span>
                </div>
                <div class="profile__links">
                    <div class="profile__links__item">
                        <el-button link :href="`/user/${user?.nickname}/items`">Items</el-button>
                    </div>
                </div>
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

    .wrapper {
        display: flex;
        gap: 2rem;
    }

    .avatar-wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
    }

    .item-frame {
        padding: 1rem 2rem;
        width: 200px;
        flex-shrink: 1;
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
