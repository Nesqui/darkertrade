import { useApi } from "."

export interface Attribute {
    name: string,
    min?: number,
    max?: number,
    id: number
}

export const initAttributesApi = () => {
    const { axiosClient } = useApi()

    const findAll = async ():Promise<Attribute[]> => {
        const res = await axiosClient('attribute')
        return res.data
    }
    return {
        findAll
    }
}
