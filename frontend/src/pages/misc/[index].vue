<script setup lang="ts">
import { Item, initItemApi } from '@/hooks'
import { ref, onBeforeMount, nextTick, computed } from 'vue'
import MiscOffer from '../../components/MiscOffer.vue'
import ItemPreview from '@/components/ItemPreview.vue'

const loading = ref(false)
const refreshOffers = ref(false)
const itemApi = initItemApi()
const items = ref<Item[]>([])
const itemName = ref('')
const dialogVisible = ref(false)
const item = ref<Item>()
const itemListSearch = ref('')
const itemSearchRef = ref()

const itemListFiltered = computed(() =>
  items.value.filter((elem) => elem.name.toLowerCase().includes(itemListSearch.value.toLowerCase()))
)

const handleSelectItem = (chosenItem: Item) => {
  dialogVisible.value = false
  refreshOffers.value = true
  item.value = chosenItem
  itemName.value = item.value.name
  nextTick(() => {
    itemListSearch.value = ''
    refreshOffers.value = false
  })
}
const chooseOnlyItem = () => {
  if (itemListFiltered.value.length === 1) handleSelectItem(itemListFiltered.value[0])
}

onBeforeMount(async () => {
  try {
    loading.value = true
    items.value = await itemApi.findAll({
      slot: 'Misc'
    })
    const ruby = items.value.find((elem) => elem.name === 'Rubysilver Ingot')
    if (ruby) {
      item.value = ruby
      itemName.value = item.value.name
      handleSelectItem(item.value)
    }
    // prefillData()
  } catch (error) {
    console.log('🚀error:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <img src="@/assets/images/library1.png" alt="" class="bg" />
  <el-dialog
    v-model="dialogVisible"
    lock-scroll
    class="scrollable chose-existing-item-dialog wrapper"
    :show-close="false"
    @closed="() => (itemListSearch = '')"
    @opened="() => itemSearchRef.focus()"
  >
    <template #header>
      <el-input
        v-model="itemListSearch"
        ref="itemSearchRef"
        placeholder="Search..."
        @keydown.enter="() => chooseOnlyItem()"
      />
    </template>
    <div class="item-list-wrapper">
      <div v-for="(elem, index) in itemListFiltered" :key="index">
        <ItemPreview :item="elem" selector @click="() => handleSelectItem(elem)" />
      </div>
    </div>
  </el-dialog>
  <div class="market-wrapper">
    <MiscOffer v-if="!refreshOffers" offerType="WTS" :itemId="item?.id" />

    <ItemPreview :item="item" selector @click="() => (dialogVisible = true)" class="preview" />

    <MiscOffer v-if="!refreshOffers" offerType="WTB" :itemId="item?.id" />
  </div>
</template>

<style scoped lang="scss">
.item-list-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 35px;
}
.market-wrapper {
  gap: 16px;
  display: flex;
  justify-content: space-between;
  width: 95%;
  .preview {
    height: 192px;
    --tat-frame-width: 220px;
  }
}

.selector-wrapper {
  min-width: 180px;
  max-height: 180px;
}

.item-img {
  display: flex;
  padding: 16px 0;
  align-items: center;
  justify-content: center;

  img {
    height: 80px;
  }
}

.bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  opacity: 0.1;
  background-repeat: no-repeat;
  background-size: cover;
}

@media (max-width: 1255px) {
  .bg {
    left: 50%;
    width: unset;
    height: 100%;
    transform: translateX(-48%);
  }
}
</style>
<style lang="scss">
.el-dialog.scrollable {
  height: 80vh;
  overflow-y: scroll;
  padding: 26px;
  &__header {
    padding-bottom: 16px;
  }
}
</style>
