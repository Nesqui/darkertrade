<script setup lang="ts">
import { computed, nextTick, onBeforeMount, PropType, ref } from 'vue'
import { Item, Attribute, initItemApi, ExistingItem, Stat, initExistingItemApi, PrefillItem, initLimits, BaseStat, StatRecognition } from '../hooks'
import { useAttributesStore } from '../store/attributes';
import ItemPreview from '../components/ItemPreview.vue';
import { ElNotification } from 'element-plus';
import CountExistingItem from '../components/CountExistingItems.vue'
import { useRouter } from 'vue-router';
import { useItemStore } from '@/store';
import SimilarItems from '@/components/SimilarItems.vue';
import ImgRecognition from '@/components/ImgRecognition.vue';

const router = useRouter()

const statPlaceHolder = ['Resourcefulness', 'Knowledge', 'Agility', 'Strength', 'Action Speed'][Math.floor(Math.random() * 5)]
const attributeStore = useAttributesStore()
const getAttributeSymbolById = attributeStore.getAttributeSymbolById;
const attributeAutoCompleteRef = ref()
const attributes = attributeStore.attributes
const existingItemApi = initExistingItemApi()
const maxAttributes = 5
const attributeName = ref('')
const value = ref(1)
const wantedPrice = ref(100)
const offerType = ref<'WTB' | 'WTS' | 'screenshot'>('screenshot')
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
const discordNotification = ref(true)
const itemStore = useItemStore()
const colors = [
  'rgba(98, 190, 11)',
  'rgba(74, 155, 209, 1)',
  'rgba(173, 90, 255, 1)',
  'rgba(247, 162, 45, 1)',
  'rgba(227, 216, 140, 1)',
]
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

const selectedColor = ref('rgba(222, 222, 222, 1)')
const predefineColors = computed(() => {
  return colors.slice(stats.value.length, colors.length)
})

