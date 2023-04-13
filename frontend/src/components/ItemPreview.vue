<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { Item, Stat, truncate, initItemApi, useMoment, BaseStat, VirtualStat, User, ItemName } from '../hooks'
import { useAttributesStore, useItemStore, useUserStore } from '../store'
import NicknameOnline from './NicknameOnline.vue';

const itemApi = initItemApi()
const itemStore = useItemStore()
const attributeStore = useAttributesStore()
const getAttributeNameById = attributeStore.getAttributeNameById
const getAttributeSymbolById = attributeStore.getAttributeSymbolById;
const moment = useMoment()
const userStore = useUserStore()

interface DivineItems {
  [key: string]: string;
  "Heater Shield": string;
  "Survival Bow": string;
  Halberd: string;
  "Horsemans Axe": string;
  Longsword: string;
  "Arming Sword": string;
  "Double Axe": string;
  Longbow: string;
  "Recurve Bow": string;
  "Morning Star": string;
  Rapier: string;
}

const divineItems: DivineItems = {
  "Heater Shield": "Can deflect projectile spells while in defensive stance. After the reflection is triggered, you remain able to reflect for 3 seconds, and cannot reflect again for 20 seconds after performing a spell reflection.",
  "Survival Bow": "When shooting a bow, the action speed is very fast and the arrow flies in a straight line.",
  "Halberd": "Hitting an enemy deals 10 additional magic damage and burns them for 3 seconds.",
  "Horsemans Axe": "Hitting the target will render them unable to receive any healing effects for 20 seconds.",
  "Longsword": "If you hit an enemy, summons a thunderbolt to deal 20 additional magic damage.",
  "Arming Sword": "15% Additional Dark Magical Damage.",
  "Double Axe": "When receiving a lethal attack, HP becomes 1 and becomes invincible for 2 seconds. This effect can only be triggered once during an adventure.",
  "Longbow": "Pushes the hit target back.",
  "Recurve Bow": "Hitting the target inflicts a disease that deals 12 magic damage for 3 seconds.",
  "Morning Star": "Crushes the enemy's armor with each hit, reducing the target's physical defense by -25%. Stacks up to 3 times.",
  "Rapier": "Hitting an enemy deals 2 additional magic damage, freezes them, and frostbites them for 10 seconds."
}

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
  rarity: {
    required: true,
    type: Number,
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
  // Поиск не виртуальных статов 
  // const currentStatsLength = props.stats?.filter(item => !item.isBaseStat).length || 0
  if (item?.baseStats) {
    // Статы которые выводятся просто (не требовали ввода данных юзера)
    const flatStats = item.baseStats.filter(stat => !stat.inputRequired && stat.statsLength === 0)
    let computedStats: VirtualStat[] = []

    const requiredStats = item.baseStats.filter(stat => stat.inputRequired && stat.statsLength === props.rarity)

    const virtualStats = requiredStats.map(stat => {
      const foundStat = props.stats?.find(propStat => propStat.isBaseStat && propStat.attributeId === stat.attributeId)

      if (foundStat)
        return {
          min: foundStat.value,
          max: foundStat.value,
          inputRequired: true,
          attributeId: stat.attributeId,
          statsLength: stat.statsLength
        }
      return stat
    })
    computedStats = [...virtualStats]
    return [...flatStats, ...computedStats]
  }
  return []
})


const getDivineItem = (name: ItemName): string => {
  return divineItems[name] || ''
}
</script>

<template>
  <div class="item-preview">
    <div class="tat-frame" :class="{ 'no-hover': noHover }">
      <div class="offer-header">
        <div class="text-divider">
          <!-- DIVINE NAME  -->
          <div v-if="item?.name && rarity === 5" class="item-name">
            <el-icon>
              <StarFilled />
            </el-icon>
            <span :class="`darker-title ${wantedPrice ? 'rarity-5' : ''}`">
              {{ item?.name || 'Choose item' }}</span>
            <el-icon>
              <StarFilled />
            </el-icon>
          </div>
          <!-- CLASSIC NAME  -->
          <div v-else>
            <span
              :class="`darker-title ${wantedPrice ? 'rarity-' + rarity : ''}`">
              {{ item?.name || 'Choose item' }}</span>
          </div>
        </div>

        <div v-if="offerType" class="offer-header__item">
          <span>Updated:</span>
          <p class="offer-header__small"> {{ moment.fromNow(updatedAt || new Date().toString()) }}</p>
        </div>
        <div v-if="offerType" class="offer-header__item">
          <span>{{ offerType === 'WTS' ? 'Seller:' : 'Buyer:' }}</span>
          <p class="offer-header__small">
            <NicknameOnline :user="creator || userStore.currentUser" />
          </p>
        </div>
        <div v-if="offerType" class="offer-header__item">
          <span>Market:</span>
          <strong class="offer-header__small">{{ offerType }}</strong>
        </div>
      </div>
      <div class="item-img">
        <img v-if="item?.id" :src="itemApi.getImg(item)" alt="">
        <div v-else class="img-avatar">?</div>
      </div>
      <div class="item-description">
        <div class="base-stats" v-if="wantedPrice && baseStats.length">
          <div class="text-divider">base stats:</div>
          <span v-for="(stat, index) in baseStats" :key="index" class="base-stat rarity-0">
            {{ truncate(getAttributeNameById(stat.attributeId), 35) }} {{ stat.min === stat.max ? stat.min :
              `${stat.min}-${stat.max}` }}{{ getAttributeSymbolById(stat.attributeId) }}
          </span>
        </div>
        <div class="stats" v-if="stats?.length">
          <div class="text-divider">Additional stats:</div>
          <span v-for="(stat, index) in stats.filter(stat => !stat.isBaseStat)" :key="index"
            class="stat darker-title rarity-2">
            {{ stat.value > 0 ? `+${stat.value}` : stat.value }}{{ getAttributeSymbolById(stat.attributeId) }} {{
              truncate(getAttributeNameById(stat.attributeId), 35) }}
          </span>
        </div>
        <div v-if="item?.name && stats?.filter(stat => !stat.isBaseStat).length === 5 && getDivineItem(item.name)"
          class="item-description__divine">
          <div class="text-divider">Description:</div>
          <p>{{ getDivineItem(item.name) }}</p>
        </div>
        <div class="text-divider" v-if="!wantedPrice">Category</div>
        <div class="price" v-if="wantedPrice">
          <div class="text-divider"> Price</div>
          <span class="darker-title"> {{ wantedPrice }} gold</span>
          <span class="darker-title"> {{ Math.ceil(wantedPrice / 50) }} purses</span>
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

  .img-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-bg-color);
    font-weight: 500;
    font-size: 34px;
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

    .item-name {
      display: flex;
      align-items: center;
      gap: .25rem;
    }

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

    &__divine {
      width: 100%;

      p {
        font-size: 11px;
        text-align: center;
        margin-bottom: unset;
      }
    }

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
