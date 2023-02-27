import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User } from '../hooks'

export const useUserStore = defineStore('user', () => {
    const currentUser = ref<User>()
    const token = ref<string>()

    const isAuth = () => !!currentUser.value

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
