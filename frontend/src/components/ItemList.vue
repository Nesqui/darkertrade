<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, PropType, ref, watch } from 'vue'
import { ExistingItem, initExistingItemApi, Item, QueryItemDto, initItemApi, DisabledItemActions } from '../hooks'
import ItemPreview from '../components/ItemPreview.vue';
import { useAttributesStore, useUserStore } from '../store';
import { useRouter } from 'vue-router';
import { filter } from 'lodash';
const attributeStore = useAttributesStore()
const getAttributeNameById = attributeStore.getAttributeNameById
const chosenItem = ref<Item>()
const userStore = useUserStore()
const maxCount = ref(6)
const pageLoading = ref(false)
const existingItemsApi = initExistingItemApi()
const existingItems = ref<ExistingItem[]>()

const pagination = ref({
  limit: 6,
  offset: 0
})

const itemsRef = ref()

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
  existingItemsSource: {
    type: Function,
    required: true
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
    props.filterItem.offerType = "WTS"
  if (!props.disabledItemActions.offerType)
    props.filterItem.hideMine = false
  if (!props.disabledItemActions.published)
    props.filterItem.published = true

  pagination.value.offset = 0
  chosenItem.value = undefined
  existingItems.value = undefined
}

watch(() => props.filterItem.slot, (cv, pv) => {
  chosenItem.value = undefined
})

watch(props.filterItem, async (cv, pv) => {
  if (!chosenItem.value?.id)
    return

  pagination.value.offset = 0

  const { rows, count } = await findExistingItemsById(chosenItem.value.id)

  itemsRef.value.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  })

  maxCount.value = count
  existingItems.value = rows
}, {
  deep: true,
})

const filteredItems = computed(() => {
  if (!Array.isArray(props.items) || !props.items.length) return []
  let filteredData = [...props.items]

  filteredData = filteredData.filter(item => item.existingItems?.length)

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

  if (!existingItems.value?.length)
    return []

  let filteredData = [...existingItems.value]

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
  // props.filterItem.id = currentItem.id
  // props.filterItem.name = currentItem.name;
  if (!currentItem.id)
    return
  chosenItem.value = currentItem
  const { rows, count } = await findExistingItemsById(currentItem.id)
  maxCount.value = count
  existingItems.value = rows
}

const findExistingItemsById = async (itemId: number) => {
  return await props.existingItemsSource(itemId, {
    ...props.filterItem,
    ...pagination.value
  })
  // return await existingItemsApi.findAllByItemId(itemId, {
  //   ...props.filterItem,
  //   ...pagination.value
  // })
}

const loadMoreExistingItems = async () => {
  pageLoading.value = true
  if (!chosenItem.value?.id)
    return
  if (pagination.value.offset + pagination.value.limit < maxCount.value) {
    pagination.value.offset = pagination.value.limit + pagination.value.offset
    const { rows, count } = await findExistingItemsById(chosenItem.value.id)
    // await new Promise(resolve => setTimeout(() => resolve(1), 500))
    if (existingItems.value?.length)
      existingItems.value = [...existingItems.value, ...rows]
  }
  pageLoading.value = false
}

const changeOfferType = (offerType: "WTS" | "WTB") => {
  props.filterItem.offerType = offerType
}
</script>

<template>
  <div class="item-list-component">
    <!-- SEARCH FILTERS  -->
    <div class="item-list-wrapper wrapper-actions" :class="{ 'wrapper': !noWrapper }">
      <div class="actions-filter">
        <el-switch v-if="!disabledItemActions.published" v-model="filterItem.published" size="large"
          active-text="Published" inactive-text="Unpublished" />
        <el-switch v-if="!disabledItemActions.hideMine" v-model="filterItem.hideMine" size="large" active-text="Hide mine"
          inactive-text="Show all" />
        <el-button-group v-if="!disabledItemActions.offerType">
          <el-button :disabled="filterItem.offerType === 'WTB'" @click="changeOfferType('WTB')">WTB</el-button>
          <el-button :disabled="filterItem.offerType === 'WTS'" @click="changeOfferType('WTS')">WTS</el-button>
        </el-button-group>
      </div>
      <div class="search">
        <el-input v-model="searchString"
          :placeholder="!chosenItem ? 'Search by name' : 'Search by attribute name'"></el-input>
        <el-button size="large" @click="clear">Clear</el-button>
      </div>
    </div>
    <!-- LIST  -->
    <div ref="itemsRef" class="item-list-wrapper" :class="{ 'wrapper': !noWrapper }">
      <div class="back">
        <el-button v-if="chosenItem" @click="() => chosenItem = undefined">Back</el-button>
      </div>
      <div v-if="!chosenItem && !filteredItems?.length">
        <p>No items exist for chosen filter yet</p>
      </div>
      <div class="item-list__wrapper">
        <!-- CATEGORIES -->
        <div v-if="!chosenItem && filteredItems?.length" class="item-list">
          <div class="wrapper-item" v-for="(currentItem, index) in filteredItems" :key="index">
            <ItemPreview @click="() => choseItem(currentItem)" :item="currentItem" :stats="[]" />
          </div>
        </div>
        <!-- NO EXISTING ITEMS IN CATEGORY  -->
        <p v-else-if="chosenItem && !filteredExistingItems?.length">No items exist for chosen filter yet</p>

        <!-- EXISTING ITEMS IN CATEGORIES  -->
        <div v-if="filteredExistingItems?.length" infinite-scroll-distance="300" class="infinite-scroll"
          v-infinite-scroll="loadMoreExistingItems" infinite-scroll-delay="200">
          <div class="item-list">
            <div class="wrapper-item" v-for="(existingItem, index) in filteredExistingItems" :key="index">
              <ItemPreview :wantedPrice="existingItem.wantedPrice" :creator-nickname="existingItem.user?.nickname"
                :item="chosenItem" :updated-at="existingItem.updatedAt" @click="() => itemClickHandle(existingItem)"
                :offerType="existingItem.offerType" :stats="existingItem.stats" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <p v-if="pageLoading">LOADING MORE ITEMS...</p>
    </transition>
  </div>
</template>

<style scoped lang="scss">
$frameWidth: 100px;
$frameHeight: 100px;
$step: 1rem;


.item-list-component {
  .wrapper {
    width: var(--wrapper-large-width);
  }
}

.item-list-wrapper {
  overflow-y: auto;
  max-height: 530px;
  margin-bottom: 2rem;
}

.back {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}


.page-loading {
  background-color: var(--el-color-danger);
  border: 1px solid var(--el-border-color);
  font-weight: 900;
  padding: 1rem;
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
  margin-bottom: 1rem;
}


.search {
  display: flex;
  align-items: center;
  gap: $step;
  width: 100%;
}

.infinite-scroll {
  // display: flex;
  // flex-direction: column;
  // justify-content: space-between;
  // overflow: hidden;
  // width: 100%;
}

.item-list {
  overflow-y: auto;
  overflow-x: hidden;
  display: grid;
  overflow-y: auto;

  gap: $step;
  grid-template-columns: 1fr 1fr 1fr;
}

.actions {
  margin-bottom: $step;
}
</style>
