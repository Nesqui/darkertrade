<script setup lang="ts">
import { onMounted, ref } from "vue";
import { io, Socket, ServerToClientEvents, ClientToServerEvents } from "socket.io-client";
import { useUserStore } from "../store";
import Chat from "../components/Chat.vue";
const userStore = useUserStore()
const connected = ref(false);

onMounted(() => {
  let socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(import.meta.env.VITE_WEBSOCKET_URL);
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

  socket.on('chatCreated', async (p) => {
    console.log('chatCreated', p);
  })

  socket.on("disconnect", () => {
    connected.value = false
    console.log('disconnect');
  });
});

</script>

<template>
  <div class="main">
    <router-view />
    <div class="ws">connected: {{ connected }}</div>
    <Chat/>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 100%;
  padding-top: 5rem;
  display: flex;
  align-items: start;
  justify-content: center;
  position: relative;

  .ws {
    position: absolute;
    top: 0;
    font-weight: 900;
  }
}
</style>
