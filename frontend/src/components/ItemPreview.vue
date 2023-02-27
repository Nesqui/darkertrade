<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Item, QueryItemDto, useItemApi } from '../hooks'
const itemApi = useItemApi()

const itemProp = defineProps<{ item: Item }>()
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
                <span><label>Slot:</label> {{ item.slot }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$frameWidth: 170px;
$frameHeight: 220px;
$item-description-padding: .7rem;

.item-preview {

    .item-frame {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        height: $frameHeight;
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
        font-size: 16px;
        padding: $item-description-padding;
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 5px;
        align-items: center;
        font-size: 12px;

        &__title {
            font-weight: 600;
        }
    }
}
</style>
