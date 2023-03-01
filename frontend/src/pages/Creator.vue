<script setup lang="ts">
import { Stats } from 'fs';
import { computed, onBeforeMount, ref } from 'vue'
import { Item, QueryItemDto, initAttributesApi, Attribute, initItemApi, ExistingItem, Stat, initExistingItemApi } from '../hooks'
import { useAttributesStore } from '../store/attributes';
import ItemPreview from '../components/ItemPreview.vue';
import { ElNotification } from 'element-plus';
import router from '../router';

const attributeApi = initAttributesApi()
const attributeStore = useAttributesStore()
const attributes = attributeStore.attributes
const existingItemApi = initExistingItemApi()
const maxAttributes = 8
const name = ref('')
const value = ref(1)
const wantedPrice = ref(100)
const offerType = ref<'WTB' | 'WTS'>('WTB')

const valueRef = ref()
const stats = ref<Stat[]>([])
const published = ref(false)
const attributeId = ref<number>(0)
const loading = ref(false)
const itemApi = initItemApi()

const items = ref<Item[]>([])

const item = ref<Item>({
    id: 0,
    slot: '',
    name: ''
})

const existingItem = computed((): ExistingItem => ({
    itemId: item.value.id!,
    stats: stats.value,
    published: published.value,
    wantedPrice: wantedPrice.value,
    offerType: offerType.value
}))

const itemSearch = (queryString: string, cb: any) => {
    const results = queryString
        ? items.value.filter(item => item.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
        : items.value
    // call callback function to return suggestions
    cb(results)
}

const attributeSearch = (queryString: string, cb: any) => {
    let results = attributes

    if (stats.value.length) {
        results = results.filter(attribute => !stats.value.find(stat => stat.attributeId === attribute.id))
    }

    queryString
        ? results.filter(attribute => attribute.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
        : results
    // call callback function to return suggestions
    cb(results)
}

const clearForm = () => {
    name.value = ''
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
        const { user, id } = await existingItemApi.create(existingItem.value)
        router.push(`/user/${user?.nickname}/items/${id}`)
    } catch (error) {
        ElNotification({
            message: JSON.stringify(error)
        })
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
}

onBeforeMount(async () => {
    items.value = await itemApi.findAll({
        slot: ''
    })
})
</script>

<template>
    <div class="item-creator wrapper">
        <h2>Item creator | {{ offerType }}</h2>
        <div class="item-creator__wrapper">
            <div class="item-creator__item">
                <el-autocomplete value-key="name" v-model="item.name" clearable :fetch-suggestions="itemSearch"
                    placeholder="Item name" @select="handleSelectItem" />
                <div class="item-creator__attributes__actions">
                    <div>
                        <div class="sub-title">
                            Wanted price (Optional)
                        </div>
                        <el-input type="number" placeholder="Wanted Price" maxlength="5"
                            v-model.number="wantedPrice"></el-input>
                    </div>
                    <el-button size="large" v-if="offerType === 'WTS'" @click="offerType = 'WTB'">Want to buy</el-button>
                    <el-button size="large" v-if="offerType === 'WTB'" @click="offerType = 'WTS'">
                        Want to sell
                    </el-button>
                </div>
                <div class="item-creator__attributes__actions">
                    <div>
                        <div class="sub-title">
                            Stat name
                        </div>
                        <el-autocomplete value-key="name" v-model="name" :fetch-suggestions="attributeSearch" clearable
                            placeholder="Stat name" @select="handleSelectAttribute" />
                    </div>
                    <div>
                        <div class="sub-title">
                            Stat value
                        </div>
                        <el-input placeholder="Value" maxlength="3" ref="valueRef" v-model="value" />
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
            <ItemPreview :item="item" :wantedPrice="wantedPrice" :offer-type="offerType" :no-hover="true" :stats="stats" />
        </div>


        <div class="item-creator__actions">
            <div>
                <el-button :disabled="!stats.length || !wantedPrice || !item.id || loading" @click="createAndPublish"
                    size="large">Create
                    item
                    and
                    Publish</el-button>
                <el-button :disabled="!stats.length || loading || !item.id" @click="createExistingItem" size="large">Create
                    item</el-button>
            </div>
            <el-button v-if="item.id || stats.length" @click="clear" size="large">
                Clear</el-button>

        </div>
    </div>
</template>

<style scoped lang="scss">
.item-creator {
    width: 900px;

    &__wrapper {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    &__item {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: .25rem;
    }

    &__attributes {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    &__attributes__actions {
        align-items: flex-end;
        // justify-content: flex-end;
        display: flex;
        gap: .25rem;
    }

    // CREATE AND PUBLISH BUTTONS
    &__actions {
        display: flex;
        justify-content: space-between;
        align-self: flex-end;
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
