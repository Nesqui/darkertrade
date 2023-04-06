import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { User } from '../hooks'
import { useLocalStorage, useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import useSocket from '@/hooks/ws'

export const useUserStore = defineStore('user', () => {
    const currentUser = useLocalStorage('currentUser', {} as User)
    const { disconnect } = useSocket()
    const token = useLocalStorage('token', '')
    const isAuth = computed(() => !!token.value)
    const router = useRouter()
    const saveUser = (user: User) => {
        currentUser.value = user
    }

    const logout = () => {
        localStorage.clear()
        currentUser.value = { id: 0, nickname: '', password: "", name: "", lastName: "", discord: '', active: false, discordNotification: true, online: false, isAdmin: false }
        token.value = ""
        // disconnect()
        router.push('/')
    }

    const saveToken = (jwtToken: string) => {
        token.value = jwtToken
    }

    return {
        currentUser,
        isAuth,
        saveUser,
        saveToken,
        logout,
        token
    }
})
