import { User } from "../entity/user";
import { AppDataSource } from "../infrastructure/data-source"

export async function getUserByMail(email:string){
    return await AppDataSource.manager.findOneBy(User, {email});
}