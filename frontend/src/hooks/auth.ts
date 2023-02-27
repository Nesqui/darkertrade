import { useApi } from "./api"
import { QueryUserDto, User } from "./user"

export interface AuthResponse {
    user: User,
    jwtToken: string
}

export const initAuthApi = () => {
    const { axiosClient } = useApi()

    const signIn = async (params: QueryUserDto): Promise<AuthResponse> => {
        const res = await axiosClient('auth/signin', {
            params
        })
        return res.data
    }

    return {
        signIn
    }
}