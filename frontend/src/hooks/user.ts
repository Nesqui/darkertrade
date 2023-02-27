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

import { useApi } from "./api"

export const initUserApi = () => {
    const { axiosClient } = useApi()
    return {
        
    }
}