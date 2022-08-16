import { File, CreateFile } from '../entity/file';
import { getFiles, getSharedFile, insertFile, insertShare, updateWeight } from "../helpers/file";
import { In } from "typeorm"


export async function getFilesService(data: { userID: number, uniqueKey?: string, uniqueKeys?: string[], folderID?: number, id?: number }): Promise<File[]> {

    const obj: any = { where: { userID: data.userID } };

    if (data.uniqueKey) {
        obj.where.uniqueToken = data.uniqueKey;
    }

    if(data.uniqueKeys) {
        obj.where.uniqueToken = In(data.uniqueKeys);
    }

    if(data.folderID) {
        obj.where.folderID = data.folderID;
    }

    if(data.id){
        obj.where.id = data.id
    }

    obj.where.deletedAt = null;

    return await getFiles(obj);

}

export async function postFilesService(data: CreateFile): Promise<File> {

    const returned = await insertFile(data);

    return (await getFiles({where: {id: returned.insertId}}))[0];

}

export async function updateFileWeightService(weight: number, id: number){

    updateWeight({weight, id})
    
}

export async function postShareService(data: {file: number, groupUUID: string, expirationDate?: string, userIDProp: number}) {

    await insertShare(data);

}

export async function getFilesSharedService(data:{uniqueToken?: string, groupUUID?: string}): Promise<File[]> {

    let where: string = ""; 

    if (data.uniqueToken) {
        if(where.length > 0){
            where += " AND ";
        }
        where += ` uniqueToken = "${data.uniqueToken}" `;
    }

    if (data.groupUUID) {
        if(where.length > 0){
            where += " AND ";
        }
        where += ` groupUUID = "${data.groupUUID}" `;
    }

    return await getSharedFile(where);

}