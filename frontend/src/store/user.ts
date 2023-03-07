import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { User } from '../hooks'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
    const currentUser = useStorage('currentUser', {} as User)
    const token = useStorage('token', '')
    const isAuth = computed(() => !!token.value)
    const router = useRouter()
    const saveUser = (user: User) => {
        currentUser.value = user
    }

    const logout = () => {
        currentUser.value = { id: 0, nickname: '', password: "", name: "", lastName: "", discord: '', active: false}
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
