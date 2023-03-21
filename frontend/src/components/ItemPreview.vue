<script setup lang="ts">
import { PropType } from 'vue'
import { Item, Stat, truncate, initItemApi, useMoment } from '../hooks'
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
        <label class="darker-title">{{ item?.name || 'Choose item type' }}</label>
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
        <div v-if="!wantedPrice">Category</div>
        <div class="divider" v-if="wantedPrice"></div>
        <div class="darker-title" v-if="wantedPrice">Price: {{ wantedPrice }} gold</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$frameHeight: 190px;
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

  .item-header {
    padding-top: .45rem;
    margin-bottom: 1rem;
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
    padding-top: .25rem;

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
