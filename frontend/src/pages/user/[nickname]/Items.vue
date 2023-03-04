<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import ItemList from '../../../components/ItemList.vue';
import { DisabledItemActions, ExistingItem, initExistingItemApi, initItemApi, initUserApi, Item, QueryItemDto, User } from '../../../hooks'

const itemApi = initItemApi()
const items = ref<Item[]>()
const userApi = initUserApi()
const loading = ref(true)
const user = ref<User>()
const route = useRoute()
const filterItem = ref<QueryItemDto>({
    slot: "",
    name: "",
    offerType: "",
    published: true
})

const disabledItemActions = ref<DisabledItemActions>({
    slot: false,
    name: false,
    offerType: false,
    hideMine: true,
    published: false
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
        <ItemList :filter-item="filterItem" :items="items || []" :disabled-item-actions="disabledItemActions"></ItemList>
    </div>
</template>

<style scoped lang="scss">
.my-items {}
</style>
