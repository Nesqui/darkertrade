<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import Human from '../components/Human.vue';
import ItemList from '../components/ItemList.vue';
import { Item, initItemApi } from '../hooks';

const itemApi = initItemApi()
const items = ref<Item[]>([])

const filterItem = ref<Item>({
    slot: "",
    name: ""
})

onBeforeMount(async () => {
    const res = await itemApi.getMarket({ slot: "" })
    items.value = res
})
</script>

<template>
    <div class="market">
        <Human :item="filterItem" />
        <ItemList :filterItem="filterItem" :items="items" />
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
