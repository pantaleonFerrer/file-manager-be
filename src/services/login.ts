import JWT, { JsonWebTokenError } from "jsonwebtoken";
import { getUserByMail } from "../helpers/user";
import bcryptjs from "bcryptjs";


export async function login(email:string, password: string): Promise<{ ok: boolean; msg?: string; token?: string; }> {

    if(!email || !password){
        return {ok: false, msg: "No email or password"};
    }

    if(email.indexOf("@") < 0){
        return {ok: false, msg: "Invalid email"};
    }

    const user = await getUserByMail(email);

    if(user == null){
        return {ok: false, msg: "Invalid email or password"};
    }

    const isAuth = await bcryptjs.compare(password, user.password);

    if(!isAuth){
        return {ok: false, msg: "Invalid email or password"}; 
    }

    const token = await JWT.sign({sub: user.id}, "WeddoFileManagerPRC", { algorithm: 'RS256' });

    return {ok: true, token};
}