import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User } from '../hooks'

export const useUserStore = defineStore('user', () => {
    const currentUser = ref<User>()

    const isAuth = () => !!currentUser.value

    return {
        currentUser,
        isAuth
    }
})