const rarity = computed(() => {
  const colorIndex = colors.findIndex(color => color === selectedColor.value)
  if (colorIndex !== -1)
    return colorIndex + 1
  return stats.value.filter(stat => !stat.isBaseStat).length;
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

const clearAttribute = () => {
  attributeName.value = ''
  requiredClear.value = true
}

const existingItem = computed((): ExistingItem => ({
  itemId: item.value.id!,
  stats: [...stats.value, ...virtualStats.value],
  published: published.value,
  wantedPrice: wantedPrice.value,
  offerType: offerType.value === 'screenshot' ? 'WTS' : offerType.value,
  discordNotification: discordNotification.value,
  rarity: rarity.value
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

const onChangeColor = () => {
  baseStatValue.value = getMinRequiredStat()
}

// Вывод минимального порога для ввода бейз стата
const getMinRequiredStat = () => {
  const currentItem = itemStore.items.find(currentItem => currentItem.id === item.value.id)
  if (!currentItem?.baseStats) {
    return 0
  }

  // const currentStatsLength = stats.value.length
  const requiredStats = currentItem.baseStats.filter(stat => stat.inputRequired && stat.statsLength == rarity.value)
  return requiredStats[0] ? requiredStats[0].min : 0
}

const addStat = () => {
  if (!addStatValidator.value) return
  stats.value.push({
    attributeId: attributeId.value,
    value: value.value,
    isBaseStat: false
  })
  clearForm()
  selectedColor.value = colors[stats.value.length - 1]
  baseStatValue.value = getMinRequiredStat()
}

const handleSelectItem = (chosenItem: Item) => {
  item.value = chosenItem
  itemAutoCompleteRef.value.inputRef.blur()
  baseStatValue.value = getMinRequiredStat()
}

const handleSelectAttribute = (attribute: Attribute) => {
  value.value = 1
  attributeId.value = attribute.id
  // valueRef.value.blur()
  attributeAutoCompleteRef.value.blur()
}

const onStatRecognitionFinished = (parsedStats: StatRecognition) => {
  // const countOfSkippedStats = parsedStats.splice(0, items.values.find(item => item)
  parsedStats.additional.forEach(stat => {
    stats.value.push({
      attributeId: stat.attributeId,
      value: stat.value,
      isBaseStat: false
    })
  })

  if (requiredBaseStats.value.length) {
    //TODO несколько бейз статов для ввода
    const stat = requiredBaseStats.value[0]
    const recognizedVirtalStat = parsedStats.base.find(parsedStat => parsedStat.attributeId === stat.attributeId)
    if (recognizedVirtalStat) {
      baseStatValue.value = recognizedVirtalStat.value
    }
  }

  offerType.value = 'WTS'
}

const deleteStat = (index: number) => {
  stats.value.splice(index, 1)
  baseStatValue.value = getMinRequiredStat()
  selectedColor.value = stats.value.length ? colors[stats.value.length - 1] : 'rgba(222, 222, 222, 1)'
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
  selectedColor.value = 'rgb(222,222,222)'
  item.value = {
    id: 0,
    slot: '',
    name: '',
    baseStats: []
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

const baseStatValue = ref(0)

// Массив бейз статов которые нужно ввести польователю 
const virtualStats = computed<Stat[] | []>(() => {
  if (requiredBaseStats.value.length && stats.value.length)
    return [{
      attributeId: requiredBaseStats.value[0].attributeId,
      value: baseStatValue.value,
      isBaseStat: true
    }]
  return []
})

// Массив бейз статов которые нужно ввести польователю 
const requiredBaseStats = computed<BaseStat[]>(() => {
  const currentItem = itemStore.items.find(currentItem => currentItem.id === item.value.id)
  if (!currentItem?.baseStats) {
    return []
  }

  // const currentStatsLength = stats.value.length
  const requiredStats = currentItem.baseStats.filter(stat => stat.inputRequired && stat.statsLength == rarity.value)
  return requiredStats
})


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
  <img src="@/assets/images/blacksmith3.png" alt="" class="bg" />
  <div class="creator">
    <div class="similar" v-if="!noWrapper">
      <h4>Similar items | WTB</h4>
      <SimilarItems :existing-item="existingItem" offer-type="WTB" />
    </div>

    <div class="item-creator" :class="{ 'wrapper': !noWrapper }">
      <el-tabs v-if="!prefillItem?.offerType" v-model="offerType">
        <el-tab-pane label="Screenshot" name="screenshot"></el-tab-pane>
        <el-tab-pane label="Create sell offer" name="WTS"></el-tab-pane>
        <el-tab-pane label="Create buy offer" name="WTB"></el-tab-pane>
      </el-tabs>


      <ImgRecognition v-show="offerType === 'screenshot'" @startRecognition="clear"
        @itemRecognitionFinished="handleSelectItem" @statRecognitionFinished="onStatRecognitionFinished" />

      <div v-show="offerType !== 'screenshot'" class="header">
        <div class="settings__discord">
          <el-switch v-model="discordNotification" size="large" active-text="On" inactive-text="Off" />
          <span>discord DM</span>
        </div>

        <CountExistingItem v-if="offerType !== 'screenshot'" :showOnly="offerType" />
      </div>
      <div v-show="offerType !== 'screenshot'" class="item-creator__wrapper">
        <div class="item-creator__item">
          <el-autocomplete v-if="!prefillItem?.id" ref="itemAutoCompleteRef" value-key="name" v-model="itemName"
            @focus.prevent="clearItem" clearable :fetch-suggestions="itemSearch" placeholder="Base item type"
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
          </div>
          <div class="item-creator__attributes__actions">
            <div>
              <div class="sub-title">
                Stat name:
              </div>
              <el-autocomplete @click="clearAttribute" ref="attributeAutoCompleteRef" value-key="name"
                v-model="attributeName" :fetch-suggestions="attributeSearch" clearable :placeholder=statPlaceHolder
                @select="handleSelectAttribute" />
            </div>
            <div>
              <div class="sub-title">
                Stat value:
              </div>
              <el-input-number :disabled="!attributeStore.getAttributeById(attributeId)" :precision="1"
                :step="getAttributeSymbolById(attributeId) ? 0.1 : 1"
                :min="attributeStore.getAttributeById(attributeId)?.min || -200"
                :max="attributeStore.getAttributeById(attributeId)?.max || 200" placeholder="Value" maxlength="3"
                ref="valueRef" v-model="value" />
            </div>
            <el-button size="large" :disabled="!addStatValidator" @click="addStat">Add</el-button>
          </div>
          <div class="stats">
            <h3 v-if="stats.length">Selected additional stats:</h3>
            <div class="stats-item" v-for="(stat, index) in stats" :key="index">
              <span class="stats-details">
                {{ (attributes.find(a => a.id === stat.attributeId))?.name }}
                {{ stat.value }}
              </span>
              <el-button @click="() => deleteStat(index)">Delete</el-button>
            </div>
          </div>

          <div v-if="stats.length && requiredBaseStats.length" class="stats">
            <h3>Base stats:</h3>
            <div class="stats-item__base" v-for="(stat, index) in requiredBaseStats" :key="index">
              <div>
                <span>{{ (attributes.find(a => a.id === stat.attributeId))?.name }}</span>
              </div>
              <div v-if="stat.min !== stat.max">
                <el-input-number :precision="1" :step="1" :min="stat.min" :max="stat.max" placeholder="Value"
                  maxlength="3" v-model="baseStatValue" />
              </div>
              <div>
                <span v-if="stat.min !== stat.max">
                  {{ stat.min }} - {{ stat.max }}
                </span>
                <span v-else>
                  {{ stat.min }}
                </span>
              </div>
            </div>
          </div>

          <div class="color-picker">
            Manual set rarity color (Optional):
            <el-color-picker v-model="selectedColor" @change="onChangeColor" show-alpha :predefine="predefineColors" />
          </div>
        </div>
        <ItemPreview v-if="offerType !== 'screenshot'" :rarity="rarity" :loading="loading" :item="item"
          :wantedPrice="wantedPrice" :offer-type="offerType" :no-hover="true" :stats="[...stats, ...virtualStats]" />
      </div>

      <div class="item-creator__actions" v-if="offerType !== 'screenshot'">
        <div class="create"
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

    <div class="similar" v-if="!noWrapper">
      <h4>Similar items | WTS</h4>
      <SimilarItems :existing-item="existingItem" offer-type="WTS" />
    </div>
  </div>
</template>

<style scoped lang="scss">
$maxHeight: 790px;

.similar {
  max-height: $maxHeight;
}

.bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  opacity: 0.25;
  background-repeat: no-repeat;
  background-size: cover;
}

h4 {
  font-size: 16px;
}

.creator {
  display: flex;
  gap: 2rem;
}

.settings__discord {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.item-creator {
  max-height: $maxHeight;
  width: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &__wrapper {
    position: relative;
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    max-height: 600px;
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

    &__base {
      display: flex;
      width: 100%;
    }
  }

  &__attributes__actions {
    align-items: flex-end;
    position: relative;
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
    position: relative;
  }

  .stats {
    padding: 1rem 0 .5rem 0;
    flex-grow: 1;
  }

  .stats-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .25rem;
  }

  .stats-item__base {
    display: flex;
    align-items: center;
    gap: 1rem;
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

@media (max-width:420px) {
  .item-creator {
    overflow-y: auto;
    max-height: unset;
  }

  .similar {
    display: none;
  }


  .stats {
    h3 {
      margin-bottom: 1rem;
    }
  }

  .bg {
    position: fixed;
    left: -400px;
    top: 0;
    width: unset;
    height: 100%;
    opacity: 0.25;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .restrictions {
    align-items: center;
  }

  .item-creator__wrapper {
    flex-direction: column;
    align-items: center;
    max-height: unset;
  }

  // CREATE AND PUBLISH BUTTONS
  .item-creator__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .create {
      display: flex;
      gap: 15px;
      flex-direction: column;
      align-self: unset;
      align-items: center;
      margin-bottom: 1rem;
    }

    .el-button+.el-button {
      margin: 0;
    }
  }
}
</style>

<style lang="scss">
.el-color-dropdown__main-wrapper,
.el-color-alpha-slider,
.el-color-dropdown__value {
  display: none;
}

.el-color-picker__panel {
  .el-color-dropdown__link-btn {
    display: none;
  }
}

.item-creator {
  .el-autocomplete {
    width: 100%;
  }

  .el-input {
    height: var(--el-component-size);
  }

  &__wrapper {
    max-height: unset;
  }

  .stats-item__base {
    .el-input {
      height: 35px;
    }
  }
}
</style>
