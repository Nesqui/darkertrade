<script setup lang="ts">
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
      <router-link to="/faq">How's it works?</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  opacity: 0.35;
  background-repeat: no-repeat;
  background-size: cover;
}

.index {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 7rem;
  overflow: hidden;

  h1 {
    font-size: 24px;
  }

  p {
    font-size: 18px;
  }

  a {
    font-size: 20px;
    margin-top: 2rem;
    text-decoration: underline;
  }

  .paper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 750px;
    overflow: hidden;
  }

  .logo {
    img {
      width: 600px;
    }

    margin-bottom: 2rem;
  }

}

@media (max-width:420px) {
  .bg {
    left: -100px;
    opacity: 0.2;
  }

  .logo {
    display: none;
  }

  .index {
    margin-top: 0;

    .wrapper {
      width: var(--wrapper-mobile-width);
    }

    .logo {
      img {
        width: var(--wrapper-mobile-width);
      }

      margin-bottom: 2rem;
    }

    .paper {
      width: var(--wrapper-mobile-width);

      p {
        margin: 1rem;
      }
    }

    .paper::before {
      height: unset;
      left: 0;
    }
  }
}
</style>
