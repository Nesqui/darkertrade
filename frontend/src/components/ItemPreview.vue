<script setup lang="ts">
import { computed, PropType } from 'vue'
import { Item, Stat, truncate, initItemApi, useMoment, BaseStat, VirtualStat, User } from '../hooks'
import { useAttributesStore, useItemStore, useUserStore } from '../store'
import NicknameOnline from './NicknameOnline.vue';

const itemApi = initItemApi()
const itemStore = useItemStore()
const attributeStore = useAttributesStore()
const getAttributeNameById = attributeStore.getAttributeNameById
const moment = useMoment()
const userStore = useUserStore()

const props = defineProps({
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
  creator: {
    type: Object as PropType<User>
  }
});

const baseStats = computed(() => {
  const item = itemStore.items.find(item => item.id === props.item?.id)
  const currentStatsLength = props.stats?.filter(item => !item.isBaseStat).length || 0
  if (item?.baseStats) {
    const flatStats = item.baseStats.filter(stat => !stat.inputRequired && stat.statsLength === 0)
    let computedStats: VirtualStat[] = []

    const requiredStats = item.baseStats.filter(stat => stat.inputRequired && stat.statsLength === currentStatsLength)

    const virtualStats = requiredStats.map(stat => {
      const foundStat = props.stats?.find(propStat => propStat.isBaseStat && propStat.attributeId === stat.attributeId)

      if (foundStat)
        return {
          min: foundStat.value,
          max: foundStat.value,
          inputRequired: true,
          attributeId: stat.attributeId,
          statsLength: stat.statsLength,
        }
      return stat
    })
    computedStats = [...virtualStats]
    return [...flatStats, ...computedStats]
  }
  return []
})

</script>

<template>
  <div class="item-preview">
    <div class="tat-frame" :class="{ 'no-hover': noHover }">
      <div class="offer-header">
        <div class="text-divider">
          <span :class="`darker-title ${wantedPrice ? 'rarity-' + stats?.filter(stat => !stat.isBaseStat).length: ''}`">
            {{ item?.name || 'Choose item type' }}</span>
        </div>
        <div v-if="offerType" class="offer-header__item">
          <span>Updated:</span>
          <p class="offer-header__small"> {{ moment.fromNow(updatedAt || new Date().toString()) }}</p>
        </div>
        <div v-if="offerType" class="offer-header__item">
          <span>{{ offerType === 'WTS' ? 'Seller:' : 'Buyer:' }}</span>
          <p class="offer-header__small">
            <NicknameOnline :user="creator || userStore.currentUser"/></p>
        </div>
        <div v-if="offerType" class="offer-header__item">
          <span>Market:</span>
          <strong class="offer-header__small">{{ offerType }}</strong>
        </div>
      </div>
      <div class="item-img">
        <img v-if="item?.id" :src="itemApi.getImg(item)" alt="">
        <div v-else class="img-avatar"></div>
      </div>
      <div class="item-description">
        <div class="base-stats" v-if="wantedPrice && baseStats.length">
          <div class="text-divider">base stats:</div>
          <span v-for="(stat, index) in baseStats" :key="index" class="base-stat rarity-0">
            {{ stat.min === stat.max ? stat.min : `${stat.min}-${stat.max}` }} {{
              truncate(getAttributeNameById(stat.attributeId), 35) }}
          </span>
        </div>
        <div class="stats" v-if="stats?.length">
          <div class="text-divider">Additional stats:</div>
          <span v-for="(stat, index) in stats.filter(stat => !stat.isBaseStat)" :key="index" class="stat darker-title rarity-2">
            {{ stat.value > 0 ? `+${stat.value}` : stat.value }} {{
              truncate(getAttributeNameById(stat.attributeId), 35) }}
          </span>
        </div>
        <div class="text-divider" v-if="!wantedPrice">Category</div>
        <div class="price" v-if="wantedPrice">
          <div class="text-divider"> Price</div>
          <span class="darker-title"> {{ wantedPrice }} gold</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$frameHeight: 160px;
$item-description-padding: .7rem .5rem;

.item-preview {
  .tat-frame {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    align-items: center;
    gap: 15px;
    min-height: $frameHeight;
    width: var(--tat-frame-width);
    padding: var(--tat-frame-padding);
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
    font-size: 11px;

    text-align: center;

    p,
    strong {
      margin: .1rem 0;
    }

    .text-divider {
      margin: .4rem 0;
      display: flex;
    }

    &__item {
      align-items: center;
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
  }

  .text-divider {
    margin: .5rem 0;
    font-size: 12px;
  }

  .item-description {
    padding: unset;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    font-family: "Solmoe";
    gap: .25rem;

    .base-stats,
    .stats {
      flex-direction: column;
      align-items: center;
      display: flex;
      width: 100%;
      gap: .25rem;

      .text-divider {
        margin: 1rem 0 1rem 0;
      }
    }

    .base-stat {
      font-size: 11px;
      opacity: 0.8;
    }

    .stat {
      font-size: 12px;
      font-weight: 600;
    }

    .price {
      width: 100%;

      .text-divider {
        margin: 1rem 0;
      }
    }

    &__title {
      margin-bottom: .25rem;
    }
  }
}
</style>
