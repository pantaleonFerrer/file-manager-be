import { Request, Response, Router } from "express";
import { login } from "../services/login";
import { Express } from 'express';
import { register } from "../services/register";


export class File {

    #router: Router = Router();

    constructor(App: Express) {
        this.#router.get("/authorized/files", this.handleGetFiles.bind(this));
        this.#router.post("/authorized/files", this.handleGetFiles.bind(this));
        this.#router.put("/authorized/files", this.handleGetFiles.bind(this));
        this.#router.delete("/authorized/files", this.handleGetFiles.bind(this));
        App.use(this.#router);
    }

    async handleGetFiles(req: Request, res: Response) {

        const requestData = req.body;

        let basicFilter = 0;

        if(requestData.uniqueKey != null) basicFilter++;
        if(requestData.sharedWithMe != null) basicFilter++;

        if(basicFilter === 0){
            res.sendStatus(400);
            return;
        }  
    }

    async handlePostFiles(req: Request, res: Response) {

        const requestData = req.body;

        let basicFilter = 0;

        if(requestData.uniqueKey != null) basicFilter++;
        if(requestData.sharedWithMe != null) basicFilter++;

        if(basicFilter === 0){
            res.sendStatus(400);
            return;
        }  
    }
}