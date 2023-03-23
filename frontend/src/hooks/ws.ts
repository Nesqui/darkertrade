import { ref, onMounted, onUnmounted } from 'vue';
import io, { Socket } from 'socket.io-client';
import { useUserStore } from "@/store";

const channel = new BroadcastChannel('socket-channel');
// channel.close();
const socketId = Math.random().toString(36)
const isConnected = ref(false);
let token: string
let socket: Socket | any
export interface UnreadMessagesCount {
  chatId: number
  userId: number
  unreadMessages: string
}
const createSocket = () => {
  // Create a new socket instance if one does not already exist
  if (!socket) {
    socket = io(import.meta.env.VITE_WEBSOCKET_URL);

    // Broadcast a message to other tabs to let them know that a socket has been created
    channel.postMessage({ type: 'connect', socketId });
  }

  // Listen for socket events
  socket.on('connect', () => {});

  socket.emit("auth", {
    token
  })

  socket.on('authorized', () => {
    isConnected.value = true
  })

  socket.on('disconnect', () => {
    isConnected.value = false
  });
}

const destroySocket = () => {
  // Disconnect the socket when the component unmounts
  socket.disconnect();

  // Broadcast a message to other tabs to let them know that the socket has been disconnected
  channel.postMessage({ type: 'disconnect', socketId });
}

const emit = (eventName: string, data?: any | undefined) => {
  // if (socket) {
  socket.emit(eventName, {
    ...data,
    token,
  });
  // }
}

const on = (eventName: string, callback: any) => {
  // if (socket) {
  socket.on(eventName, callback);
  // }
}

const off = (eventName: string, callback: any) => {
  if (socket) {
    socket.off(eventName, callback);
  }
}

const handleMessage = (event: any) => {
  const { data } = event;
  
  // Check if the message is relevant to this socket instance
  if (data.type === 'connect' && data.socketId !== socketId) {
    // Another socket instance has been created, so disconnect this one
    destroySocket();
  }
  else if (data.type === 'disconnect' && data.socketId !== socketId) {
    // Another socket instance has been disconnected, so connect this one
    createSocket();
  }
}

export default function useSocket() {
  const userStore = useUserStore()
  token = userStore.token
  const connect = () => {
    channel.addEventListener('message', handleMessage);
    createSocket();
  }

  const reconnect = () => {
    socket.disconnect()
    socket = null
    createSocket();
  }

  const disconnect = () => {
    // Stop listening for messages from other tabs
    channel.removeEventListener('message', handleMessage);
    destroySocket();
    socket = null;
  }
  return { isConnected, emit, on, off, connect, disconnect, reconnect };
}
