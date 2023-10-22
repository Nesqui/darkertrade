<script setup lang="ts">
import { useUserStore } from '@/store'
import { computed, ref } from 'vue'

const userStore = useUserStore()
const isAuth = computed(() => userStore.isAuth)
</script>

<template>
  <img src="@/assets/images/library1.png" alt="" class="bg" />
  <div class="wrapper">
    <h2>About Trade and Trader</h2>
    <div class="faq">
      <div>
        <label for="">
          {{ new Date('4.14.2023').toLocaleDateString() }}
        </label>
        <iframe
          width="100%"
          height="300px"
          src="https://www.youtube.com/embed/6awDm91KD0U?si=W7GnbgGlgWYO4h31?showinfo=0&rel=0"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <div>
        <label for="">
          {{ new Date('4.13.2023').toLocaleDateString() }}
        </label>
        <iframe
          width="100%"
          height="300px"
          src="https://www.youtube.com/embed/KxaZJViRAKA?si=QnBHXueNN3BmXl3p?showinfo=0&rel=0"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  opacity: 0.1;
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 35px;

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
    padding: 0.5rem 2rem;

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

<style lang="scss"></style>
