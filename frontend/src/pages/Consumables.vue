<script setup lang="ts">
import { useUserStore } from '@/store'
import { computed, ref } from 'vue'

const userStore = useUserStore()
const isAuth = computed(() => userStore.isAuth)
const tableData = [
  {
    thresholds: [
      { amount: 5, price: 10 },
      { amount: 10, price: 9 },
      { amount: 15, price: 8 },
      { amount: 20, price: 7 }
    ],
    user: 'turboUser'
  },
  {
    thresholds: [
      { amount: 5, price: 10 },
      { amount: 10, price: 9 },
      { amount: 15, price: 8 },
      { amount: 20, price: 7 }
    ],
    user: 'turboUser'
  },
  {
    thresholds: [
      { amount: 5, price: 10 },
      { amount: 10, price: 9 },
      { amount: 15, price: 8 },
      { amount: 20, price: 7 }
    ],
    user: 'turboUser'
  }
]
</script>

<template>
  <img src="@/assets/images/library1.png" alt="" class="bg" />
  <div class="market-wrapper">
    <div class="offers-wrapper">
      <div class="text-divider">Sellers</div>
      <div v-for="(offer, index) in tableData" :key="index" class="offer wrapper">
        <div class="avatar-wrapper">{{ offer.user }}</div>
        <div class="prices">
          <div v-for="(threshold, pIndex) of offer.thresholds" :key="pIndex" class="prices-item">
            <span class="amount">{{ threshold.amount }}</span>
            <span class="price-divider">X</span>
            <span class="price darker-title">{{ `${threshold.price} G` }} </span>
          </div>
        </div>
        <el-input-number />
        <el-button>Send offer</el-button>
      </div>
    </div>
    <div class="wrapper selector-wrapper">
      <el-autocomplete placeholder="Healing Potion" />
      <div class="item-img">
        <img src="/items/60px-Cobalt_Ingot.png" alt="" />
      </div>
    </div>

    <div class="wrapper offers-wrapper">
      <div class="text-divider">Buyers</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.offer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.offer:not(:last-child) {
  margin-bottom: 8px;
}
.amount {
  text-align: left;
}
.price-divider {
  font-size: 10px;
  font-weight: 900;
}
.price {
  text-align: right;
  font-weight: 600;
}
.price,
.amount {
  width: 50px;
}
.prices-item {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 8px;
  background-color: var(--el-color-primary-light-3);
  gap: 20px;
}
.prices-item:not(:last-child) {
  margin-bottom: 4px;
}
.market-wrapper {
  gap: 26px;
  display: flex;
  justify-content: space-between;
  width: 90%;
}
.selector-wrapper {
  min-width: 180px;
  max-height: 180px;
}
.offers-wrapper {
  width: 100%;
}
.item-img {
  display: flex;
  padding: 16px 0;
  align-items: center;
  justify-content: center;

  img {
    height: 80px;
  }
}

.bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  opacity: 0.55;
  background-repeat: no-repeat;
  background-size: cover;
}

.links {
  width: 100%;
  padding-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 3rem;
  align-items: center;

  a {
    font-size: 20px;
  }
}

.text-divider {
  margin-top: unset;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 2rem;
}

@media (max-width: 1255px) {
  .bg {
    left: 50%;
    width: unset;
    height: 100%;
    transform: translateX(-48%);
  }

  .faq {
    padding: 0.5rem 2rem;

    .img-wrapper {
      display: flex;
      width: 100%;
      align-items: center;
      flex-direction: column;

      img {
        height: unset;
        width: 90vw;
      }
    }
  }
}
</style>
