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
        <div class="wrapper">
            <div class="img"></div>
            <div v-for="(slot, index) in slots" :key="index" :class="{
                'tat-frame': true,
                'darker-title': true,
                [slot.toLowerCase()]: true,
                'active': filterItem.slot === slot
            }" @click="filterItem.slot = filterItem.slot === slot ? '' : slot">{{ slot.substring(0, 1) }}</div>

            <div class="tat-frame no-hover item-description">
                <span><label class="darker-title">A</label>Amulet</span>
                <span><label class="darker-title">R</label>Ring</span>
                <span><label class="darker-title">H</label>Head</span>
                <span><label class="darker-title">C</label>Chest</span>
                <span><label class="darker-title">G</label>Gloves</span>
                <span><label class="darker-title">L</label>Legs</span>
                <span><label class="darker-title">B</label>Boots</span>
                <span><label class="darker-title">W</label>Weapon</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$item-size: 50px;
$human-height: 600px;

.human {
    // height: 100%;
    // width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .wrapper {
        width: var(--wrapper-medium-width);
        height: $human-height;
        padding: 0;
        overflow: hidden;
    }

    .tat-frame {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: $item-size;
        height: $item-size;
        font-size: 25px;
    }

    .active {
        background-color: var(--color-text);
        color: var(--el-bg-color);
    }

    .item-description {
        left: 0px;
        bottom: 10px;
        min-width: 125px;
        min-height: 125px;
        font-size: 14px;
        display: flex;
        flex-direction: column;

        span {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }

    .head {
        top: 50px;
        left: 225px;
    }

    .chest {
        top: 160px;
        left: 225px;
    }

    .ring {
        top: 150px;
        left: 300px;
    }

    .gloves {
        top: 285px;
        left: 135px;
    }


    .weapon {
        top: 100px;
        left: 70px;
        height: 140px;
        width: 75px;
    }

    .amulet {
        top: 77px;
        left: 300px;
    }

    .boots {
        top: 496px;
        left: 223px;
    }

    .legs {
        top: 385px;
        left: 223px;
    }

    .img {
        background: url("../assets/human.png") no-repeat;
        filter: brightness(0) invert(7%);
        width: var(--wrapper-medium-width);
        height: $human-height;
        background-position-x: center;
        background-position-y: center;
    }
}
</style>
