import { Share } from "entity/share";
import { File } from "../entity/file";
import { AppDataSource } from "../infrastructure/data-source"

export async function getFiles(data: any) {
    return await AppDataSource.manager.find(File, data);
}

export async function getSharedFile(data: string){
    return await AppDataSource.manager
    .getRepository(File)
    .createQueryBuilder("file")
    .leftJoinAndSelect("share.file", "file")
    .where(`file.uniqueToken = ${data}`)
    .getMany();
}

export async function insertFile(data: File) {
    return (await AppDataSource.manager.insert(File, data)).raw;
}