<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Item, QueryItemDto, useItemApi } from '../hooks'
import ItemPreview from '../components/ItemPreview.vue';

const items = ref<Item[]>([])
const filteredItems = ref<Item[]>([])

const itemApi = useItemApi()

const itemProp = defineProps<{ item: Item }>()

const searchString = ref<string>("")

const queryItem = ref<QueryItemDto>({
  slot: itemProp.item.slot
})

const search = () => {
  const filteredData = items.value.filter(item => item.name.toLowerCase().indexOf(searchString.value.toLowerCase()) != -1)
  filteredItems.value = filteredData
}

const clearItem = () => {
  itemProp.item.name = ""
  itemProp.item.slot = ""
}


onBeforeMount(async () => {
  const res = await itemApi.findAll(queryItem.value)
  items.value = res
  filteredItems.value = res
})

</script>

<template>
  <div class="wrapper">
    <div class="actions">
      <el-input v-model="searchString" @input="search" placeholder="search"></el-input>
      <el-button size="large" @click="clearItem">Back</el-button>
    </div>
    <div class="item-list">
      <div class="wrapper-item" v-for="(currentItem, index) in filteredItems" :key="index">
        <ItemPreview @click="item.id = currentItem.id; item.name = currentItem.name" :item="currentItem" :stats="[]" />
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
  min-width: 800px;
}

.actions {
  display: flex;
  align-items: center;
  gap: $step;
}

.item-list {
  height: 600px;
  min-width: 800px;


  overflow-y: auto;
  overflow-x: hidden;

  display: grid;
  gap: $step;
  grid-template-columns: 1fr 1fr 1fr 1fr;

}

.actions {
  margin-bottom: $step;
}
</style>
