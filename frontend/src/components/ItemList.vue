<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, PropType, ref, watch } from 'vue'
import { ExistingItem, initExistingItemApi, Item, QueryItemDto, initItemApi, DisabledItemActions } from '../hooks'
import ItemPreview from '../components/ItemPreview.vue';
import { useAttributesStore, useUserStore } from '../store';
import { useRouter } from 'vue-router';
const attributeStore = useAttributesStore()
const getAttributeNameById = attributeStore.getAttributeNameById
const chosenItem = ref<Item>()
const userStore = useUserStore()



const props = defineProps({
  items: { type: Object as PropType<Item[]>, required: true },
  filterItem: { type: Object as PropType<QueryItemDto>, required: true },
  noWrapper: {
    type: Boolean,
    default: false
  },
  doAfterItemSelection: {
    type: Function,
  },
  disabledItemActions: {
    type: Object as PropType<DisabledItemActions>,
    required: true
  },
})

const router = useRouter()

const searchString = ref<string>("")

const clear = () => {
  searchString.value = ""

  if (!props.disabledItemActions.name)
    props.filterItem.name = ""
  if (!props.disabledItemActions.slot)
    props.filterItem.slot = ""
  if (!props.disabledItemActions.offerType)
    props.filterItem.offerType = ""
  if (!props.disabledItemActions.offerType)
    props.filterItem.hideMine = false
  if (!props.disabledItemActions.published)
    props.filterItem.published = true

  chosenItem.value = undefined
}

watch(() => props.filterItem.slot, (cv, pv) => {
  props.filterItem.slot = cv
  chosenItem.value = undefined
})

const filteredItems = computed(() => {
  if (!Array.isArray(props.items) || !props.items.length) return []
  let filteredData = [...props.items]
  console.log(props.filterItem);

  if (typeof props.filterItem.published === 'boolean') {
    filteredData = filteredData.filter(item => item.existingItems?.find(existingItem => existingItem.published === props.filterItem.published))
    filteredData.forEach(item => {
      item.existingItems = item.existingItems?.filter(existingItem => existingItem.published === props.filterItem.published)
    })
  }
  if (props.filterItem.hideMine) {
    filteredData = filteredData.filter(item => item.existingItems?.find(existingItem => existingItem.userId !== userStore.currentUser.id))
    filteredData.forEach(item => {
      item.existingItems = item.existingItems?.filter(existingItem => existingItem.userId !== userStore.currentUser.id)
    })
  }
  if (props.filterItem.offerType) {
    filteredData = filteredData.filter(item => item.existingItems?.find(existingItem => existingItem.offerType === props.filterItem.offerType))
    filteredData.forEach(item => {
      item.existingItems = item.existingItems?.filter(existingItem => existingItem.offerType === props.filterItem.offerType)
    })
  }
  if (props.filterItem.slot)
    filteredData = filteredData.filter(item => item.slot === props.filterItem.slot)
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

  if (!chosenItem.value.existingItems)
    return []

  let filteredData = [...chosenItem.value.existingItems]

  if (typeof props.filterItem.published === 'boolean')
    filteredData = filteredData.filter(existingItem => existingItem.published === props.filterItem.published)

  if (props.filterItem.hideMine)
    filteredData = filteredData.filter(existingItem => existingItem.userId !== userStore.currentUser.id)

  if (props.filterItem.offerType)
    filteredData = filteredData.filter(existingItem => existingItem.offerType === props.filterItem.offerType)

  if (searchString.value)
    filteredData = filteredData.filter((existingItem) => statFilter(existingItem, searchString.value))

  return filteredData
})

const itemClickHandle = (chosenExistingItem: ExistingItem) => {
  if (props.doAfterItemSelection) {
    props.doAfterItemSelection(chosenExistingItem)
    return
  }
  router.push(`/user/${chosenExistingItem.user?.nickname}/items/${chosenExistingItem.id}`)
}

const choseItem = async (currentItem: Item) => {
  props.filterItem.id = currentItem.id
  props.filterItem.name = currentItem.name;
  chosenItem.value = currentItem
}

const changeOfferType = (offerType: "WTS" | "WTB" | "") => {
  props.filterItem.offerType = offerType
}
</script>

<template>
  <div>
    <div class="item-list-wrapper wrapper-actions" :class="{ 'wrapper': !noWrapper }">
      <div class="actions">
        <el-input v-model="searchString"
          :placeholder="!chosenItem ? 'Search by name' : 'Search by attribute name'"></el-input>
        <el-button size="large" @click="clear">Clear</el-button>
      </div>
      <div class="actions-filter">
        <el-switch v-if="!disabledItemActions.published" v-model="filterItem.published" size="large"
          active-text="Published" inactive-text="Unpublished" />
        <el-switch v-if="!disabledItemActions.hideMine" v-model="filterItem.hideMine" size="large" active-text="Hide mine"
          inactive-text="Show all" />
        <el-button-group v-if="!disabledItemActions.offerType">
          <el-button :disabled="filterItem.offerType === 'WTB'" @click="changeOfferType('WTB')">WTB</el-button>
          <el-button :disabled="filterItem.offerType === 'WTS'" @click="changeOfferType('WTS')">WTS</el-button>
          <el-button :disabled="filterItem.offerType === ''" @click="changeOfferType('')">ALL</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="item-list-wrapper" :class="{ 'wrapper': !noWrapper }">
      <div v-if="!chosenItem && !filteredItems?.length">
        <p>No items exist for chosen filter yet</p>
      </div>
      <div class="item-list__wrapper">
        <div v-if="!chosenItem && filteredItems?.length" class="item-list">
          <div class="wrapper-item" v-for="(currentItem, index) in filteredItems" :key="index">
            <ItemPreview @click="() => choseItem(currentItem)" :item="currentItem" :stats="[]" />
          </div>
        </div>
        <p v-else-if="chosenItem && !filteredExistingItems.length">No items exist for chosen filter yet</p>
        <div v-else class="item-list">
          <div class="wrapper-item" v-for="(existingItem, index) in filteredExistingItems" :key="index">
            {{ existingItem.user?.nickname }}
            <ItemPreview :wantedPrice="existingItem.wantedPrice" :item="chosenItem"
              @click="() => itemClickHandle(existingItem)" :offerType="existingItem.offerType"
              :stats="existingItem.stats" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$frameWidth: 100px;
$frameHeight: 100px;
$step: 1rem;

.item-list-wrapper {
  padding: $step;
  width: 860px;
  max-height: 600px;
}

.wrapper-actions {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.actions-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
}


.actions {
  display: flex;
  align-items: center;
  gap: $step;
  width: 100%;
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
