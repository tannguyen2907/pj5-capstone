import { ClothesAccess } from '../helpers/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { ClothesItem } from '../models/ClothesItem'
import { CreateClothesRequest } from '../requests/CreateClothesRequest'
import { UpdateClothesRequest } from '../requests/UpdateClothesRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const logger = createLogger('Clothes-Business-Logic') 
const todosAccess = new ClothesAccess()
const attachmentUtils = new AttachmentUtils()

// TODO: Implement businessLogic
export async function createClothes(userId: string, newClothes: CreateClothesRequest): Promise<ClothesItem>{
    logger.info(`Create todo: user [${userId}], data [${newClothes}]`);
    const clothesId = uuid.v4();
    logger.info(`Created clothesId: [${clothesId}]`);

    const newClothesItem: ClothesItem = {
        userId,
        clothesId,
        createdAt: new Date().toISOString(),
        ...newClothes,
        done: false
    }


    return await todosAccess.createClothes(newClothesItem);
}

export async function getClothesForUser(userId: string): Promise<ClothesItem[]>{
    return await todosAccess.getClothes(userId)
}

export async function deleteClothes(userId: string, clothesId: string){
    logger.info(`Remove userId [${userId}], clothesId $[{clothesId}]`);
    return await todosAccess.deleteClothes(userId, clothesId)
}

export async function createAttachmentPresignedUrl(userId: string, clothesId: string): Promise<string>{
    logger.info(`Create Attachment Presigned Url: userId [${userId}], clothesId [${clothesId}]`);
    const resignedUrl =  await attachmentUtils.getSignedUrl(clothesId);
    const s3Link = resignedUrl.split("?")[0];
    await todosAccess.updateAttachmentUrl(userId, clothesId, s3Link);
    return resignedUrl;
}

export async function updateClothes(userId: string, clothesId: string, updatedClothes: UpdateClothesRequest) {
    logger.info(`Update userId [${userId}], clothesId [${clothesId}], data [${JSON.stringify(updatedClothes)}]`);
    return await todosAccess.updateClothes(userId, clothesId, updatedClothes)
}