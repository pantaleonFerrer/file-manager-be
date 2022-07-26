import { File, CreateFile } from '../entity/file';
import { getFiles, getSharedFile, insertFile } from "../helpers/file";


export async function getFilesService(data: { userID: number, uniqueKey?: string }): Promise<File[]> {

    const obj: any = { where: { userID: data.userID } };

    if (data.uniqueKey) {
        obj.where.uniqueToken = data.uniqueKey;
    }

    return await getFiles(obj);

}

export async function postFilesService(data: CreateFile): Promise<File> {

    const returned = await insertFile(data);

    return (await getFiles({where: {id: returned.insertId}}))[0];

}

export async function getFilesSharedService(uniqueToken: string): Promise<File[]> {


    return await getSharedFile(uniqueToken);

}