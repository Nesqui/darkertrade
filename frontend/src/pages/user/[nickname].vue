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
            <div class="profile item-frame no-hover" v-if="!loading">
                <div class="profile__info">
                    <h2 class="darker-title">{{ user?.nickname }}</h2>
                    <div class="avatar-wrapper">
                        <div class="img-avatar"></div>
                    </div>
                    <span v-if="user?.discord">Discord {{ user.discord }}</span>
                    <span v-if="user?.name">Name: {{ user.name }}</span>
                    <span v-if="user?.lastName">Name: {{ user.lastName }}</span>
                    <span>Baned: {{ user?.active ? 'no' : 'yes' }}</span>
                </div>
                <div class="profile__links">
                    <div class="profile__links__item">
                        <el-button link href="">test</el-button>
                    </div>
                    <div class="profile__links__item">
                        <el-button link href="">test</el-button>
                    </div>
                    <div class="profile__links__item">
                        <el-button link href="">test</el-button>
                    </div>
                    <div class="profile__links__item">
                        <el-button link href="">test</el-button>
                    </div>
                    <div class="profile__links__item">
                        <el-button link href="">test</el-button>
                    </div>
                </div>
            </div>
            <router-view />
        </div>
    </div>
</template>

<style scoped lang="scss">
.profile {
    .wrapper {
        min-width: 900px;
        display: flex;
        gap: 2rem;
    }

    .avatar-wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
    }

    .item-frame {
        padding: 1rem .5rem;
    }

    .profile {
        width: 220px;

        &__info {
            display: flex;
            flex-direction: column;
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 1rem;
        }

        .el-button+.el-button {
            margin-left: 0;
        }

        &__links {
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: .6rem;

            &__item {
                width: 100%;
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
}
</style>
