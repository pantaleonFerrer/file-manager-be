import { Request, Response, Router } from "express";
import { login } from "../services/login";
import { Express } from 'express';


export class Auth {

    #router:Router = Router();

    constructor(App:Express){
        this.#router.get("/login", this.handleLogin.bind(this));
        App.use(this.#router);
    }

    async handleLogin(req:Request, res: Response){
        res.json(await login(req.body.email, req.body.password));
    }

}