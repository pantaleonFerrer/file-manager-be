import { User } from "../entity/user";
import { AppDataSource } from "../infrastructure/data-source"

export async function getUserByMail(email: string) {
    return await AppDataSource.manager.findOneBy(User, { email });
}

export async function getUserByID(id: number) {
    return await AppDataSource.manager.findOneBy(User, { id });
}

export async function insertUser(data: User) {
    return await AppDataSource.manager.insert(User, data);
}