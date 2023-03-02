<script setup lang="ts">
import { onBeforeMount, PropType, ref } from 'vue'
import { Attribute, Item, QueryItemDto, Stat, truncate, initItemApi } from '../hooks'
import { useAttributesStore } from '../store'
const itemApi = initItemApi()
const attributeStore = useAttributesStore()
const getAttributeNameById = attributeStore.getAttributeNameById

defineProps({
    item: {
        type: Object as PropType<Item>
    },
    stats: {
        type: Object as PropType<Stat[]>
    }, noHover: {
        type: Boolean,
        required: false,
    },
    offerType: {
        type: String as PropType<'WTB' | 'WTS'>,
        required: false,
    },
    wantedPrice: {
        required: false,
        type: Number
    }
});
</script>

<template>
    <div class="item-preview">
        <div class="item-frame" :class="{ 'no-hover': noHover }">
            <div class="offer-header" v-if="offerType">
                <label class="darker-title">{{ offerType }}</label>
            </div>
            <div class="divider" v-if="offerType"/>
            <div class="item-header">
                <label class="darker-title">{{ item?.name || 'Empty item' }}</label>
            </div>
            <div class="item-img">
                <img v-if="item?.id" :src="itemApi.getImg(item)" alt="">
                <div v-else class="img-avatar"></div>
            </div>
            <div class="divider" v-if="stats?.length"></div>
            <div class="item-description">
                <div v-for="(stat, index) in stats" :key="index" class="stat darker-title">
                    {{ stat.value > 0 ? `+${stat.value}` : stat.value }} {{
                        truncate(getAttributeNameById(stat.attributeId), 35) }}
                </div>
                <div class="divider"></div>
                <div class="stat">Slot: {{ item?.slot || 'Empty slot' }}</div>
                <div class="stat" v-if="wantedPrice">Wanted price: {{ wantedPrice }} gold</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$frameWidth: 240px;
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
        padding: 1rem .5rem;
    }

    .divider {
        width: 85%;
        border-bottom: 2px solid var(--el-border-color);
        margin-bottom: .25rem;
    }

    .item-img {
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            height: 80px;
        }
    }

    .darker-title {
        justify-content: center;
        display: flex;
    }

    .item-description {
        padding-top: .25rem;
        padding-left: unset;
        padding-right: unset;
        padding-bottom: unset;
        display: flex;
        flex-direction: column;
        gap: .75rem;
        font-size: 12px;
        width: 100%;
        align-items: center;

        .stat {
            font-size: 11px;
            font-weight: 800;
        }

        &__title {
            margin-bottom: .25rem;
        }
    }
}
</style>
