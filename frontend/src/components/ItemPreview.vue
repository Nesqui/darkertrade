<script setup lang="ts">
import { onBeforeMount, PropType, ref } from 'vue'
import { Attribute, Item, QueryItemDto, Stat, truncate, initItemApi, useMoment } from '../hooks'
import { useAttributesStore } from '../store'
const itemApi = initItemApi()
const attributeStore = useAttributesStore()
const getAttributeNameById = attributeStore.getAttributeNameById
const moment = useMoment()

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
    },
    updatedAt: {
        required: false,
        type: String
    },
    creatorNickname: {
        required: false,
        type: String
    }
});
</script>

<template>
    <div class="item-preview">
        <div class="tat-frame" :class="{ 'no-hover': noHover }">
            <div class="offer-header" v-if="offerType">
                <label class="darker-title">{{ offerType }}</label>
                <div v-if="updatedAt" class="offer-header__item">
                    <span>Updated:</span>
                    <p class="offer-header__small"> {{ moment.fromNow(updatedAt) }}</p>
                </div>
                <div v-if="creatorNickname" class="offer-header__item">
                    <span>{{ offerType === 'WTS' ? 'Seller:' : 'Buyer:' }}</span>
                    <span class="offer-header__small">{{ creatorNickname }}</span>
                </div>
            </div>
            <div class="divider" v-if="offerType" />
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
$frameHeight: 220px;
$item-description-padding: .7rem .5rem;

.item-preview {
    .tat-frame {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        min-height: $frameHeight;
        width: var(--tat-frame-width);
        padding: var(--tat-frame-padding);
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

    .offer-header {
        width: 100%;
        text-align: center;


        &__item {
            font-size: 12px;
            align-items: center;
            display: flex;
            width: 100%;
            justify-content: space-between;
        }
    }


    .item-description {
        padding: unset;
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
