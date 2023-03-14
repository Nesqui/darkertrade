import { useApi } from "./api"
import { QueryUserDto, User } from "./user"
import { io, Socket } from "socket.io-client";
import { Chat } from "@/hooks"
import { useUserStore } from "@/store";
import { ref } from "vue";

export const initWs = () => {
  const userStore = useUserStore()
  const connected = ref(false);
  const onChatsReceived = async (data: Chat[]) => {
    console.log('onChatsReceived', data);
  }

  let socket: Socket | any = undefined

  const sendWS = (eventName: string, data: any = {}) => {
    return socket.emit(eventName, {
      ...data,
      token: userStore.token,
    })
  }

  const init = () => {
    socket = io(import.meta.env.VITE_WEBSOCKET_URL);
    console.log(socket);

    socket.on("connect", async () => {
      connected.value = true
      console.log('connect');

      socket.emit("auth", {
        token: userStore.token
      })
    })


    socket.on('authorized', async () => {
      console.log('authorized');
      sendWS("countAllChat")
      sendWS("findAllChat")
    })

    socket.on('chatsReceived', onChatsReceived)

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
    init
  }
}