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

}


@media (max-width:420px) {
  .human {
    $item-mobile-size: 30px;
    $human-mobile-height: 500px;
    $x-mobile-offset: 35px;
    $y-mobile-offset: 35px;

    .wrapper {
      height: $human-mobile-height;
      width: var(--wrapper-mobile-width)
    }

    .tat-frame {
      width: $item-mobile-size;
      height: $item-mobile-size;
      font-size: 14px;
    }

    .item-description {
      left: 10px;
      bottom: 10px;
      min-width: 85px;
      min-height: 110px;
      font-size: 11px;
      display: flex;
      flex-direction: column;
      gap: .1rem;

      .darker-title {
        font-size: 12px;
      }

      span {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }

    .head {
      top: $y-mobile-offset;
      left: $x-mobile-offset + 130px;
    }

    .chest {
      top: $y-mobile-offset + 100px;
      left: $x-mobile-offset + 130px;
    }

    .ring {
      top: $y-mobile-offset+ 140px;
      left: $x-mobile-offset + 220px;
    }

    .amulet {
      top: $y-mobile-offset + 50px;
      left: $x-mobile-offset + 220px;
    }

    .gloves {
      top: $y-mobile-offset + 250px;
      left: $x-mobile-offset + 70px;
    }

    .weapon {
      top: $y-mobile-offset + 70px;
      left: $x-mobile-offset;
      height: 70px;
      width: 50px;
    }

    .boots {
      top: $y-mobile-offset + 290px;
      left: $x-mobile-offset + 130px;
    }

    .legs {
      top: $y-mobile-offset + 200px;
      left: $x-mobile-offset + 130px;
    }

  }
}
</style>
