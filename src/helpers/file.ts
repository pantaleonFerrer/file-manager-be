import { Share } from "../entity/share";
import { File, CreateFile } from '../entity/file';
import { AppDataSource } from "../infrastructure/data-source"

export async function getFiles(data: any) {
    return await AppDataSource.manager.find(File, data);
}

export async function getSharedFile(data: string){
    return await AppDataSource.manager.query(`SELECT * FROM share LEFT JOIN file ON (file.id = share.fileId) WHERE ${data}`);
}

export async function insertFile(data: CreateFile) {
    return (await AppDataSource.manager.insert(File, data)).raw;
}

export async function updateWeight(data) {
    return (await AppDataSource.manager.update(File, {id: data.id}, {weight: data.weight}));
}

export async function insertShare(data) {
    return (await AppDataSource.manager.insert(Share, data)).raw;
}