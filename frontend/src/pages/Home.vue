<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { initAttributesApi, initWs } from '../hooks'
import { useUserStore, useAttributesStore } from '../store'
import AllChats from "../components/AllChats.vue";
import TopMenu from '../components/TopMenu.vue'

const ws = initWs()
const attributeApi = initAttributesApi()
const attributeStore = useAttributesStore()

onBeforeMount(async () => {
  const attributes = await attributeApi.findAll()
  attributeStore.saveAll(attributes)
})


onMounted(() => {
  ws.init()
});

</script>

<template>
  <div class="main">
    <TopMenu />
    <div class="main-wrapper">
      <!-- <div class="ws">connected: {{ connected }}</div> -->
      <router-view />
    </div>
    <AllChats />
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  position: relative;

  .main-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 4rem;
    justify-content: flex-start;
    align-items: center;
  }

  .ws {
    position: absolute;
    top: 55px;
    font-weight: 900;
  }
}
</style>
