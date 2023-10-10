import { Attribute, Item, useApi } from '.'

// export interface BaseStat {
//   id?:number;
//   min: number;
//   max: number;
//   inputRequired: boolean;
//   itemId: number;
//   item: Item;
//   attributeId: number;
//   attribute: Attribute;
//   statsLength: number;
// }

export interface UpdateBaseStatDto {
  min: number
  max: number
  inputRequired: boolean
  attributeId: number
  statsLength: number
}
const EMPTY_BASE_STAT = {
  // min: 0,
  // max: 0,
  // inputRequired: false,
  attributeId: 12
  // statsLength: 0,
}

export const initBaseStatApi = () => {
  const { axiosClient } = useApi()

  // !ADMIN
  const updateBaseStat = async (id: number, updateBaseStatDto: UpdateBaseStatDto) => {
    // const res = await axiosClient.patch(`attribute/${attributeId}/${min}/${max}/${name}`)
    const res = await axiosClient.patch(`baseStat/${id}`, updateBaseStatDto)
    return res.data
  }

  // !ADMIN
  const createBaseStat = async (createBaseStatDto: any) => {
    const res = await axiosClient.post(`baseStat/`, { ...createBaseStatDto, ...EMPTY_BASE_STAT })
    return res.data
  }

  // !ADMIN
  const removeBaseStat = async (id: number) => {
    const res = await axiosClient.delete(`baseStat/${id}`)
    return res.data
  }

  // const findAllByItemPK = async (id: number): Promise<BaseStat[]> => {
  //   const res = await axiosClient(`baseStat/${id}/all`)
  //   return res.data
  // }

  // const findAll = async (): Promise<BaseStat[]> => {
  //   const res = await axiosClient('baseStat')
  //   return res.data
  // }

  return {
    // findAll,
    // findAllByItemPK,
    updateBaseStat,
    createBaseStat,
    removeBaseStat
  }
}
