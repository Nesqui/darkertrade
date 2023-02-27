<script setup lang="ts">
import { Item } from "../hooks";

defineProps<{ item: Item }>()
</script>

<template>
    <div class="human">
        <div class="wrapper">
            <div class="img"></div>

            <div @click="item.slot = 'Amulet'" class="item-frame item-title amulet">A</div>
            <div @click="item.slot = 'Ring'" class="item-frame item-title ring">R</div>
            <div @click="item.slot = 'Head'" class="item-frame item-title head">H</div>
            <div @click="item.slot = 'Chest'" class="item-frame item-title chest">C</div>
            <div @click="item.slot = 'Legs'" class="item-frame item-title legs">L</div>
            <div @click="item.slot = 'Foots'" class="item-frame item-title foots">F</div>
            <div @click="item.slot = 'Weapon'" class="item-frame item-title weapon">W</div>
            <div class="item-frame item-description">
                <span><label class="item-title">A</label>Amulet</span>
                <span><label class="item-title">R</label>Ring</span>
                <span><label class="item-title">H</label>Head</span>
                <span><label class="item-title">C</label>Chest</span>
                <span><label class="item-title">L</label>Legs</span>
                <span><label class="item-title">F</label>Foots</span>
                <span><label class="item-title">W</label>Weapon</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$item-size: 50px;
$human-height: 600px;
$human-width: 500px;

.human {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .wrapper {
        width: $human-width;
        height: $human-height;
        padding: 0;
    }

    .item-frame {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: $item-size;
        height: $item-size;
        font-size: 25px;
    }

    .item-description {
        right: 5px;
        bottom: 5px;
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
        left: 220px;
    }

    .chest {
        top: 160px;
        left: 220px;
    }

    .ring {
        top: 290px;
        left: 130px;
    }


    .weapon {
        top: 100px;
        left: 65px;
        height: 140px;
        width: 75px;
    }

    .amulet {
        top: 77px;
        left: 295px;
    }

    .foots {
        top: 496px;
        left: 218px;
    }

    .legs {
        top: 385px;
        left: 218px;
    }

    .img {
        background: url("../assets/human.png") no-repeat;
        filter: brightness(0) invert(15%);
        width: $human-width;
        height: $human-height;
        background-position-x: center;
        background-position-y: center;
    }
}
</style>
