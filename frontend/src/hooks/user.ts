export class QueryUserDto {
    id?: number;
    nickname?: string;
    password?: string;
}

export interface User {
    id: number;
    nickname: string;
    password: string;
    name: string;
    lastName: string;
    discord?: string;
    active: boolean;
    hash?: string;
    discordNotification: boolean;
    online: boolean
}


export interface UpdateUserDto {
    nickname: string;
    password: string;
    hash: string;
}


import { ElNotification } from "element-plus";
import { useApi } from "./api"

export const initUserApi = () => {
    const { axiosClient } = useApi()

    const findOneByHash = async (hash: string) => {
        if (!hash) {
            ElNotification('Hash not provided')
            return
        }
        const res = await axiosClient(`user/hash/${hash}`)

        return res.data
    }

    const findByNickname = async (nickname: string) => {
        if (!nickname) {
            ElNotification('Nickname not provided')
            return
        }
        const res = await axiosClient(`user/nickname/${nickname}`)
        if (!res.data) {
            ElNotification('User not found')
            return
        }

        return res.data
    }

    const changeDiscordNotification = async (bool: boolean) => {
        const res = await axiosClient.patch(`user/discord/${bool ? 'true' : 'false'}`)
        return res.data
    }

    const update = async (user: UpdateUserDto) => {
        if (!user.hash) {
            ElNotification('Hash not provided')
            return
        }
        const res = await axiosClient.patch(`user`, user)
        return res.data
    }

    return {
        findByNickname,
        findOneByHash,
        update,
        changeDiscordNotification
    }
}