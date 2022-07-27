import { User } from "../entity/user";
import { getUserByID } from "../helpers/user";


export async function getUsersByID(data: { userID: number }): Promise<User> {

    return await getUserByID(data.userID);

}