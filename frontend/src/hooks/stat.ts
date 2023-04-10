import { useApi } from "."

export interface Stat {
  id?: number
  value: number
  attributeId: number,
  isBaseStat: boolean
}

export const initStatApi = () => {
  const { axiosClient } = useApi()

  const findAll = async (): Promise<Stat[]> => {
    const res = await axiosClient('stat')
    return res.data
  }

  return {
    findAll
  }
}
