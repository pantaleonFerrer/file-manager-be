import { File } from "../entity/file";
import { getFiles, getSharedFile, insertFile } from "../helpers/file";


export async function getFilesService(data: {userID: number, uniqueKey?: string}): Promise<File[]> {

    const obj:any = {where: {userID: data.userID}};

    if(data.uniqueKey){
        obj.where.uniqueToken = data.uniqueKey;
    }

    return await getFiles(obj);

}

export async function postFilesService(data: File): Promise<File> {

    return await insertFile(data);

}

export async function getFilesSharedService(uniqueToken: string): Promise<File[]> {


    return await getSharedFile(uniqueToken);

}