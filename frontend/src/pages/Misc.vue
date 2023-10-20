<script setup lang="ts">
import MiscOffer from '../components/MiscOffer.vue'

const itemId = 133
</script>

<template>
  <img src="@/assets/images/library1.png" alt="" class="bg" />
  <div class="market-wrapper">
    <MiscOffer offerType="WTS" :itemId="itemId" />

    <div class="wrapper selector-wrapper">
      <el-autocomplete placeholder="Healing Potion" />
      <div class="item-img">
        <img src="/items/60px-Cobalt_Ingot.png" alt="" />
      </div>
    </div>

    <MiscOffer offerType="WTB" :itemId="itemId" />
  </div>
</template>

<style scoped lang="scss">
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

@media (max-width: 1255px) {
  .bg {
    left: 50%;
    width: unset;
    height: 100%;
    transform: translateX(-48%);
  }
}
</style>
