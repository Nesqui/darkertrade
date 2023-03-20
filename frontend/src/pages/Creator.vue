<script setup lang="ts">
import { computed, nextTick, onBeforeMount, PropType, ref } from 'vue'
import { Item, Attribute, initItemApi, ExistingItem, Stat, initExistingItemApi, PrefillItem, initLimits } from '../hooks'
import { useAttributesStore } from '../store/attributes';
import ItemPreview from '../components/ItemPreview.vue';
import { ElNotification } from 'element-plus';
import CountExistingItem from '../components/CountExistingItems.vue'
import { useRouter } from 'vue-router';
const router = useRouter()

const attributeStore = useAttributesStore()
const attributes = attributeStore.attributes
const existingItemApi = initExistingItemApi()
const maxAttributes = 8
const attributeName = ref('')
const value = ref(1)
const wantedPrice = ref(100)
const offerType = ref<'WTB' | 'WTS'>('WTS')
const itemName = ref('')
const valueRef = ref()
const stats = ref<Stat[]>([])
const published = ref(false)
const attributeId = ref<number>(0)
const loading = ref(false)
const itemApi = initItemApi()
const limits = initLimits()
const items = ref<Item[]>([])
const itemAutoCompleteRef = ref()
const requiredClear = ref(false)
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
  name: ''
})

const clearItem = () => {
  itemName.value = ''
  itemAutoCompleteRef.value.inputRef.blur()
  requiredClear.value = true

  item.value = {
    id: 0,
    slot: '',
    name: ''
  }
}

const clearAttribute = () => {
  if (!itemAutoCompleteRef.value)
    return
  attributeName.value = ''
  itemAutoCompleteRef.value.inputRef.blur()
  requiredClear.value = true
}

const existingItem = computed((): ExistingItem => ({
  itemId: item.value.id!,
  stats: stats.value,
  published: published.value,
  wantedPrice: wantedPrice.value,
  offerType: offerType.value
}))

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

