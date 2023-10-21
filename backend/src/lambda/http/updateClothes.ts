import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateClothes } from '../../businessLogic/clothes'
import { UpdateClothesRequest } from '../../requests/UpdateClothesRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const clothesId = event.pathParameters.clothesId
    const updatedClothes: UpdateClothesRequest = JSON.parse(event.body)
    
    if (!clothesId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing clothesId' })
      }
    }
  
    const userId = getUserId(event)
  
    await updateClothes(userId, clothesId, updatedClothes)
  
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
