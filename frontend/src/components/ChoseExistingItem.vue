<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, PropType, ref, watch } from 'vue'
import { ExistingItem, initExistingItemApi, Item, QueryItemDto, initItemApi, PrefillItem, DisabledItemActions } from '../hooks'
import ItemPreview from './ItemPreview.vue';
import { useAttributesStore, useUserStore } from '../store';
import { useRouter } from 'vue-router';
import Creator from '../pages/Creator.vue';
import ItemList from '../components/ItemList.vue';
const attributeStore = useAttributesStore()
const getAttributeNameById = attributeStore.getAttributeNameById
const chosenExistingItem = ref<ExistingItem>()
const userStore = useUserStore()
const existingItemApi = initExistingItemApi()
const loading = ref(false)
const showDialog = ref(false)
const showCreator = ref(false)
const emit = defineEmits(['onItemChosen'])

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  }
})

const existingItems = ref<ExistingItem[]>()

const initDialog = async () => {
  try {
    loading.value = true
    const res = await existingItemApi.findAllByItemId({}, props.item.id!)
    if (!res) {
      return
    }

    existingItems.value = res
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
  console.log(currentExistingItem);
  showDialog.value = false
  emit('onItemChosen', currentExistingItem)
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
        <p>Please check stats</p>
        <div class="arrow right"></div>
      </div>
    </div>

    <el-dialog draggable align-center v-model="showDialog" title="Chose your item">
      <div class="create-item">
        <el-button class="show-hide-button" v-if="!showCreator" link @click="showCreator = !showCreator">Create new
          item</el-button>
        <el-button class="show-hide-button" v-if="showCreator" link @click="showCreator = !showCreator">Select exist
          item</el-button>
        <Creator :prefillItem="prefillItem" :doAfterCreate="doAfterItemSelection" v-if="showCreator" :no-wrapper="true" />
        <ItemList v-else :no-wrapper="true" :disabledItemActions="disabledItemActions" :doAfterItemSelection="doAfterItemSelection" :filter-item="filterItem"
          :items="[item]">
        </ItemList>
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

  .arrow-data {
    margin: 0 auto;
    display: flex;
    align-items: center;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.382);
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