const attributeSearch = (queryString: string, cb: any) => {
  let results = attributes
  let query = queryString

  if (requiredClear.value) {
    query = requiredClear.value ? '' : queryString
    requiredClear.value = false
  }

  if (stats.value.length) {
    results = results.filter(attribute => !stats.value.find(stat => stat.attributeId === attribute.id))
  }

  results = query
    ? results.filter(attribute => attribute.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
    : results
  // call callback function to return suggestions
  cb(results)
}

const clearForm = () => {
  attributeName.value = ''
  itemName.value = ''
  value.value = 1
  attributeId.value = 0
}

const addStatValidator = computed(() => {
  if (stats.value.length >= maxAttributes) {
    return false
  }

  if (!attributeId.value || !value.value) {
    return false
  }

  if (stats.value.find(stat => stat.attributeId === attributeId.value)) {
    return false
  }

  return true
})

const addStat = () => {
  if (!addStatValidator.value) return
  stats.value.push({
    attributeId: attributeId.value,
    value: value.value,
  })
  clearForm()
}

const handleSelectItem = (chosenItem: Item) => {
  item.value = chosenItem
}

const handleSelectAttribute = (attribute: Attribute) => {
  attributeId.value = attribute.id
  valueRef.value.focus()
}

const deleteStat = (index: number) => {
  stats.value.splice(index, 1)
}

const createExistingItem = async () => {
  loading.value = true
  try {
    const resExistingItem = await existingItemApi.create(existingItem.value)
    if (resExistingItem?.user) {
      if (props.doAfterCreate) {
        await props.doAfterCreate(resExistingItem)
        return
      }
      router.push(`/user/${resExistingItem.user.nickname}/items/${resExistingItem.id}`)
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const createAndPublish = async () => {
  published.value = true
  await createExistingItem()
}

const clear = () => {
  item.value = {
    id: 0,
    slot: '',
    name: ''
  }
  stats.value = []
  prefillData()
}

const prefillData = () => {
  if (props.prefillItem) {
    item.value.id = props.prefillItem.id;
    item.value.name = props.prefillItem.name
    item.value.slot = props.prefillItem.slot
    offerType.value = props.prefillItem.offerType
  }
}

onBeforeMount(async () => {
  try {
    loading.value = true
    items.value = await itemApi.findAll({
      slot: ''
    })
    prefillData()
  } catch (error) {
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="item-creator" :class="{ 'wrapper': !noWrapper }">
    <el-tabs v-if="!prefillItem?.offerType" v-model="offerType">
      <el-tab-pane label="Create sell offer" name="WTS"></el-tab-pane>
      <el-tab-pane label="Create buy offer" name="WTB"></el-tab-pane>
    </el-tabs>
    <div class="restrictions">
      <p v-if="!limits.isLoading() && !limits.canCreateWtb()">You cant create more WTB items!</p>
      <p v-if="!limits.isLoading() && !limits.canCreateWts()">You cant create more WTS items!</p>
      <CountExistingItem />
    </div>
    <div class="item-creator__wrapper">
      <div class="item-creator__item">
        <el-autocomplete v-if="!prefillItem?.id" ref="itemAutoCompleteRef" value-key="name" v-model="itemName"
          @focus="clearItem" clearable :fetch-suggestions="itemSearch" placeholder="Base item type"
          @select="handleSelectItem" />
        <div v-if="!prefillItem?.offerType" class="item-creator__attributes__actions">
          <div class="labeled-switch">
            <!-- <label class="sub-title" for="">Offer type:</label> -->
          </div>
        </div>
        <div class="item-creator__attributes__line">
          <div>
            <div class="sub-title">
              {{ existingItem.offerType === 'WTB' ? `Declared maximum price:` : `Preferrable sell price:` }}
            </div>
            <el-input-number :step-strictly="true" :precision="0" :step="25" :min="25" :max="9999" type="number"
              placeholder="Wanted Price" maxlength="5" v-model.number="wantedPrice"></el-input-number>
          </div>
          <!-- <div>
                    <div class="sub-title">
                        Offer type:
                    </div>
                    <el-select v-model="offerType" placeholder="OfferType" style="width: 240px">
                        <el-option label="Want to sell" value="WTS" />
                        <el-option label="Want to buy" value="WTB" />
                    </el-select>
                </div> -->
          <!-- <el-switch v-model="offerType" size="large" active-value="WTB" inactive-value="WTS" active-text="WTB"
                      inactive-text="WTS" /> -->
          <!-- <el-button-group v-if="!prefillItem?.offerType">
                  <el-button size="large" :disabled="offerType === 'WTB'" @click="offerType = 'WTB'">Want to
                      buy</el-button>
                  <el-button size="large" :disabled="offerType === 'WTS'" @click="offerType = 'WTS'">
                      Want to sell
                  </el-button>
              </el-button-group> -->

        </div>
        <div class="item-creator__attributes__actions">
          <div>
            <div class="sub-title">
              Stat name:
            </div>
            <el-autocomplete @click="clearAttribute" value-key="name" v-model="attributeName"
              :fetch-suggestions="attributeSearch" clearable placeholder="Resourcefulness"
              @select="handleSelectAttribute" />
          </div>
          <div>
            <div class="sub-title">
              Stat value:
            </div>
            <el-input-number :precision="1" :step="1" :min="-200" :max="200" placeholder="Value" maxlength="3"
              ref="valueRef" v-model="value" />
          </div>
          <el-button size="large" :disabled="!addStatValidator" @click="addStat">Add</el-button>
        </div>
        <div class="stats">
          <h3 v-if="stats.length">Selected stats:</h3>
          <div class="stats-item" v-for="(stat, index) in stats" :key="index">
            <span class="stats-details">
              {{ (attributes.find(a => a.id === stat.attributeId))?.name }}
              {{ stat.value }}
            </span>
            <el-button @click="() => deleteStat(index)">Delete</el-button>
          </div>
        </div>
      </div>
      <ItemPreview :loading="loading" :item="item" :wantedPrice="wantedPrice" :offer-type="offerType" :no-hover="true"
        :stats="stats" />
    </div>


    <div class="item-creator__actions">
      <div
        v-if="(limits.canCreateWtb() && existingItem.offerType === 'WTB') || (limits.canCreateWts() && existingItem.offerType === 'WTS')">
        <el-button :disabled="!stats.length || !wantedPrice || !item.id || loading" @click="createAndPublish"
          size="large">{{ prefillItem ? 'Create item and make a bid' : 'Create public item' }}</el-button>
        <el-button v-if="!prefillItem" :disabled="!stats.length || loading || !item.id" @click="createExistingItem"
          size="large">Create private item</el-button>
      </div>
      <div v-else>
        <p>You can always delete some {{ existingItem.offerType }} offers via profile</p>
      </div>
      <el-button v-if="item.id || stats.length" @click="clear" size="large">
        Clear</el-button>

    </div>
  </div>
</template>

<style scoped lang="scss">
.item-creator {
  min-height: 460px;
  max-height: 750px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  &__wrapper {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    max-height: 540px;
    flex: 1;
  }

  .wrapper {
    width: var(--wrapper-large-width);
  }

  &__item {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: .7rem;
  }

  &__attributes {
    display: flex;
    flex-direction: column;
    width: 100%;

    &__line {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__attributes__actions {
    align-items: flex-end;
    // justify-content: flex-end;
    display: flex;
    gap: .55rem;
  }

  // CREATE AND PUBLISH BUTTONS
  &__actions {
    display: flex;
    justify-content: space-between;
    align-self: flex-end;
    width: 100%;
  }

  .stats {
    padding: 1rem 0 2rem 0;
    flex-grow: 1;
  }

  .stats-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .25rem;
  }

  .actions {
    display: flex;
    width: 100%;
    justify-content: end;
    padding-top: 2rem;
  }

  .stats-details {
    width: 100%;
  }
}
</style>

<style lang="scss">
.item-creator {
  .el-autocomplete {
    width: 100%;
  }

  .el-input {
    height: var(--el-component-size);
  }
}
</style>
