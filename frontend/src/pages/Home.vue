<script setup lang="ts">
import { io, Socket } from "socket.io-client";
import { onBeforeMount, onMounted, ref } from 'vue'
import { initAttributesApi } from '../hooks'
import { useUserStore, useAttributesStore } from '../store'
import Chat from "../components/Chat.vue";
import TopMenu from '../components/TopMenu.vue'

const userStore = useUserStore()
const connected = ref(false);

const attributeApi = initAttributesApi()
const attributeStore = useAttributesStore()

onBeforeMount(async () => {
  const attributes = await attributeApi.findAll()
  attributeStore.saveAll(attributes)
})

onMounted(() => {
  let socket: Socket = io(import.meta.env.VITE_WEBSOCKET_URL);
  socket.on("connect", async () => {
    console.log('connect');
    connected.value = true
    socket.emit("auth", {
      token: userStore.token
    })
  })

  socket.on('authRequired', async () => {
    console.log('authRequired');
  })

  socket.on('chatCreated', async () => {
    console.log('chatCreated');
  })

  socket.on("disconnect", () => {
    connected.value = false
    console.log('disconnect');
  });
});

</script>

<template>
  <div class="main">
    <TopMenu />
    <div class="main-wrapper">
      <div class="ws">connected: {{ connected }}</div>
      <router-view/>
    </div>
    <Chat />
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
    padding-top: 5rem;
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
