<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import ItemList from '../../../components/ItemList.vue';
import { ExistingItem, initExistingItemApi, initItemApi, initUserApi, Item, User } from '../../../hooks'

const itemApi = initItemApi()
const items = ref<Item[]>()
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
            const res = await itemApi.findUserItems(user.value.id)
            if (res)
                items.value = res
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
        <ItemList :filter-item="filterItem" :items="items || []"></ItemList>
    </div>
</template>

<style scoped lang="scss">
.my-items {}
</style>
