<script setup lang="ts">
import { AdminUserQuery, initBaseStatApi, initUserApi, truncate, useMoment, User } from '@/hooks'
import { Item, Attribute, initAttributesApi, initItemApi, ExistingItem, Stat, initExistingItemApi, PrefillItem, initLimits, BaseStat } from '@/hooks'
import { onBeforeMount, ref, watch, PropType, computed, nextTick, } from 'vue'
import { useItemStore } from '@/store';
import { ElNotification } from 'element-plus';

const requiredClear = ref(false)
const items = ref<Item[]>([])
const attributesApi = initAttributesApi()
const attributes = ref<Attribute[]>()
const itemApi = initItemApi()
const baseStatsApi = initBaseStatApi();
const itemName = ref('')
const itemAutoCompleteRef = ref()
const itemStore = useItemStore()
const baseStatValue = ref(0)
const baseStats = ref<BaseStat[]>([])
const stats = ref<Stat[]>([])
const query = ref<AdminUserQuery>({
  limit: 15,
  offset: 0
})
const props = defineProps({
  noWrapper: {
    type: Boolean,
    default: false
  },
  prefillItem: {
    type: Object as PropType<PrefillItem>,
    default: null
  },
  doAfterCreate: {
    type: Function,
  }
})

const item = ref<Item>({
  id: 0,
  slot: '',
  name: '',
  baseStats: []
})

const clearItem = () => {
  itemName.value = ''
  requiredClear.value = true

  item.value = {
    id: 0,
    slot: '',
    name: '',
    baseStats: []
  }

}

const getMinRequiredStat = () => {
  const currentItem = itemStore.items.find(currentItem => currentItem.id === item.value.id)
  if (!currentItem?.baseStats) {
    return 0
  }
  const currentStatsLength = stats.value.length
  const requiredStats = currentItem.baseStats.filter(stat => stat.inputRequired && stat.statsLength == currentStatsLength)
  return requiredStats[0] ? requiredStats[0].min : 0
}

const handleSelectItem = async (chosenItem: Item) => {
  item.value = chosenItem
  itemAutoCompleteRef.value.inputRef.blur()
  baseStats.value = (await baseStatsApi.findAllByItemPK(item.value.id ? item.value.id : 0)).sort((a, b) => { return a.statsLength - b.statsLength });
}

const paginate = (page: number) => {
  query.value.offset = (page - 1) * query.value.limit
}

watch(() => query.value.offset, async () => {
  await init()
})

const init = async () => {
  const res = await attributesApi.findAll()
  attributes.value = res.sort((a, b) => { return a.id - b.id; })
  baseStats.value = await baseStatsApi.findAllByItemPK(0);
}

const updateBaseStat = async (baseStat: BaseStat) => {
  // min: number;
  // max: number;
  // inputRequired: boolean;
  // attributeId: number;
  // statsLength: number;
  const req: any = { ...baseStat };
  const id = req.id;
  delete req.id;
  delete req.createdAt;
  delete req.itemId;
  delete req.updatedAt;
  try {
    const res = await baseStatsApi.updateBaseStat(id, req)
    if (res[0] === 1) ElNotification({ message: "Updated attr", })
  } catch (error) {

  }

}


onBeforeMount(async () => {
  await init()
  try {
    items.value = await itemApi.findAll({
      slot: ''
    })
  } catch (error) {
  } finally {
  }
})


const itemSearch = (queryString: string, cb: any) => {
  let query = queryString
  if (requiredClear.value) {
    query = requiredClear.value ? '' : queryString
    requiredClear.value = false
  }
  const results = query
    ? items.value.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) != -1)
    : items.value
  // call callback function to return suggestions
  cb(results)
}

</script>

<template>
  <div class="admin-baseStats">
    <el-autocomplete v-if="!prefillItem?.id" ref="itemAutoCompleteRef" value-key="name" v-model="itemName"
      @focus.prevent="clearItem" clearable :fetch-suggestions="itemSearch" placeholder="Base item type"
      @select="handleSelectItem" />

  </div>
  <el-table :data="baseStats" style="width: 100%">
    <el-table-column width="210" prop="attributeId" label="attrId">
      <template #default="scope">
        <span>{{ attributes?.find(elem => elem.id === scope.row.attributeId)?.name }}</span>
        <el-input size="small" v-model="scope.row.attributeId" />
      </template>
    </el-table-column>
    <el-table-column width="140" prop="min" label="min">
      <template #default="scope">
        <el-input-number size="small" v-model="scope.row.min" />
      </template>
    </el-table-column>
    <el-table-column width="140" prop="max" label="max">
      <template #default="scope">
        <el-input-number size="small" v-model="scope.row.max" />
      </template>
    </el-table-column>
    <el-table-column width="100" prop="inputRequired" label="rarityD">
      <template #default="scope">
        <el-switch size="small" v-model="scope.row.inputRequired" />
      </template>
    </el-table-column>
    <el-table-column width="75" prop="statsLength" label="Len">
      <template #default="scope">
        <el-input size="small" v-model="scope.row.statsLength" />
      </template>
    </el-table-column>
    <el-table-column label="actions" align="right">
      <template #default="scope">
        <el-button @click="() => updateBaseStat(scope.row)" link>Update</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
.admin {
  width: var(--wrapper-xxl-width);

  .ban-wrapper {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;

    .actions {
      padding-top: 2rem;
      display: flex;
      justify-content: center;
    }
  }

  .pagination-block {
    padding: 1rem 0;
  }
}
</style>