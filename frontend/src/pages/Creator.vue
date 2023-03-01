<script setup lang="ts">
import { Stats } from 'fs';
import { computed, onBeforeMount, ref } from 'vue'
import { Item, QueryItemDto, initAttributesApi, Attribute, useItemApi, ExistingItem, Stat, StatSymbol, initExistingItemApi } from '../hooks'
import { useAttributesStore } from '../store/attributes';
import ItemPreview from '../components/ItemPreview.vue';

const attributeApi = initAttributesApi()
const attributeStore = useAttributesStore()
const attributes = attributeStore.attributes
const existingItemApi = initExistingItemApi()
const name = ref('')
const value = ref(1)
const valueRef = ref()
const symbol = ref<StatSymbol>('>=')
const stats = ref<Stat[]>([])
const attributeId = ref<number>(0)
const loading = ref(false)
const itemApi = useItemApi()

const items = ref<Item[]>([])

const item = ref<Item>({
    id: 0,
    slot: '',
    name: ''
})

const existingItem = computed((): ExistingItem => ({
    itemId: item.value.id!,
    stats: stats.value
}))

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

const itemSearch = (queryString: string, cb: any) => {
    const results = queryString
        ? items.value.filter(item => item.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
        : items.value
    // call callback function to return suggestions
    cb(results)
}

const attributeSearch = (queryString: string, cb: any) => {
    const results = queryString
        ? attributes.filter(attribute => attribute.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
        : attributes
    // call callback function to return suggestions
    cb(results)
}

const clearForm = () => {
    name.value = ''
    value.value = 1
    attributeId.value = 0
}

const addStat = () => {
    stats.value.push({
        attributeId: attributeId.value,
        value: value.value,
        symbol: symbol.value
    })

    clearForm()
}

const handleSelectItem = (chosenItem: Item) => {
    console.log(chosenItem);

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
        await existingItemApi.create(existingItem.value)
    } catch (error) {

    } finally {
        loading.value = false
    }
}

const clear = () => {
    item.value = {
        id: 0,
        slot: '',
        name: ''
    }
    stats.value = []
}

onBeforeMount(async () => {
    items.value = await itemApi.findAll({
        slot: ''
    })
})
</script>

<template>
    <div class="item-creator wrapper">
        <h2>Item creator</h2>
        <div class="item-creator__wrapper">
            <ItemPreview :item="item" :stats="stats" />
            <div v-if="!item.id" class="item-creator__item">
                <el-autocomplete value-key="name" v-model="item.name" :fetch-suggestions="itemSearch" clearable
                    placeholder="Item name" @select="handleSelectItem" />
            </div>
            <div v-else class="item-creator__attributes">
                <div class="item-creator__attributes__actions">
                    <el-autocomplete value-key="name" v-model="name" :fetch-suggestions="attributeSearch" clearable
                        placeholder="Stat name" @select="handleSelectAttribute" />
                    <el-input placeholder="Value" ref="valueRef" v-model="value" />

                    <el-select v-model="symbol" class="m-2" placeholder="Select">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                    <el-button size="large" :disabled="!attributeId" @click="addStat">Add</el-button>
                </div>
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

                <div class="item-creator__actions">
                    <el-button @click="clear" size="large">
                        Back</el-button>
                    <el-button :disabled="!stats.length || loading" @click="createExistingItem" size="large">Create
                        item</el-button>
                    <el-button :disabled="!stats.length || loading" @click="createExistingItem" size="large">Create item and
                        Publish</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.item-creator {
    width: 900px;

    &__wrapper {
        display: flex;
        gap: 1rem;
    }

    &__item {
        width: 100%;
    }

    &__attributes__actions {
        display: flex;
        gap: .25rem;
    }

    // CREATE AND PUBLISH BUTTONS
    &__actions {
        display: flex;
        justify-content: flex-end;
    }

    .stats {
        padding: 1rem 0 2rem 0;
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

    // .el-button {
    //     width: 100%;
    // }
}
</style>
