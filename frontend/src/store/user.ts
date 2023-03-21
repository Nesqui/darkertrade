import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { initWs, User } from '../hooks'
import { useLocalStorage, useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
    const currentUser = useLocalStorage('currentUser', {} as User)
    const { close } = initWs()
    const token = useLocalStorage('token', '')
    const isAuth = computed(() => !!token.value)
    const router = useRouter()
    const saveUser = (user: User) => {
        currentUser.value = user
    }

    const logout = () => {
        close()
        localStorage.clear()
        currentUser.value = { id: 0, nickname: '', password: "", name: "", lastName: "", discord: '', active: false, discordNotification: true }
        token.value = ""
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
