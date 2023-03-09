<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemList from '../../../components/ItemList.vue';
import { DisabledItemActions, ExistingItem, initExistingItemApi, initItemApi, initUserApi, Item, QueryItemDto, User } from '../../../hooks'
import { useUserStore } from '../../../store';

const existingItemApi = initExistingItemApi()
const itemApi = initItemApi()
const items = ref<Item[]>()
const userApi = initUserApi()
const loading = ref(true)
const user = ref<User>()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const filterItem = ref<QueryItemDto>({
    slot: "",
    name: "",
    offerType: "WTS",
    published: true
})

const disabledItemActions = ref<DisabledItemActions>({
    slot: false,
    name: false,
    offerType: false,
    hideMine: true,
    published: true
})

const initItems = async () => {
    if (!user.value) {
        return
    }
    const res = await itemApi.findUserItems(user.value.id, filterItem.value)
    if (res)
        items.value = res

}

watch(filterItem.value, async () => {
    await initItems()
})

const findAllByItemIdAndUserId = async (itemId: number, query: QueryItemDto) => {
    if (user.value?.id)
        return await existingItemApi.findAllByItemIdAndUserId(itemId, user.value.id, query)
}

watch(() => route.params.nickname, async () => {
    await initData()
})

const initData = async () => {
    const userNickname = route.params.nickname
    if (typeof userNickname === 'string') {
        user.value = await userApi.findByNickname(userNickname)
        if (!user.value) {
            ElNotification('User not found')
            router.push('/market')
            return
        }
        if (user.value.id === userStore.currentUser.id)
            disabledItemActions.value.published = false
        await initItems()
    }
}

onBeforeMount(async () => {
    try {
        await initData()
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
        <ItemList :filter-item="filterItem" :items="items || []" :disabled-item-actions="disabledItemActions"
            :existing-items-source="findAllByItemIdAndUserId" :loading="loading"></ItemList>
    </div>
</template>
 :loading=
<style scoped lang="scss">
.my-items {
    .wrapper {
        width: var(--wrapper-large-width);
    }
}
</style>
