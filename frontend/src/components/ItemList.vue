<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, PropType, ref, watch } from 'vue'
import { ExistingItem, initExistingItemApi, Item, QueryItemDto, useItemApi } from '../hooks'
import ItemPreview from '../components/ItemPreview.vue';
import { useAttributesStore } from '../store';
const attributeStore = useAttributesStore()
const getAttributeNameById = attributeStore.getAttributeNameById
const chosenItem = ref<Item>()

const props = defineProps({
  items: { type: Object as PropType<Item[]>, required: true },
  filterItem: { type: Object as PropType<Item>, required: true }
})

const searchString = ref<string>("")

const clear = () => {
  searchString.value = ""
  props.filterItem.name = ""
  props.filterItem.slot = ""
  chosenItem.value = undefined
}

const filteredItems = computed(() => {
  let filteredData = [...props.items]
  if (props.filterItem.slot)
    filteredData = props.items.filter(item => item.slot === props.filterItem.slot)
  if (searchString.value)
    filteredData = filteredData.filter(item => item.name.toLowerCase().indexOf(searchString.value.toLowerCase()) != -1)
  return filteredData
})

const statFilter = (existingItem: ExistingItem, queryString: string) => {
  return existingItem.stats.find(stat => getAttributeNameById(stat.attributeId).toLowerCase().indexOf(queryString.toLowerCase()) != -1)
}

const filteredExistingItems = computed(() => {
  if (!chosenItem.value)
    return []

  if (searchString.value && chosenItem.value.existingItems?.length)
    return chosenItem.value.existingItems.filter((existingItem) => statFilter(existingItem, searchString.value))

  return chosenItem.value.existingItems
})

const choseItem = async (currentItem: Item) => {
  props.filterItem.id = currentItem.id
  props.filterItem.name = currentItem.name;
  chosenItem.value = currentItem
}
</script>

<template>
  <div class="wrapper">
    <div class="actions">
      <el-input v-model="searchString" :placeholder="!chosenItem ? 'Search by name' : 'Search by attribute name'"></el-input>
      <el-button size="large" @click="clear">Clear</el-button>
    </div>
    <div v-if="!chosenItem && !filteredItems?.length">
      <p>Currently no items here</p>
    </div>
    <div v-else-if="!chosenItem" class="item-list">
      <div class="wrapper-item" v-for="(currentItem, index) in filteredItems" :key="index">
        <ItemPreview @click="() => choseItem(currentItem)" :item="currentItem" :stats="[]" />
      </div>
    </div>
    <div v-else class="item-list">
      <div class="wrapper-item" v-for="(existingItem, index) in filteredExistingItems" :key="index">
        <ItemPreview :item="chosenItem" :stats="existingItem.stats" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$frameWidth: 100px;
$frameHeight: 100px;
$item-description-padding: .7rem;
$step: 1rem;

.wrapper {
  padding: $step;
  overflow: hidden;
  width: 830px;
}

.actions {
  display: flex;
  align-items: center;
  gap: $step;
}

.item-list {
  overflow-y: auto;
  overflow-x: hidden;

  display: grid;
  gap: $step;
  grid-template-columns: 1fr 1fr 1fr;

}

.actions {
  margin-bottom: $step;
}
</style>
