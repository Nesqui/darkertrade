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
    discord: string;
    active: boolean;
}

import { ElNotification } from "element-plus";
import { useApi } from "./api"

export const initUserApi = () => {
    const { axiosClient } = useApi()

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

    return {
        findByNickname
    }
}