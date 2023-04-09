import { Attribute, Item, useApi } from "."

export interface BaseStat {
  min: number;
  max: number;
  inputRequired: boolean;
  itemId: number;
  item: Item;
  attributeId: number;
  attribute: Attribute;
  statsLength: number;
}
export interface UpdateBaseStatDto {
  min: number;
  max: number;
  inputRequired: boolean;
  attributeId: number;
  statsLength: number;
}

export const initBaseStatApi = () => {
  const { axiosClient } = useApi()

  // !ADMIN 
  const updateBaseStat = async (id: number, updateBaseStatDto: UpdateBaseStatDto) => {
    // const res = await axiosClient.patch(`attribute/${attributeId}/${min}/${max}/${name}`)
    const res = await axiosClient.patch(`baseStat/${id}`, updateBaseStatDto)
    return res.data
  }

  const findAllByItemPK = async (id: number): Promise<BaseStat[]> => {
    const res = await axiosClient(`baseStat/${id}/all`)
    return res.data
  }

  const findAll = async (): Promise<BaseStat[]> => {
    const res = await axiosClient('baseStat')
    return res.data
  }
  return {
    findAll, findAllByItemPK, updateBaseStat
  }
}
