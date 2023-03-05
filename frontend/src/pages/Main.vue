<script setup lang="ts">
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";

const connected = ref(false);
let socket;

onMounted(() => {
  socket = io(import.meta.env.VITE_WEBSOCKET_URL);

  socket.on("connect", () => {
    connected.value = true
  })

  socket.on("disconnect", () => {
    connected.value = false
  });
});

</script>

<template>
  <div class="main">
    <router-view />
    <div class="ws">connected: {{ connected }}</div>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 100%;
  padding-top: 5rem;
  display: flex;
  justify-content: center;
  position: relative;

  .ws {
    position: absolute;
    top: 0;
    font-weight: 900;
  }
}
</style>
