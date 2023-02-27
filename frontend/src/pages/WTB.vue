<script setup lang="ts">
import { ref } from 'vue'
import Human from '../components/Human.vue';
import ItemList from '../components/ItemList.vue';
import ItemCreator from '../components/ItemCreator.vue';
import { Item } from '../hooks';


const item = ref<Item>({
    slot: "",
    name: ""
})
</script>

<template>
    <div class="wtb">
        <Human v-if="!item.slot" :item="item" />
        <ItemList v-else-if="!item.name" :item="item" />
        <ItemCreator v-else :item="item" />
    </div>
</template>

<style scoped lang="scss">
</style>
