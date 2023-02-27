import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { User } from '../hooks'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
    const currentUser = useStorage('currentUser', {})
    const token = useStorage('token', '')

    const isAuth = computed(() => !!currentUser.value)

    const saveUser = (user:User) => {
        currentUser.value = user
    }

    const saveToken = (jwtToken: string) => {
        token.value = jwtToken
    }

    return {
        currentUser,
        isAuth,
        saveUser,
        saveToken
    }
})
