import { Request, Response, Router } from "express";
import { login } from "../services/login";
import { Express } from 'express';
import { register } from "../services/register";


export class Auth {

    #router: Router = Router();

    constructor(App: Express) {
        this.#router.get("/login", this.handleLogin.bind(this));
        this.#router.post("/register", this.handleRegister.bind(this));
        App.use(this.#router);
    }

    async handleLogin(req: Request, res: Response) {
        res.json(await login(req.body.email, req.body.password));
    }

    async handleRegister(req: Request, res: Response) {
        res.json(await register(req.body));
    }

}