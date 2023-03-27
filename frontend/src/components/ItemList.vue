<script setup lang="ts">
import { computed, PropType, ref, watch } from 'vue'
import { ExistingItem, Item, QueryItemDto, DisabledItemActions, Attribute } from '../hooks'
import ItemPreview from '../components/ItemPreview.vue';
import { useAttributesStore, useUserStore } from '../store';
import { useRouter } from 'vue-router';
const attributeStore = useAttributesStore()
const getAttributeNameById = attributeStore.getAttributeNameById
const chosenItem = ref<Item>()
const maxCount = ref(6)
const pageLoading = ref(false)
const existingItems = ref<ExistingItem[]>()
const selectedAttributes = ref<Attribute[]>([])
const attributeSearchString = ref('')
const selectedAttributeRef = ref()
const MAX_ATTRIBUTES = 5

const handleSelectAttribute = (attribute: Attribute) => {
  selectedAttributes.value.push(attribute)
  attributeSearchString.value = ''
  selectedAttributeRef.value.blur()
  props.filterItem.attributesId = selectedAttributes.value.map(_attribute => _attribute.id)
}

const handleCloseAttribute = (attribute: Attribute) => {
  selectedAttributes.value.splice(selectedAttributes.value.findIndex(_attribute => _attribute.id === attribute.id))
  props.filterItem.attributesId = selectedAttributes.value.map(_attribute => _attribute.id)
}

const attributeSearch = (queryString: string, cb: any) => {
  if (selectedAttributes.value.length >= MAX_ATTRIBUTES) {
    cb([])
    return
  }
  let results = attributeStore.attributes
  results = queryString
    ? results.filter(attribute => attribute.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
    : results
  cb(results)
}

const pagination = ref({
  limit: 6,
  offset: 0
})

const itemsRef = ref()

const props = defineProps({
  isMarket: {
    type: Boolean,
    default: false
  },
  items: { type: Object as PropType<Item[]>, required: true },
  filterItem: { type: Object as PropType<QueryItemDto>, required: true },
  loading: {
    type: Boolean,
    required: true
  },
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

const clearAttributes = () => {
  selectedAttributes.value = []
  props.filterItem.attributesId = []
}
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

  props.filterItem.attributesId = []
  selectedAttributes.value = []
  pagination.value.offset = 0
  chosenItem.value = undefined
  existingItems.value = undefined
}

let searchDelayTimeout = 0

watch(() => searchString.value, () => {
  clearTimeout(searchDelayTimeout)
  searchDelayTimeout = setTimeout(() => {
    props.filterItem.searchItemString = searchString.value
  }, 500);
})

watch(() => props.filterItem.slot, () => {
  chosenItem.value = undefined
})

watch(props.filterItem, async () => {
  if (!chosenItem.value?.id)
    return

  pagination.value.offset = 0

  const { rows, count } = await findExistingItemsById(chosenItem.value.id)

  if (itemsRef.value)
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

  // if (searchString.value)
  //   filteredData = filteredData.filter(item => item.name.toLowerCase().indexOf(searchString.value.toLowerCase()) != -1)

  return filteredData
})


const filteredExistingItems = computed(() => {
  if (!chosenItem.value)
    return []

  if (!existingItems.value?.length)
    return []

  let filteredData = [...existingItems.value]

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
  searchString.value = ""
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
    const { rows } = await findExistingItemsById(chosenItem.value.id)
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
    <img src="@/assets/images/market.png" alt="" class="bg">
    <div class="search-wrapper wrapper-actions" :class="{ 'wrapper': !noWrapper }">
      <!-- !!! HERE I NEED ALL CHECKS  -->
      <div v-if="!disabledItemActions.published || !disabledItemActions.hideMine || !disabledItemActions.offerType" class="actions-filter">
        <el-switch v-if="!disabledItemActions.published" v-model="filterItem.published" size="large"
          active-text="Published" inactive-text="Unpublished" />
        <el-switch v-if="!disabledItemActions.hideMine" v-model="filterItem.hideMine" size="large" active-text="Hide mine"
          inactive-text="Show all" />
        <el-button-group v-if="!disabledItemActions.offerType">
          <el-button :disabled="filterItem.offerType === 'WTB'" @click="changeOfferType('WTB')">
            {{ isMarket ? 'I want to sell' : 'WTB only' }}
          </el-button>
          <el-button :disabled="filterItem.offerType === 'WTS'" @click="changeOfferType('WTS')">
            {{ isMarket ? 'I want to buy' : 'WTS only' }}
          </el-button>
        </el-button-group>
      </div>
      <div class="search">
        <el-input v-model="searchString" v-if="!chosenItem" :placeholder="'Hatchet (category)'"></el-input>
        <div class="search-attribute w-100" v-else>
          <el-autocomplete ref="selectedAttributeRef" v-model="attributeSearchString" value-key="name"
            :fetch-suggestions="attributeSearch" clearable
            :placeholder="selectedAttributes.length >= MAX_ATTRIBUTES ? 'Limit stats reached' : 'All attributes (Stat)'"
            @select="handleSelectAttribute" />
          <div class="tags">
            <el-tag v-for="tag in selectedAttributes" :key="tag" class="mx-1" closable :disable-transitions="false"
              @close="handleCloseAttribute(tag)">
              {{ tag.name }}
            </el-tag>
            <el-button link v-if="selectedAttributes.length" @click="clearAttributes">Delete all</el-button>
          </div>
        </div>

        <el-button size="large" @click="clear">Clear</el-button>
      </div>
    </div>
    <!-- LOADING SKELETON CATEGORIES -->
    <div v-if="loading" class="wrapper loading item-list-wrapper" :class="{ 'wrapper': !noWrapper }">
      <el-skeleton :rows="4" v-for="(v, index) of new Array(9)" :key="index" animated></el-skeleton>
    </div>
    <!-- LIST  -->
    <div v-else ref="itemsRef" class="item-list-wrapper" :class="{ 'wrapper': !noWrapper }">
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
  position: relative;

  .tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    gap: .25rem;
  }

  .search-attribute {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    align-items: flex-start;
  }

  .bg {
    position: fixed;
    right: 250px;
    top: 0;
    width: var(--wrapper-large-width);
    opacity: 0.335;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .wrapper {
    width: var(--wrapper-large-width);
  }
}

.loading {
  overflow-y: auto;
  overflow-x: hidden;
  display: grid;
  overflow-y: auto;
  text-align: center;
  gap: calc($step * 3);
  grid-template-columns: 1fr 1fr 1fr;

  .el-skeleton {
    margin-bottom: 1rem;
  }
}

.item-list-wrapper {
  position: relative;
  overflow-y: auto;
  margin-bottom: 2rem;
  height: 570px;
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
  height: 45px;
}


.search {
  display: flex;
  align-items: flex-start;
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

@media (max-width:420px) {
  .item-list-component {
    width: 100%;

    .bg {
      position: absolute;
      left: -60%;
    }

    .actions-filter {
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-bottom: 1rem;
      height: unset;
    }

    .wrapper {
      width: unset;
    }

    .item-list {
      align-items: center;
      justify-content: center;
      grid-template-columns: auto;
    }
  }
}
</style>

<style lang="scss">
.item-list-component {

  .w-100 {
    .el-autocomplete {
      width: 100%;
    }
  }
}
</style>