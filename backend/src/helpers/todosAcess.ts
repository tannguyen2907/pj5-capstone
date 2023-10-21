import * as AWS from 'aws-sdk'
//Refer https://knowledge.udacity.com/questions/70893
const AWSXRay = require('aws-xray-sdk')
import { DeleteItemOutput, DocumentClient, UpdateItemOutput } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ClothesItem } from '../models/ClothesItem'
import { UpdateClothesRequest } from '../requests/UpdateClothesRequest'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('ClothesAccess')

export class ClothesAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.clothes_TABLE,
        private readonly createdAtIndex = process.env.clothes_CREATED_AT_INDEX
    ) { }

    async getClothes(userId: string): Promise<ClothesItem[]> {
        const result = await this.docClient
            .query({
                TableName: this.todosTable,
                IndexName: this.createdAtIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise()

        logger.info("Retrieved todo items", {userId, "count" : result.Count})

        const items = result.Items

        return items as ClothesItem[]
    }

    async createClothes(newClothesItem: ClothesItem): Promise<ClothesItem> {
        await this.docClient
            .put({
                TableName: this.todosTable,
                Item: newClothesItem
            })
            .promise()

        logger.info("Saved new todo item", {newClothesItem} )
        
        return newClothesItem
    }    

    async deleteClothes(userId: string, clothesId: string) {
        const deleteItem:DeleteItemOutput = await this.docClient
            .delete({
                TableName: this.todosTable,
                Key: {clothesId, userId},
                ReturnValues: "ALL_OLD"
            })
            .promise()

        const deletedClothes = deleteItem.Attributes

        logger.info("Deleted todo item", {deletedClothes})    
    }  
    
    async updateClothes(userId: string, clothesId: string, updatedProperties: UpdateClothesRequest) {
        const updateItem: UpdateItemOutput= await this.docClient
            .update({
                TableName: this.todosTable,
                Key: {clothesId, userId},
                ReturnValues: "ALL_NEW",
                UpdateExpression:
                  'set #name = :name, #dueDate = :duedate, #done = :done',
                ExpressionAttributeValues: {
                  ':name': updatedProperties.name,
                  ':duedate': updatedProperties.dueDate,
                  ':done': updatedProperties.done
                },
                ExpressionAttributeNames: {
                  '#name': 'name',
                  '#dueDate': 'dueDate',
                  '#done': 'done'
                }
            })
            .promise()

        const updatedClothes = updateItem.Attributes

        logger.info("Updated todo item", {updatedClothes} )
    }

    async updateAttachmentUrl(userId: string, clothesId: string, attachmentUrl: string) {
        const updateItem: UpdateItemOutput = await this.docClient
            .update({
                TableName: this.todosTable,
                Key: {clothesId, userId},
                ReturnValues: "ALL_NEW",
                UpdateExpression:
                  'set #attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {
                  ':attachmentUrl': attachmentUrl
                },
                ExpressionAttributeNames: {
                  '#attachmentUrl': 'attachmentUrl'
                }
            })
            .promise()

        const updatedClothes = updateItem.Attributes

        logger.info("Updated attachmentUrl of todo item", {updatedClothes} )
    }    
}