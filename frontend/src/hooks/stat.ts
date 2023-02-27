import { useApi } from "."

export type StatSymbol = '>=' | '='

export interface Stat {
    id?: number
    value: number
    symbol: StatSymbol
    attributeId: number
}

export const initStatApi = () => {
    const { axiosClient } = useApi()

    const findAll = async ():Promise<Stat[]> => {
        const res = await axiosClient('stat')
        return res.data
    }

    return {
        findAll
    }
}
