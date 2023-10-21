/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateClothesRequest {
  name: string
  dueDate: string
  done: boolean
}