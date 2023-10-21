import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateClothesRequest } from '../../requests/CreateClothesRequest'
import { getUserId } from '../utils';
import { createClothes } from '../../businessLogic/clothes'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newClothes: CreateClothesRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const userId = getUserId(event);

    if (!newClothes || !newClothes.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing todo Name' })
      }
    }

    const newClothesItem = await createClothes(userId, newClothes);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: newClothesItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
