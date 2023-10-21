import { apiEndpoint } from '../config'
import { ClothesType } from '../types/ClothesType';
import { CreateClothesRequest } from '../types/CreateClothesRequest';
import Axios from 'axios'
import { UpdateClothesRequest } from '../types/UpdateClothesRequest';

export async function getClothes(idToken: string): Promise<ClothesType[]> {
  console.log('Fetching clothes')

  const response = await Axios.get(`${apiEndpoint}/clothes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Clothes:', response.data)
  return response.data.items
}

export async function createClothes(
  idToken: string,
  newClothes: CreateClothesRequest
): Promise<ClothesType> {
  const response = await Axios.post(`${apiEndpoint}/clothes`,  JSON.stringify(newClothes), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchClothes(
  idToken: string,
  clothesId: string,
  updatedClothes: UpdateClothesRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/clothes/${clothesId}`, JSON.stringify(updatedClothes), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteClothes(
  idToken: string,
  clothesId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/clothes/${clothesId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  clothesId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/clothes/${clothesId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
