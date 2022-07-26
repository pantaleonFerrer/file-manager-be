import JWT from "jsonwebtoken";
import { getUserByMail, insertUser } from "../helpers/user";
import bcryptjs from "bcryptjs";
import { User } from "entity/user";


export async function register(data: User): Promise<{ ok: boolean; msg?: string, data?: string }> {

    if (data.email.indexOf("@") < 0) {
        return { ok: false, msg: "Invalid email" };
    }

    const exist = await getUserByMail(data.email);
    if (exist?.email != null) {
        return { ok: false, msg: "Email already in use" };
    }

    const salt = bcryptjs.genSaltSync(10);
    data.password = bcryptjs.hashSync(data.password, salt);

    try {

        await insertUser(data);

    } catch (e) {
        console.log(e);
        return { ok: false, msg: "Invalid user" };
    }

    const token = await JWT.sign({ sub: data.id }, "WeddoFileManagerPRC");

    return { ok: true, data: token };

}