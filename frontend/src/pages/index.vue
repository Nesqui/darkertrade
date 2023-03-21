<script setup lang="ts">
import { ref } from 'vue'

const val = ref(+(Math.random() * 100).toFixed(0))
</script>

<template>
  <img src="@/assets/images/cleric.png" class="bg" alt="">

  <div class="index">
    <div class="paper">
      <div class="logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <h1 class="darker-title">Greetings, adventurer</h1>
      <p>Tool is designed to help with item sells or item buys, in a sense of a better market browser.
        We also have a suggestion system that can show and sort similar items, which you can use to find equally efficient
        stats.
        On top of that you can have WTB orders ready for you to always have supplies of item-sets for your dungeons. </p>
      <p>No data is collected from game, considering that Trade and Trader only lists items that are specifically posted
        on it. With the items that are posted users can browse and look for items they need using stat filters and create
        their buy orders of dream items.
      </p>
      <p>
        Trade and Trader allows WTS'ers to find WTB'ers for offers. and vice versa. We don't provide a selling platform,
        rather a faster and easier solution for finding both sides of transaction. Either mismatch of stats and//or bogus
        items should be discussed by seller and buyer between themselves.
      </p>
    </div>
    <svg>
      <filter id="wavy2">
        <feTurbulence x="0" y="0" baseFrequency="0.01" numOctaves="5" :seed="val" />
        <feDisplacementMap in="SourceGraphic" scale="25" />
      </filter>
    </svg>

  </div>
</template>

<style scoped lang="scss">
.bg {
  position: absolute;
  left: 200px;
  top: 0;
  height: 100%;
  opacity: 0.125;
  background-repeat: no-repeat;
  background-size: cover;
}

.index {
  display: flex;
  align-items: center;
  flex-direction: column;

  .paper {
    position: relative;
    padding: 4rem 4rem 4rem 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 900px;
  }

  .paper::before {
    // border-radius: 5px;
    scrollbar-gutter: stable both-edges;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 600px;
    // background: #fffef0;
    content: "";
    // background-color: var(--el-color-danger);
    filter: url(#wavy2);
    background-image: url(data:image/png;base64,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);
    // -webkit-box-shadow: 0px 5px 10px 2px rgba(63, 0, 113, 0.2);
    // -moz-box-shadow: 0px 5px 10px 2px rgba(63, 0, 113, 0.2);
    // box-shadow: 0px 5px 10px 2px rgba(63, 0, 113, 0.2);
    overflow-y: auto;
    max-height: 800px;
    outline: none;
    box-shadow: var(--tat-frame-box-shadow);
    // box-shadow: rgba(255, 255, 255, 0.25) 0px 0px 10px 6px;
    // box-shadow: 1px 1px 15px rgba(181, 181, 180, 0.635), 0 0 125px #3d38346b inset;
  }

  .wrapper {
    width: var(--wrapper-large-width);

    h1 {
      font-size: 20px;
    }

    p {
      font-family: "Solmoe";
      text-align: justify;
      font-size: 18px;
    }
  }

  .logo {
    img {
      width: 600px;
    }

    margin-bottom: 2rem;
  }
}
</style>
