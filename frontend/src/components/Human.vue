<script setup lang="ts">
import { ref } from 'vue'
import { QueryItemDto, Slot } from '../hooks'

defineProps<{ filterItem: QueryItemDto }>()
const slots = ref<Slot[]>([
  'Amulet',
  'Ring',
  'Cape',
  'Head',
  'Chest',
  'Gloves',
  'Legs',
  'Boots',
  'Weapon',
  'Utility'
])
</script>

<template>
  <div class="human">
    <div class="wrapper">
      <!-- <div class="img"></div> -->
      <div
        v-for="(slot, index) in slots"
        :key="index"
        :class="{
          'tat-frame': true,
          'darker-title': true,
          [slot.toLowerCase()]: true,
          active: filterItem.slot === slot
        }"
        @click="filterItem.slot = filterItem.slot === slot ? '' : slot"
      >
        {{ slot.substring(0, 1) }}
      </div>

      <div class="tat-frame no-hover item-description">
        <span><strong class="darker-title">A</strong>Amulet</span>
        <span><strong class="darker-title">B</strong>Boots</span>
        <span><strong class="darker-title">C</strong>Cape</span>
        <span><strong class="darker-title">C</strong>Chest</span>
        <span><strong class="darker-title">G</strong>Gloves</span>
        <span><strong class="darker-title">H</strong>Head</span>
        <span><strong class="darker-title">L</strong>Legs</span>
        <span><strong class="darker-title">R</strong>Ring</span>
        <span><strong class="darker-title">W</strong>Weapon</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$item-size: 30px;
$human-height: 430px;
$human-mobile-height: 500px;
$x-offset: 50px;
$y-offset: 35px;

.human {
  // height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 15px;
  background-image: url('@/assets/images/dummy.png');
  background-size: contain;
  background-repeat: no-repeat;

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
    font-size: 20px;
    box-shadow: var(--tat-frame-box-shadow);
  }

  .active {
    background-color: var(--color-text);
    color: var(--el-bg-color);
  }

  .item-description {
    padding: 1rem 0.6rem;
    right: 0px;
    bottom: 15px;
    min-width: 90px;
    min-height: 125px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;

    .darker-title {
      font-size: 13px;
    }

    span {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }

  .head {
    top: $y-offset;
    left: calc($x-offset + 133px);
  }

  .chest {
    top: calc($y-offset + 85px);
    left: calc($x-offset + 133px);
  }

  .ring {
    top: calc($y-offset + 95px);
    left: calc($x-offset + 230px);
  }

  .cape {
    top: calc($y-offset + 155px);
    left: calc($x-offset + 210px);
  }

  .amulet {
    top: calc($y-offset + 45px);
    left: calc($x-offset + 230px);
  }

  .gloves {
    top: calc($y-offset + 200px);
    left: calc($x-offset + 80px);
  }

  .weapon {
    top: calc($y-offset + 65px);
    left: $x-offset;
    height: 110px;
    width: 55px;
  }

  .boots {
    top: calc($y-offset + 350px);
    left: calc($x-offset + 133px);
  }

  .legs {
    top: calc($y-offset + 250px);
    left: calc($x-offset + 133px);
  }
}

@media (max-width: 420px) {
  .human {
    $item-mobile-size: 30px;
    $human-mobile-height: 350px;
    $x-mobile-offset: 40px;
    $y-mobile-offset: 30px;

    .wrapper {
      height: $human-mobile-height;
      width: var(--wrapper-mobile-width);
    }

    .tat-frame {
      width: $item-mobile-size;
      height: $item-mobile-size;
      font-size: 14px;
    }

    .item-description {
      right: 10px;
      bottom: 10px;
      min-width: 85px;
      min-height: 110px;
      font-size: 11px;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;

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

    .cape {
      top: calc($y-offset + 155px);
      left: calc($x-offset + 180px);
    }

    .chest {
      top: $y-mobile-offset + 100px;
      left: $x-mobile-offset + 130px;
    }

    .ring {
      top: $y-mobile-offset + 120px;
      left: $x-mobile-offset + 220px;
    }

    .amulet {
      top: $y-mobile-offset + 50px;
      left: $x-mobile-offset + 220px;
    }

    .gloves {
      top: $y-mobile-offset + 165px;
      left: $x-mobile-offset + 85px;
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
