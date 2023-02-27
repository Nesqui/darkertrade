import { useApi } from "./api"
import { QueryUserDto, User } from "./user"

export const initAuthApi = () => {
    const { axiosClient } = useApi()

    const signIn = async (params: QueryUserDto):Promise<User> => {
        const res = await axiosClient('auth/signin', {
            params
        })
        return res.data
    }

    return {
        signIn
    }
}