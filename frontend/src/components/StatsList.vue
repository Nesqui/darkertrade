<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import { Attribute, Stat } from '../hooks'
import { useAttributesStore } from '../store/attributes'
import { useRouter } from 'vue-router'

const props = defineProps({
  stats: {
    type: Array as PropType<Stat[]>,
    required: true
  }
})

const { attributes, getAttributeSymbolById, attributeSearch } = useAttributesStore()
const statPlaceHolder = ['Resourcefulness', 'Knowledge', 'Agility', 'Strength', 'Action Speed'][
  Math.floor(Math.random() * 5)
]

const emit = defineEmits(['deleteStat', 'clearAttribute', 'handleSelectAttribute'])

const additionalStatsAttributesName = ref<string[]>([])

watch(
  () => props.stats,
  () => {
    additionalStatsAttributesName.value = props.stats.map(
      (stat) => attributes.find((a) => a.id === stat.attributeId)?.name || ''
    )
  },
  {
    deep: true
  }
)

const attributeStore = useAttributesStore()
const valueRef = ref()

const handleSelectAttribute = (attribute: Attribute, stat: Stat) => {
  emit('handleSelectAttribute', {
    attribute,
    stat
  })
}

const clearAttribute = (stat: Stat) => {
  emit('clearAttribute', stat)
}

const deleteStat = (index: number) => {
  emit('deleteStat', index)
}
</script>

<template>
  <div class="stats-item" v-for="(stat, index) in stats" :key="index">
    <el-autocomplete
      @click="() => clearAttribute(stat)"
      value-key="name"
      v-model="additionalStatsAttributesName[index]"
      :fetch-suggestions="attributeSearch"
      clearable
      :placeholder="statPlaceHolder"
      @select="(attribute: Attribute) => handleSelectAttribute(attribute, stat)"
    />

    <div>
      <el-input-number
        :disabled="!attributeStore.getAttributeById(stat.attributeId)"
        :precision="1"
        :step="getAttributeSymbolById(stat.attributeId) ? 0.1 : 1"
        :min="-200"
        :max="200"
        placeholder="Value"
        maxlength="3"
        ref="valueRef"
        v-model="stat.value"
      />
    </div>

    <el-checkbox size="large" v-model="stat.isBase" label="Base" border></el-checkbox>

    <el-button size="large" @click="() => deleteStat(index)">Delete</el-button>
  </div>
</template>

<style scoped lang="scss">
.stats-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  gap: 1rem;
}

@media (max-width: 420px) {
  .stats {
    h3 {
      margin-bottom: 1rem;
    }
  }
}
</style>

<style lang="scss">
.item-creator {
  .el-input {
    height: var(--el-component-size);
  }

  .stats-item__base {
    .el-input {
      height: 35px;
    }
  }
}
</style>
