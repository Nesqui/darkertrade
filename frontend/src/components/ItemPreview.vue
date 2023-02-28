<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Attribute, Item, QueryItemDto, Stat, truncate, useItemApi } from '../hooks'
import { useAttributesStore } from '../store/attributes'
const itemApi = useItemApi()
const attributeStore = useAttributesStore()
const attributes = attributeStore.attributes

const getAttributeNameById = (attributeId: number) => {
    const currentAttribute = attributes.find(a => a.id === attributeId)
    if (!currentAttribute)
        return "Attribute not found!"
    return currentAttribute.name
}
defineProps<{ item: Item, stats: Stat[] }>();
</script>

<template>
    <div class="item-preview">
        <div class="item-frame">
            <div class="item-header">
                <label class="item-title">{{ item.name }}</label>
            </div>
            <div class="item-img"> <img :src="itemApi.getImg(item)" alt=""></div>
            <div class="item-description">
                <span class="item-description__title">Attributes:</span>
                <el-tooltip class="box-item" effect="dark" :content="getAttributeNameById(stat.attributeId)" placement="top"
                    v-for="(stat, index) in stats" :key="index">
                    <div class="stat">
                        {{ truncate(getAttributeNameById(stat.attributeId), 23) }}: {{ stat.value > 0 ? `+${stat.value}` : stat.value }}
                    </div>
                </el-tooltip>
                <div class="stat">Slot: {{ item.slot }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$frameWidth: 188px;
$frameHeight: 220px;
$item-description-padding: .7rem .5rem;

.item-preview {

    .item-frame {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        min-height: $frameHeight;
        width: $frameWidth;
    }

    .item-img {
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            height: 80px;
        }
    }

    .item-title {
        justify-content: center;
        padding: 0.5rem 1rem;
        display: flex;
    }

    .item-description {
        padding-right: 5px;
        display: flex;
        flex-direction: column;
        font-size: 12px;
        width: 100%;
        line-height: 15px;

        .stat {
            font-size: 11px;
            font-weight: 600;
        }

        &__title {
            margin-bottom: .25rem;
        }
    }
}
</style>
