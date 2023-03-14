import { useApi } from "./api"
import { QueryUserDto, User } from "./user"
import { io, Socket } from "socket.io-client";
import { Chat } from "@/hooks"
import { useUserStore } from "@/store";
import { computed, ref, watch } from "vue";
let socket: Socket | any = ref()

export const initWs = () => {
  const userStore = useUserStore()

  const connected = ref(false)

  const sendWS = (eventName: string, data: any = {}) => {
    return socket.value.emit(eventName, {
      ...data,
      token: userStore.token,
    })
  }

  const init = () => {
    return new Promise((res) => {
      socket.value = io(import.meta.env.VITE_WEBSOCKET_URL);

      socket.value.on("connect", async () => {
        socket.value.emit("auth", {
          token: userStore.token
        })

        socket.value.on('authorized', () => {
          console.log('authorized', connected.value);
          res(true)
          connected.value = true
        })
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
  }

  return {
    sendWS,
    init,
    socket,
    connected
  }
}