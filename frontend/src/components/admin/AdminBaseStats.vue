<script setup lang="ts">
import { AdminUserQuery, initBaseStatApi } from '@/hooks'
import { Item, Attribute, initAttributesApi, initItemApi, PrefillItem, BaseStat } from '@/hooks'
import { onBeforeMount, ref, watch, PropType } from 'vue'
import { ElNotification } from 'element-plus'
import { useAttributesStore } from '@/store'

const requiredClear = ref(false)
const attributeStore = useAttributesStore()
const getAttributeNameById = attributeStore.getAttributeNameById
const items = ref<Item[]>([])
const attributesApi = initAttributesApi()
const attributes = ref<Attribute[]>()
const itemApi = initItemApi()
const baseStatsApi = initBaseStatApi()
const itemName = ref('')
const itemAutoCompleteRef = ref()
// const baseStats = ref<BaseStat[]>([])
const loading = ref(false)
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
    type: Function
  }
})

const item = ref<Item>({
  id: 0,
  slot: '',
  name: ''
  // baseStats: []
})

const clearItem = () => {
  itemName.value = ''
  requiredClear.value = true

  item.value = {
    id: 0,
    slot: '',
    name: ''
    // baseStats: []
  }
}

const handleSelectItem = async (chosenItem: Item) => {
  loading.value = true
  item.value = chosenItem
  itemAutoCompleteRef.value.inputRef.blur()
  const res = await baseStatsApi.findAllByItemPK(item.value.id || 0)
  res.sort((a, b) => a.statsLength - b.statsLength)
  res.sort((x, y) => (x.inputRequired === y.inputRequired ? 0 : x.inputRequired ? 1 : -1))
  // baseStats.value = res
  loading.value = false
}

watch(
  () => query.value.offset,
  async () => {
    await init()
  }
)

const init = async () => {
  loading.value = true
  const res = await attributesApi.findAll()
  attributes.value = res.sort((a, b) => {
    return a.id - b.id
  })
  loading.value = false
}

// const updateBaseStat = async (baseStat: BaseStat) => {
//   const req: any = { ...baseStat }
//   const id = req.id
//   delete req.id
//   delete req.createdAt
//   delete req.itemId
//   delete req.updatedAt
//   try {
//     const res = await baseStatsApi.updateBaseStat(id, req)
//     if (res[0] === 1) ElNotification({ message: 'Updated attr' })
//   } catch (error) {
//     console.log('🚀 ~ file: AdminBaseStats.vue:91 ~ updateBaseStat ~ error:', error)
//   }
// }

const addBaseStat = async () => {
  try {
    const res = await baseStatsApi.createBaseStat({
      itemId: item.value.id
    })
    await handleSelectItem(item.value)
    if (!res) ElNotification({ message: 'Added attr' })
  } catch (error) {
    console.log('🚀 ~ file: AdminBaseStats.vue:101 ~ addBaseStat ~ error:', error)
  }
}

const removeBaseStat = async (baseStat: BaseStat) => {
  try {
    if (!baseStat.id) return
    const res = await baseStatsApi.removeBaseStat(baseStat.id)
    if (!res) ElNotification({ message: 'Removed attr' })
    await handleSelectItem(item.value)
  } catch (error) {
    console.log('🚀 ~ file: AdminBaseStats.vue:113 ~ removeBaseStat ~ error:', error)
  }
}

onBeforeMount(async () => {
  await init()
  try {
    items.value = await itemApi.findAll({
      slot: ''
    })
  } catch (error) {
    console.log('🚀 ~ file: AdminBaseStats.vue:126 ~ onBeforeMount ~ error:', error)
  }
})

const itemSearch = (queryString: string, cb: any) => {
  let query = queryString
  if (requiredClear.value) {
    query = requiredClear.value ? '' : queryString
    requiredClear.value = false
  }
  const results = query
    ? items.value.filter((item) => item.name.toLowerCase().indexOf(query.toLowerCase()) != -1)
    : items.value
  // call callback function to return suggestions
  cb(results)
}
</script>

<template>
  <div class="admin-base-stats">
    <el-button v-if="item.id" @click="() => addBaseStat()" link>Add New Stat</el-button>
    <span>itemId: {{ item.id }}</span>
    <el-autocomplete
      v-if="!prefillItem?.id"
      ref="itemAutoCompleteRef"
      value-key="name"
      v-model="itemName"
      @focus.prevent="clearItem"
      clearable
      :fetch-suggestions="itemSearch"
      placeholder="Base item type"
      @select="handleSelectItem"
    />
  </div>
  <!-- <el-table v-if="!loading" :data="baseStats" style="width: 100%">
    <el-table-column width="240" prop="attributeId" label="attrId">
      <template #default="scope">
        <span>{{ getAttributeNameById(scope.row.attributeId) }}</span>
        <el-input size="small" v-model="scope.row.attributeId" />
      </template>
    </el-table-column>
    <el-table-column width="150" prop="min" label="min">
      <template #default="scope">
        <el-input-number size="small" v-model="scope.row.min" />
      </template>
    </el-table-column>
    <el-table-column width="150" prop="max" label="max">
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
        <el-button @click="() => removeBaseStat(scope.row)" link>Delete</el-button>
      </template>
    </el-table-column>
  </el-table> -->
</template>

<style scoped lang="scss">
.admin-base-stats {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
  font-weight: 600;
  align-items: center;
}
</style>
