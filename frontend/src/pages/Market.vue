<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import Human from '../components/Human.vue';
import ItemList from '../components/ItemList.vue';
import { Item, initItemApi, QueryItemDto, DisabledItemActions, initExistingItemApi } from '../hooks';
const loading = ref(true)
const itemApi = initItemApi()
const items = ref<Item[]>([])
const existingItemsApi = initExistingItemApi()

const filterItem = ref<QueryItemDto>({
    slot: "",
    name: "",
    offerType: "WTS",
    hideMine: true,
    searchItemString: "",
    attributesId: [],
    published: true
})

watch(filterItem, async () => {
    await init()
}, {
    deep: true
})

const disabledItemActions = ref<DisabledItemActions>({
    slot: false,
    name: false,
    offerType: false,
    hideMine: false,
    published: true
})

const init = async () => {
    loading.value = true
    try {
        const res = await itemApi.getMarket(filterItem.value)
        items.value = res
    } catch (error) {
    } finally {
        loading.value = false
    }
}

onBeforeMount(async () => {
    await init()
})
</script>

<template>
    <div class="market">
        <Human :filterItem="filterItem" />
        <ItemList :is-market="true" :filterItem="filterItem" :items="items" :disabled-item-actions="disabledItemActions"
            :existing-items-source="existingItemsApi.findAllByItemId" :loading="loading" />
    </div>
</template>

<style scoped lang="scss">
.market {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 2rem;
}


@media (max-width:420px) {
    .market {
        flex-direction: column;
        align-items: center;
    }
}
</style>
