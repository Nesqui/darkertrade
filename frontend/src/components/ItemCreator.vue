<script setup lang="ts">
import { Stats } from 'fs';
import { onBeforeMount, ref } from 'vue'
import { Item, QueryItemDto, initAttributesApi, Attribute, useItemApi, ExistingItem, Stat, StatSymbol } from '../hooks'
import ItemPreview from './ItemPreview.vue';

const itemApi = useItemApi()

defineProps<{ item: Item }>()
const attributeApi = initAttributesApi()

const attributes = ref<Attribute[]>([])
const existingItem = ref<ExistingItem>({})

const name = ref('')
const value = ref(0)
const valueRef = ref()
const symbol = ref<StatSymbol>('>=')
const stats = ref<Stat[]>([])
const attributeId = ref<number>(0)

interface StatOption {
    value: StatSymbol
    label: StatSymbol
}

const options = ref<StatOption[]>([{
    value: '>=',
    label: '>=',
},
{
    value: '=',
    label: '=',
}])

const querySearch = (queryString: string, cb: any) => {
    const results = queryString
        ? attributes.value.filter(attribute => attribute.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
        : attributes.value
    // call callback function to return suggestions
    cb(results)
}

const clearData = () => {
    name.value = ''
    value.value = 0
    attributeId.value = 0
}

const addStat = () => {
    stats.value.push({
        attributeId: attributeId.value,
        value: value.value,
        symbol: symbol.value
    })

    clearData()
}

const handleSelect = (attribute) => {
    attributeId.value = attribute.id
    valueRef.value.focus()
}

const deleteStat = (index) => {
    stats.value.splice(index, 1)
}

onBeforeMount(async () => {
    attributes.value = await attributeApi.findAll()
})
</script>

<template>
    <div class="item-creator wrapper">
        <h2>Item creator</h2>
        <el-row justify="space-between">
            <el-col :span="6">
                <ItemPreview :item="item" />
            </el-col>
            <el-col :span="18">
                <el-row :gutter="7">
                    <el-col :span="8">
                        <el-autocomplete value-key="name" v-model="name" :fetch-suggestions="querySearch" clearable
                            placeholder="Stat name" @select="handleSelect" />
                    </el-col>
                    <el-col :span="6">
                        <el-input placeholder="Value" ref="valueRef" v-model="value" />
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="symbol" class="m-2" placeholder="Select">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="large" :disabled="!attributeId" @click="addStat">Add</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="7">
                    <el-col :span="24">
                        <div class="stats">
                            <h3 v-if="stats.length">Selected stats:</h3>
                            <div class="stats-item" v-for="(stat, index) in stats" :key="index">
                                <span class="stats-details">
                                    {{ (attributes.find(a => a.id === stat.attributeId))?.name }}
                                    {{ stat.symbol }}{{ stat.value }}
                                </span>
                                <el-button @click="() => deleteStat(index)">Delete</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped lang="scss">
.item-creator {
    .stats {
        padding: 1rem 0 .2rem 0;
    }

    .stats-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .25rem;
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
