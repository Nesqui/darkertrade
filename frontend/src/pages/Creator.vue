<script setup lang="ts">
import { computed, nextTick, onBeforeMount, PropType, ref, watch } from 'vue'
import {
  Item,
  Attribute,
  initItemApi,
  ExistingItem,
  Stat,
  initExistingItemApi,
  PrefillItem,
  initLimits,
  // BaseStat,
  StatRecognition
} from '../hooks'
import { useAttributesStore } from '../store/attributes'
import ItemPreview from '../components/ItemPreview.vue'
import CountExistingItem from '../components/CountExistingItems.vue'
import { useRouter } from 'vue-router'
import SimilarItems from '@/components/SimilarItems.vue'
import ImgRecognition from '@/components/ImgRecognition.vue'
import StatsList from '@/components/StatsList.vue'
import { colors } from '../hooks'

const router = useRouter()

const statPlaceHolder = ['Resourcefulness', 'Knowledge', 'Agility', 'Strength', 'Action Speed'][
  Math.floor(Math.random() * 5)
]

const attributeStore = useAttributesStore()
const getAttributeSymbolById = attributeStore.getAttributeSymbolById
const attributeAutoCompleteRef = ref()
const existingItemApi = initExistingItemApi()
const maxAttributes = 10

const statForm = ref({
  attributeName: '',
  value: 1,
  isBase: true
})

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

const selectedColor = ref('rgba(222, 222, 222, 1)')
const predefineColors = computed(() => {
  return colors.slice(stats.value.length, colors.length)
})

