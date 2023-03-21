import { useApi } from "./api"
import { QueryUserDto, User } from "./user"
import { io, Socket } from "socket.io-client";
import { Chat } from "@/hooks"
import { useUserStore } from "@/store";
import { computed, ref, watch } from "vue";
let socket: Socket | any = ref()

export interface UnreadMessagesCount {
  chatId: number
  userId: number
  unreadMessages: string
}

export const initWs = () => {
  const userStore = useUserStore()

  const connected = ref(false)
  const isConnected = computed(() => connected.value)

  const sendWS = (eventName: string, data: any = {}) => {
    return socket.value.emit(eventName, {
      ...data,
      token: userStore.token,
    })
  }

  const close = () => {
    if (connected.value) {
      connected.value = false
      socket.value.disconnect()
    }
  }

  const init = () => {
    return new Promise((res, rej) => {
      socket.value = io(import.meta.env.VITE_WEBSOCKET_URL, {
        reconnection: false
      });

      setTimeout(() => {
        if (!connected.value) {
          rej()
        }
      }, 5000);

      socket.value.on("connect", async () => {
        console.log('AUTH START');
        socket.value.emit("auth", {
          token: userStore.token
        })

        socket.value.on("disconnect", () => {
          connected.value = false
          console.log('disconnect');
        });

        socket.value.on('authorized', () => {
          console.log('authorized', connected.value);
          res(true)
          connected.value = true
        })
      })

      
      socket.value.on("error", (error: any) => {
        console.log('error', error);
      });

      socket.value.on("connect_error", (error: any) => {
        console.log('error connection', error);
      })

    })
  }

  return {
    sendWS,
    init,
    close,
    socket,
    connected: isConnected
  }
}