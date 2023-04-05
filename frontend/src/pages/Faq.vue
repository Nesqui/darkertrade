<script setup lang="ts">
import { ref } from "vue";

const activeName = ref('WTS')
</script>

<template>
  <img src="@/assets/images/library.png" alt="" class="bg">
  <div class="faq">
    <div class="img-wrapper">
      <h2>I want to buy</h2>
      <img src="@/assets/images/wtb.png" alt="">
      <h2>I want to sell</h2>
      <img src="@/assets/images/wts.png" alt="">
      <h2>Bids</h2>
      <img src="@/assets/images/bid.png" alt="">
    </div>
    <div class="links">
      <router-link to="/creator">Go to creator</router-link>
      <router-link to="/market">Go to market</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  opacity: 0.45;
  background-repeat: no-repeat;
  background-size: cover;
}

.links {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;

  a {
    font-size: 20px;
  }
}

h2 {
  text-transform: uppercase;
  margin-bottom: 2rem;
}


.faq {
  width: var(--wrapper-xxl-width);

  .img-wrapper {
    padding-top: 1rem;

    img {
      height: 160px;
      margin-bottom: 2rem;
    }
  }
}


@media (max-width: 1255px) {
  .bg {
    left: 50%;
    transform: translateX(-48%);
  }

  .faq {
    padding: .5rem 2rem;

    .img-wrapper {
      display: flex;
      width: 100%;
      align-items: center;
      flex-direction: column;

      img {
        height: unset;
        width: 95vw;
      }
    }
  }
}
</style>

