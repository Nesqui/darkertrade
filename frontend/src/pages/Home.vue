<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onUnmounted, ref } from 'vue'
import { initAttributesApi, initItemApi } from '../hooks'
import { useAttributesStore, useChatStore, useItemStore } from '../store'
import AllChats from "../components/AllChats.vue";
import TopMenu from '../components/TopMenu.vue'
import { ElNotification } from 'element-plus';
import useSocket from '@/hooks/ws';
const { connect, disconnect, isConnected, reconnect } = useSocket()
const attributeApi = initAttributesApi()
const attributeStore = useAttributesStore()
const reconnecting = ref(false)
const itemApi = initItemApi()
const itemStore = useItemStore()

onBeforeMount(async () => {
  const attributes = await attributeApi.findAll()
  attributeStore.saveAll(attributes)
  itemStore.saveAll(await itemApi.getBase())
  connect()
})


const changeActiveTab = async () => {
  if (document.visibilityState !== "hidden") {
    if (!isConnected.value)
      reconnect()
  }
}

const chatStore = useChatStore()

onUnmounted(() => {
  disconnect()
  document.removeEventListener("visibilitychange", changeActiveTab)
})

const forceReconnect = async () => {
  reconnecting.value = true
  try {
    if (!isConnected.value)
      reconnect()
  } catch (error) {
    ElNotification({
      message: 'Unfortunately chat service not responding. Please contact with us via discord'
    })
  }
  finally {
    reconnecting.value = false
  }
}

</script>

<template>
  <div class="main">
    <TopMenu />
    <div class="main-wrapper" :class="{
      'shifted': !!chatStore.expand.chats.length
    }">
      <router-view />
    </div>
    <AllChats v-if="isConnected" />
    <div v-else @click="forceReconnect" class="ws-error">{{
      reconnecting ? 'Reconnecting ...' : 'Chat offine. Try reconnect ? ' }}</div>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-x: hidden;

  .ws-error {
    position: fixed;
    cursor: pointer;
    color: var(--el-color-danger);
    bottom: 0;
    right: 0;
    background-color: var(--el-bg-color);
    border-radius: 5pt 0 0 0;
    width: 340px;
    z-index: 1;
    background-image: url(data:image/png;base64,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);
    box-shadow: 2px 3px 20px black,
      0 0 125px #000000 inset;
    border-top: 2px outset rgba(20, 22, 1, 0.05);
    border-left: 2px outset rgba(20, 22, 1, 0.05);
    padding: 1rem;
  }

  .main-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 2rem;
    justify-content: flex-start;
    align-items: center;
    transition: all .25s;
    position: relative;
  }

  .shifted {
    margin-left: -180px;
  }

  .ws {
    position: absolute;
    top: 55px;
    font-weight: 900;
  }

  @media (max-width:1600px) {
    .shifted {
      margin-left: -340px;
    }
  }

  @media (max-width:420px) {
    .shifted {
      margin-left: 0;
    }

    .main-wrapper {
      padding-top: 1rem;
      width: 100%;
      margin-bottom: 10rem;
    }
  }
}
</style>
