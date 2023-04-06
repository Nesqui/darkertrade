<script setup lang="ts">
import { useUserStore } from "@/store";
import { computed, ref } from "vue";

const userStore = useUserStore()
const isAuth = computed(() => userStore.isAuth)
</script>

<template>
  <img src="@/assets/images/library1.png" alt="" class="bg">
  <div class="faq wrapper">
    <div class="img-wrapper">
      <div class="text-divider">I want to buy</div>
      <img src="@/assets/images/wtb.png" alt="">
      <div class="text-divider">I want to sell</div>
      <img src="@/assets/images/wts.png" alt="">
      <div class="text-divider">Bids</div>
      <img src="@/assets/images/bid.png" alt="">
    </div>
    <div class="links">
      <router-link v-if="isAuth" to="/creator">Go to creator</router-link>
      <router-link to="/market">Go to market</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  opacity: 0.55;
  background-repeat: no-repeat;
  background-size: cover;
}

.links {
  width: 100%;
  padding-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 3rem;
  align-items: center;

  a {
    font-size: 20px;
  }
}

.text-divider {
  margin-top: unset;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 2rem;
}

.faq {
  width: var(--wrapper-xxl-width);

  .img-wrapper {
    width: 100%;
    text-align: center;

    img {
      height: 160px;
      margin-bottom: 1rem;
    }
  }
}


@media (max-width: 1255px) {
  .bg {
    left: 50%;
    width: unset;
    height: 100%;
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
        width: 90vw;
      }
    }
  }
}
</style>

