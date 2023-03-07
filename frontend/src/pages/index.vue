<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
  <div class="index">
    <div class="logo">
      <img src="../assets/logo.png" alt="">
    </div>
    <div class="wrapper">
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

  </div>
</template>

<style scoped lang="scss">
.index {
  display: flex;
  align-items: center;
  flex-direction: column;
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
