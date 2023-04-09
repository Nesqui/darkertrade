import { useApi } from "."

export interface Attribute {
    name: string,
    min?: number,
    max?: number,
    id: number
}
export interface UpdateAttributeDto {
  min: number;
  max: number;
  name: string;
}

export const initAttributesApi = () => {
    const { axiosClient } = useApi()


    // !ADMIN 
    const updateAttribute = async (id:number, updateAttributeDto: UpdateAttributeDto) => {
      // const res = await axiosClient.patch(`attribute/${attributeId}/${min}/${max}/${name}`)
      const res = await axiosClient.patch(`attribute/${id}`,updateAttributeDto)
      return res.data
  }

    const findAll = async ():Promise<Attribute[]> => {
        const res = await axiosClient('attribute')
        return res.data
    }
    return {
        findAll,updateAttribute
    }
}
