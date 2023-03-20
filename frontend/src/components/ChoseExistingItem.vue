<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, PropType, ref, watch } from 'vue'
import { ExistingItem, initExistingItemApi, Item, QueryItemDto, initItemApi, PrefillItem, DisabledItemActions } from '../hooks'
import ItemPreview from './ItemPreview.vue';
import { useUserStore } from '../store';
import Creator from '../pages/Creator.vue';
import ItemList from '../components/ItemList.vue';
const chosenExistingItem = ref<ExistingItem>()
const existingItemApi = initExistingItemApi()
const loading = ref(false)
const showDialog = ref(false)
const showCreator = ref('selectExisting')
const emit = defineEmits(['onItemChosen'])
const userStore = useUserStore()
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  }
})

const initDialog = async () => {
  try {
    loading.value = true
    // const res = await existingItemApi.findAllByItemId(props.item.id!, {
    //   slot: '',
    //   limit: 6,
    //   offset: 0,
    //   published: true
    // })
    // if (!res) {
    //   return
    // }
    // tempItem.value.existingItems = res.rows
    showDialog.value = true

  } catch (error) {
  } finally {
    loading.value = false
  }
}

const filterItem = ref<QueryItemDto>({
  slot: "",
  name: "",
  offerType: "WTS",
  hideMine: false,
  published: true
})

const disabledItemActions = ref<DisabledItemActions>({
  name: true,
  slot: true,
  offerType: true,
  hideMine: true,
  published: true
})

const prefillItem = computed((): PrefillItem => ({
  id: props.item.id!,
  name: props.item.name!,
  slot: props.item.slot,
  offerType: 'WTS'
}))

const doAfterItemSelection = async (currentExistingItem: ExistingItem) => {
  chosenExistingItem.value = currentExistingItem
  showDialog.value = false
  emit('onItemChosen', currentExistingItem)
}

const findAllByItemIdAndUserId = async (itemId: number, query: QueryItemDto) => {
  return await existingItemApi.findAllByItemIdAndUserId(itemId, userStore.currentUser.id, query)
}
</script>

<template>
  <div class="chose-existing-item">
    <el-button :loading="loading" v-if="!chosenExistingItem" size="large" @click="initDialog">Chose or create
      item</el-button>
    <div v-else class="chosen-item">
      <ItemPreview :item="prefillItem" :wantedPrice="chosenExistingItem.wantedPrice"
        :offerType="chosenExistingItem.offerType" :stats="chosenExistingItem.stats" />
      <div class="arrow-data">
        <div class="arrow left"></div>
        <p>Check</p>
        <div class="arrow right"></div>
      </div>
    </div>

    <el-dialog class="chose-existing-item-dialog wrapper" draggable align-center v-model="showDialog">
      <div>
        <el-tabs v-model="showCreator">
          <el-tab-pane label="Create item to sell" name="createNew">
            <Creator :prefillItem="prefillItem" :doAfterCreate="doAfterItemSelection" :no-wrapper="true" />
          </el-tab-pane>
          <el-tab-pane label="Select existing item" name="selectExisting">
            <ItemList :no-wrapper="true" :disabledItemActions="disabledItemActions"
              :doAfterItemSelection="doAfterItemSelection" :filter-item="filterItem" :items="[props.item]"
              :existing-items-source="findAllByItemIdAndUserId" :loading="false">
            </ItemList>
          </el-tab-pane>
        </el-tabs>

      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.chose-existing-item {
  .show-hide-button {
    margin-bottom: 1rem;
  }

  .chosen-item {
    display: flex;
    align-items: center;
  }

  .chose-item__actions {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .arrow-data {
    display: flex;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    font-weight: 900;
    color: var(--el-color-danger);
    padding-left: 1rem;
  }

  .arrow {
    border: solid rgba(0, 0, 0, 0.382);
    border-width: 0 20px 20px 0;
    display: inline-block;
    padding: 20px;
  }

  .left {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
  }

  .right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
}
</style>

<style lang="scss">
.el-tabs__content {
  .search-wrapper {
    flex-direction: unset;
  }
}
</style>