<script setup lang="ts">
import { Chat, ChatsCountsResponse, ChatsResponse, initWs } from "@/hooks";
import { useUserStore } from "@/store";
import { onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const selectedChat = ref()
const push = async (url: string) => {
  await router.push({
    path: '/redirect'
  })
  let redirect = false
  if (route.path === url) {
    redirect = true
  }
  await router.push({
    path: url
  })
  if (redirect)
    router.go(0)
}

const expand = ref({
  chats: false,
  sentOffers: false,
  receiveOffers: false
})
const showBid = ref(false)
const counts = ref<ChatsCountsResponse>()
const groups = ref<ChatsResponse>()

const { sendWS, socket } = initWs()

const props = defineProps({
  connected: {
    type: Boolean,
    required: true
  }
})

const onChatsCountsReceived = async (data: ChatsCountsResponse) => {
  counts.value = data
}

const onChatsReceived = async (data: ChatsResponse) => {
  groups.value = data
}

watch(() => props.connected, () => {
  if (props.connected) {
    sendWS("countAllChat")
    socket.value.on('chatsCountsReceived', onChatsReceived)
  }
})

onBeforeMount(() => {
  sendWS("countAllChat")
  socket.value.on('chatsCountsReceived', onChatsCountsReceived)
  socket.value.on('chatsReceived', onChatsReceived)
})

const loadChats = (opened: number) => {
  if (opened) {
    sendWS("findAllChat")
  }
}

const initChat = async (chatId: number) => {
  sendWS("getChat", { chatId })
}

</script>

<template>
  <div class="chat">

    <!-- ALL CHAT BUTTON  -->
    <el-collapse accordion v-model="expand.chats" @change="loadChats">
      <el-collapse-item class="el-collapse-item__header__first"
        :title="`Chats | Sent - ${counts?.sentOffers} | Received - ${counts?.receivedOffers}`" name="1">
        <div v-if="!selectedChat">
          <!-- OFFER TYPES - RECEIVED OFFERS -->
          <el-collapse v-if="groups?.receivedOffers.length" accordion v-model="expand.receiveOffers" @change="loadChats">
            <el-collapse-item class="" title="Received offers" name="1">
              <div v-for="(existingItem, index) in groups.receivedOffers" :key="index">

                <!-- EXISTING ITEMS  -->
                <el-collapse v-if="groups?.receivedOffers" accordion>
                  <el-collapse-item v-for="(bid, kIndex) in existingItem.bids" :key="kIndex" class="item"
                    :name="existingItem.item?.name">
                    <template #title>
                      <div class="item-name">
                        <span class="darker-title">
                          {{ existingItem.item?.name }}
                        </span>
                        <el-button
                          :class="{ 'icon-active': route.path === `/user/${userStore.currentUser.nickname}/items/${existingItem.id}` }"
                          @click.stop="push(`/user/${userStore.currentUser.nickname}/items/${existingItem.id}`)"
                          circle><el-icon>
                            <View />
                          </el-icon></el-button>
                      </div>
                    </template>

                    <!-- CHATS  -->
                    <div class="bid" @click="initChat(bid.chatId)">
                      <strong>{{ bid.user.nickname }}</strong> <span>{{ bid.price }} gold</span>
                    </div>

                  </el-collapse-item>
                </el-collapse>

              </div>
            </el-collapse-item>
          </el-collapse>

          <el-collapse v-if="groups?.sentOffers.length" accordion v-model="expand.sentOffers" @change="loadChats">
            <el-collapse-item class="" title="Sent offers" name="1">

            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="selected-chat" v-else>
          <div class="selected-chat__messages">
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
          </div>
          <div class="message-input">
            <el-input placeholder="input text"></el-input>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="scss">
.chat {
  background-color: var(--el-bg-color);
  color: var(--el-color-primary);
  border-radius: 5pt 0 0 0;
  outline: none;
  width: 350px;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1;
  border-top: 2px outset rgba(20, 22, 1, 0.05);
  border-left: 2px outset rgba(20, 22, 1, 0.05);
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpWWB67c2BUFb3g557T/hRo9/WUMZHlgr4Bg8Z4qQgQJlHI4A8SzFVrapvmTF9O7dmYRFZ60YiBhJRCgh1FYhiLAmdvX0CzTOpNE77ME0Zty/nWWzchDtiqrmQDeuv3powQ5ta2eN0FY0InkqDD73lT9c9lEzwUNqgFHs9VQce3TVClFCQrSTfOiYkVJQBmpbq2L6iZavPnAPcoU0dSw0SUTqz/GtrGuXfbyyBniKykOWQWGqwwMA7QiYAxi+IlPdqo+hYHnUt5ZPfnsHJyNiDtnpJyayNBkF6cWoYGAMY92U2hXHF/C1M8uP/ZtYdiuj26UdAdQQSXQErwSOMzt/XWRWAz5GuSBIkwG1H3FabJ2OsUOUhGC6tK4EMtJO0ttC6IBD3kM0ve0tJwMdSfjZo+EEISaeTr9P3wYrGjXqyC1krcKdhMpxEnt5JetoulscpyzhXN5FRpuPHvbeQaKxFAEB6EN+cYN6xD7RYGpXpNndMmZgM5Dcs3YSNFDHUo2LGfZuukSWyUYirJAdYbF3MfqEKmjM+I2EfhA94iG3L7uKrR+GdWD73ydlIB+6hgref1QTlmgmbM3/LeX5GI1Ux1RWpgxpLuZ2+I+IjzZ8wqE4nilvQdkUdfhzI5QDWy+kw5Wgg2pGpeEVeCCA7b85BO3F9DzxB3cdqvBzWcmzbyMiqhzuYqtHRVG2y4x+KOlnyqla8AoWWpuBoYRxzXrfKuILl6SfiWCbjxoZJUaCBj1CjH7GIaDbc9kqBY3W/Rgjda1iqQcOJu2WW+76pZC9QG7M00dffe9hNnseupFL53r8F7YHSwJWUKP2q+k7RdsxyOB11n0xtOvnW4irMMFNV4H0uqwS5ExsmP9AxbDTc9JwgneAT5vTiUSm1E7BSflSt3bfa1tv8Di3R8n3Af7MNWzs49hmauE2wP+ttrq+AsWpFG2awvsuOqbipWHgtuvuaAE+A1Z/7gC9hesnr+7wqCwG8c5yAg3AL1fm8T9AZtp/bbJGwl1pNrE7RuOX7PeMRUERVaPpEs+yqeoSmuOlokqw49pgomjLeh7icHNlG19yjs6XXOMedYm5xH2YxpV2tc0Ro2jJfxC50ApuxGob7lMsxfTbeUv07TyYxpeLucEH1gNd4IKH2LAg5TdVhlCafZvpskfncCfx8pOhJzd76bJWeYFnFciwcYfubRc12Ip/ppIhA1/mSZ/RxjFDrJC5xifFjJpY2Xl5zXdguFqYyTR1zSp1Y9p+tktDYYSNflcxI0iyO4TPBdlRcpeqjK/piF5bklq77VSEaA+z8qmJTFzIWiitbnzR794USKBUaT0NTEsVjZqLaFVqJoPN9ODG70IPbfBHKK+/q/AWR0tJzYHRULOa4MP+W/HfGadZUbfw177G7j/OGbIs8TahLyynl4X4RinF793Oz+BU0saXtUHrVBFT/DnA3ctNPoGbs4hRIjTok8i+algT1lTHi4SxFvONKNrgQFAq2/gFnWMXgwffgYMJpiKYkmW3tTg3ZQ9Jq+f8XN+A5eeUKHWvJWJ2sgJ1Sop+wwhqFVijqWaJhwtD8MNlSBeWNNWTa5Z5kPZw5+LbVT99wqTdx29lMUH4OIG/D86ruKEauBjvH5xy6um/Sfj7ei6UUVk4AIl3MyD4MSSTOFgSwsH/QJWaQ5as7ZcmgBZkzjjU1UrQ74ci1gWBCSGHtuV1H2mhSnO3Wp/3fEV5a+4wz//6qy8JxjZsmxxy5+4w9CDNJY09T072iKG0EnOS0arEYgXqYnXcYHwjTtUNAcMelOd4xpkoqiTYICWFq0JSiPfPDQdnt+4/wuqcXY47QILbgAAAABJRU5ErkJggg==);
  box-shadow: 2px 3px 20px black,
    0 0 125px #000000 inset;

  .chat-header {
    font-weight: 600;
    padding: 0.3rem 1rem;
    cursor: pointer;
  }

  .selected-chat {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    padding: 0rem 1rem;
    height: 100%;

    &__messages {
      padding: .25rem 1rem;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      border-radius: 15px;
      margin: 1rem 0;
      background-color: #0000005e;
    }
  }

  .icon-active {
    background-color: var(--el-color-danger);
    color: var(--el-bg-color);
  }

  .el-divider {
    margin: 0rem 0 .35rem 0;
  }

  .bid {
    padding: 1rem 2rem 1rem 2rem;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .bid:hover {
    background-color: #0000006f;
  }

  .item {
    margin-bottom: .1rem;
    background-color: #0000004a;
    // padding: .25rem 1rem;
  }

  .item-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-right: 1rem;

    .darker-title {
      font-size: 14px;
      font-weight: 400;
    }
  }


  .chat-bids {
    padding: 0.3rem 1rem;

    .chat-bid {
      padding: .25rem 0;
      font-weight: 500;
    }

    .chat-bid:not(:last-child) {
      // border-bottom: 1px solid var(--el-border-color);
    }
  }
}
</style>

<style lang="scss">
.chat {
  .el-collapse-item__header {
    border: 0;
    padding: 0rem 1rem;
  }

  .message-input {
    // padding: 0 1rem 10px 1rem;
    margin-bottom: 1rem;

    .el-input {
      height: 37px;

      .el-input__wrapper {
        border-radius: 10px;
        padding: 1px 15px;
        background-color: #00000024;
      }
    }
  }

  .el-collapse {
    .el-collapse {
      .el-collapse-item__content {
        padding: 0;
      }
    }
  }

  .el-collapse-item__header__first {
    overflow: hidden;

    >.el-collapse-item__wrap {
      height: 500px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .el-collapse-item__header {
      border-radius: 15px 0 0 0;
      outline: none;
    }

    .el-collapse-item__content {
      height: 100%;
      padding: 0;

      .el-collapse-item__header {
        background-color: transparent;
      }
    }
  }
}
</style>
