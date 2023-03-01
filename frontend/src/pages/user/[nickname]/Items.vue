<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ExistingItem, initExistingItemApi, initUserApi, Item, User } from '../../../hooks'

const existingItemApi = initExistingItemApi()
const existingItems = ref<ExistingItem[]>()
const userApi = initUserApi()
const loading = ref(true)
const user = ref<User>()
const route = useRoute()
const filterItem = ref<Item>({
    slot: "",
    name: ""
})

onBeforeMount(async () => {
    try {
        const userNickname = route.params.nickname
        if (typeof userNickname === 'string') {
            user.value = await userApi.findByNickname(userNickname)
            if (!user.value) {
                ElNotification('User not found')
                return
            }
            existingItems.value = await existingItemApi.findAll({ userId: user.value.id })
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
    <div class="my-items">
        <item-list :filter-item="filterItem" :items="existingItems"></item-list>
    </div>
</template>

<style scoped lang="scss">
.my-items {}
</style>