const rarity = computed(() => {
  const colorIndex = colors.findIndex((color) => color === selectedColor.value)
  if (colorIndex !== -1) return colorIndex + 1
  return stats.value.filter((stat) => !stat.isBase).length
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

const clearAttribute = (stat?: Stat) => {
  statForm.value.attributeName = ''
  requiredClear.value = true
}

const existingItem = computed(
  (): ExistingItem => ({
    itemId: item.value.id!,
    stats: [...stats.value],
    published: published.value,
    wantedPrice: wantedPrice.value,
    offerType: offerType.value === 'screenshot' ? 'WTS' : offerType.value,
    discordNotification: discordNotification.value,
    rarity: rarity.value
  })
)

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

const clearForm = () => {
  statForm.value.attributeName = ''
  itemName.value = ''
  statForm.value.value = 1
  statForm.value.isBase = false
  attributeId.value = 0
}

const addStatValidator = computed(() => {
  if (stats.value.length >= maxAttributes) {
    return false
  }

  if (!attributeId.value || !statForm.value.value) {
    return false
  }

  // Одинаковые статы доступны для выбора
  // if (stats.value.find((stat) => stat.attributeId === attributeId.value)) {
  //   return false
  // }

  return true
})

const addStat = () => {
  if (!addStatValidator.value) return
  stats.value.push({
    attributeId: attributeId.value,
    value: statForm.value.value,
    isBase: false
  })
  clearForm()
  selectedColor.value = colors[stats.value.length - 1]
}

const handleSelectItem = (chosenItem: Item) => {
  item.value = chosenItem
  itemAutoCompleteRef.value.inputRef.blur()
}

const handleSelectAttribute = ({ attribute, stat }: { attribute: Attribute; stat?: Stat }) => {
  if (stat) {
    stat.attributeId = attribute.id
    return
  }
  statForm.value.value = 1
  attributeId.value = attribute.id
  // valueRef.value.blur()
  attributeAutoCompleteRef.value.blur()
}

const onStatRecognitionFinished = (parsedStats: StatRecognition) => {
  // const countOfSkippedStats = parsedStats.splice(0, items.values.find(item => item)
  ;[parsedStats.additional, parsedStats.base].forEach((statsParsed) => {
    statsParsed.forEach((stat) =>
      stats.value.push({
        attributeId: stat.attributeId,
        value: stat.value,
        isBase: stat.isBase
      })
    )
  })

  offerType.value = 'WTS'
}

const deleteStat = (index: number) => {
  stats.value.splice(index, 1)
  selectedColor.value = stats.value.length
    ? colors[stats.value.length - 1]
    : 'rgba(222, 222, 222, 1)'
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
    console.log('🚀 ~ file: Creator.vue:271 ~ createExistingItem ~ error:', error)
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
    name: ''
    // baseStats: []
  }
  stats.value = []
  prefillData()
}

const prefillData = () => {
  if (props.prefillItem) {
    item.value.id = props.prefillItem.id
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
    console.log('🚀 ~ file: Creator.vue:353 ~ onBeforeMount ~ error:', error)
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

    <div class="item-creator" :class="{ wrapper: !noWrapper }">
      <div class="item-creator__tabs">
        <el-tabs class="w-100" v-if="!prefillItem?.offerType" v-model="offerType">
          <el-tab-pane label="Screenshot" name="screenshot"></el-tab-pane>
          <el-tab-pane label="Create sell offer" name="WTS"></el-tab-pane>
          <el-tab-pane label="Create buy offer" name="WTB"></el-tab-pane>
        </el-tabs>
        <div class="settings__discord">
          <el-switch
            v-model="discordNotification"
            size="large"
            active-text="On"
            inactive-text="Off"
          />
        </div>
      </div>

      <ImgRecognition
        v-show="offerType === 'screenshot'"
        @startRecognition="clear"
        @itemRecognitionFinished="handleSelectItem"
        @statRecognitionFinished="onStatRecognitionFinished"
      />

      <div v-show="offerType !== 'screenshot'" class="item-creator__wrapper">
        <div class="item-creator__form">
          <div>
            <label>Select item:</label>
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

          <div class="item-creator__attributes__line">
            <div>
              <label>
                {{
                  existingItem.offerType === 'WTB'
                    ? `Declared maximum price:`
                    : `Preferrable sell price:`
                }}
              </label>
              <el-input-number
                :step-strictly="true"
                :precision="0"
                :step="25"
                :min="25"
                :max="9999"
                type="number"
                placeholder="Wanted Price"
                maxlength="5"
                v-model.number="wantedPrice"
              ></el-input-number>
            </div>
          </div>
          <div class="stats-item">
            <div class="w-100">
              <label>Stat name:</label>
              <el-autocomplete
                @click="clearAttribute"
                ref="attributeAutoCompleteRef"
                value-key="name"
                v-model="statForm.attributeName"
                :fetch-suggestions="attributeStore.attributeSearch"
                clearable
                :placeholder="statPlaceHolder"
                @select="(attribute: Attribute) => handleSelectAttribute({attribute})"
              />
            </div>
            <div>
              <label>Stat value:</label>
              <el-input-number
                :disabled="!attributeStore.getAttributeById(attributeId)"
                :precision="1"
                :step="getAttributeSymbolById(attributeId) ? 0.1 : 1"
                :min="attributeStore.getAttributeById(attributeId)?.min || -200"
                :max="attributeStore.getAttributeById(attributeId)?.max || 200"
                placeholder="Value"
                maxlength="3"
                ref="valueRef"
                v-model="statForm.value"
              />
            </div>
            <el-checkbox size="large" v-model="statForm.isBase" label="Base" border></el-checkbox>

            <el-button size="large" :disabled="!addStatValidator" @click="addStat">Add</el-button>
          </div>
          <div class="stats">
            <label v-if="stats.length">Stats:</label>
            <StatsList
              :stats="stats"
              @deleteStat="deleteStat"
              ,
              @clearAttribute="clearAttribute"
              @handleSelectAttribute="handleSelectAttribute"
            />
          </div>

          <div class="color-picker">
            Manual set rarity color (Optional):
            <el-color-picker v-model="selectedColor" show-alpha :predefine="predefineColors" />
          </div>
        </div>

        <div>
          <ItemPreview
            v-if="offerType !== 'screenshot'"
            :rarity="rarity"
            :loading="loading"
            :item="item"
            :wantedPrice="wantedPrice"
            :offer-type="offerType"
            :no-hover="true"
            :stats="[...stats]"
            class="mb-1"
          />
          <el-button class="w-100 mb-1" v-if="item.id || stats.length" @click="clear" size="large">
            Clear</el-button
          >

          <div
            v-show="offerType !== 'screenshot'"
            class="d-flex align-center justify-space-between"
          >
            <span>Limits:</span>
            <CountExistingItem v-if="offerType !== 'screenshot'" :showOnly="offerType" />
          </div>
        </div>
      </div>

      <div class="item-creator__footer" v-if="offerType !== 'screenshot'">
        <div
          class="create"
          v-if="
            (limits.canCreateWtb() && existingItem.offerType === 'WTB') ||
            (limits.canCreateWts() && existingItem.offerType === 'WTS')
          "
        >
          <el-button
            :disabled="!stats.length || !wantedPrice || !item.id || loading"
            @click="createAndPublish"
            size="large"
            >{{ prefillItem ? 'Create item and make a bid' : 'Create public item' }}</el-button
          >
          <el-button
            v-if="!prefillItem"
            :disabled="!stats.length || loading || !item.id"
            @click="createExistingItem"
            size="large"
            >Create private item</el-button
          >
        </div>
        <div v-else>
          <p>You can always delete some {{ existingItem.offerType }} offers via profile</p>
        </div>
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

.item-creator {
  max-height: $maxHeight;
  width: 100%;
  min-width: 1020px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &__tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--el-border-color);
    margin-bottom: 15px;
  }

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

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

  .stats-item {
    align-items: flex-end;
    position: relative;
    justify-content: flex-end;
    display: flex;
    gap: 1rem;
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
    padding: 1rem 0 0.5rem 0;
    flex-grow: 1;
  }

  .actions {
    display: flex;
    width: 100%;
    justify-content: end;
    padding-top: 2rem;
  }
}

@media (max-width: 420px) {
  .item-creator {
    overflow-y: auto;
    max-height: unset;
    min-width: unset;
  }

  .similar {
    display: none;
  }

  .stats {
    label {
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
  .item-creator__footer {
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

    .el-button + .el-button {
      margin: 0;
    }
  }
}
</style>

<style lang="scss">
.item-creator {
  .el-autocomplete {
    width: 100%;
  }

  &__tabs {
    .el-tabs__header {
      margin-bottom: unset;
    }
    .el-tabs__nav-wrap::after {
      background-color: unset;
    }
  }

  &__form {
    button {
      width: 100px;
    }
  }

  .el-input {
    height: var(--el-component-size);
  }

  &__wrapper {
    max-height: unset;
  }
}
</style>
