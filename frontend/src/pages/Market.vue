<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import Human from '../components/Human.vue';
import ItemList from '../components/ItemList.vue';
import { Item, initItemApi, QueryItemDto, DisabledItemActions, initExistingItemApi } from '../hooks';

const itemApi = initItemApi()
const items = ref<Item[]>([])
const existingItemsApi = initExistingItemApi()

const filterItem = ref<QueryItemDto>({
    slot: "",
    name: "",
    offerType: "WTS",
    hideMine: true,
    searchItemString: "",
    searchExistingItemString: "",
    published: true
})

watch(filterItem,  async () => {
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
    const res = await itemApi.getMarket(filterItem.value)
    items.value = res
}

onBeforeMount(async () => {
    await init()
})
</script>

<template>
    <div class="market">
        <Human :filterItem="filterItem" />
        <ItemList :filterItem="filterItem" :items="items" :disabled-item-actions="disabledItemActions" :existing-items-source="existingItemsApi.findAllByItemId" />
    </div>
</template>

<style scoped lang="scss">
.market {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 2rem;
}
</style>
