<script setup lang="ts">
import { ref } from "vue";
import { QueryItemDto, Slot } from "../hooks";

defineProps<{ filterItem: QueryItemDto }>()
const slots = ref<Slot[]>(['Amulet',
  'Ring',
  'Head',
  'Chest',
  'Gloves',
  'Legs',
  'Boots',
  'Weapon',])
</script>

<template>
  <div class="human">
    <img src="@/assets/images/dummy.png" alt="" class="bg">

    <div class="wrapper">
      <!-- <div class="img"></div> -->
      <div v-for="(slot, index) in slots" :key="index" :class="{
        'tat-frame': true,
        'darker-title': true,
        [slot.toLowerCase()]: true,
        'active': filterItem.slot === slot
      }" @click="filterItem.slot = filterItem.slot === slot ? '' : slot">{{ slot.substring(0, 1) }}</div>

      <div class="tat-frame no-hover item-description">
        <span><label class="darker-title">A</label>Amulet</span>
        <span><label class="darker-title">B</label>Boots</span>
        <span><label class="darker-title">C</label>Chest</span>
        <span><label class="darker-title">G</label>Gloves</span>
        <span><label class="darker-title">H</label>Head</span>
        <span><label class="darker-title">L</label>Legs</span>
        <span><label class="darker-title">R</label>Ring</span>
        <span><label class="darker-title">W</label>Weapon</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$item-size: 41px;
$human-height: 550px;

.human {
  // height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    left: 0;
    width: 100%;
    filter: brightness(50%);
    background-repeat: no-repeat;
    background-size: cover;
  }

  .wrapper {
    width: var(--wrapper-medium-width);
    height: $human-height;
    padding: 0;
    overflow: hidden;
    position: relative;
  }

  .tat-frame {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: $item-size;
    height: $item-size;
    font-size: 25px;
    box-shadow: var(--tat-frame-box-shadow);
  }

  .active {
    background-color: var(--color-text);
    color: var(--el-bg-color);
  }

  .item-description {
    left: 0px;
    bottom: 10px;
    min-width: 125px;
    min-height: 165px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: .2rem;

    span {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }

  .head {
    top: 40px;
    left: 215px;
  }

  .chest {
    top: 150px;
    left: 215px;
  }

  .ring {
    top: 150px;
    left: 310px;
  }

  .gloves {
    top: 285px;
    left: 150px;
  }

  .weapon {
    top: 100px;
    left: 70px;
    height: 140px;
    width: 75px;
  }

  .amulet {
    top: 77px;
    left: 310px;
  }

  .boots {
    top: 456px;
    left: 213px;
  }

  .legs {
    top: 365px;
    left: 213px;
  }

  // .img {
  //   background: url("../assets/images/dummy.png") no-repeat;
  //   width: var(--wrapper-medium-width);
  //   height: $human-height;
  //   background-position-x: center;
  //   background-position-y: center;
  // }
}
</style>
