import { Request, Response, Router } from "express";
import { Express } from 'express';
import { getFilesService, getFilesSharedService, postFilesService } from "../services/files";
import { File as FileInterface } from "../entity/file";
import { v1 } from "uuid";
import { UploadFile } from "../middlewares/fileUpload";
import { getUsersByID } from "../services/users";
import { User } from '../entity/user';


export class File {

    #router: Router = Router();

    constructor(App: Express) {
        this.#router.get("/authorized/files", this.handleGetFiles.bind(this));
        this.#router.post("/authorized/files", this.handlePostFiles.bind(this));
        this.#router.put("/authorized/files", this.handleGetFiles.bind(this));
        this.#router.delete("/authorized/files", this.handleGetFiles.bind(this));
        App.use(this.#router);
    }

    async handleGetFiles(req: Request, res: Response) {

        const requestData = req.body;

        let basicFilter = 0;

        if(requestData.userID != null) basicFilter++;

        if(basicFilter === 0){
            res.sendStatus(400);
            return;
        }
        
        let files: FileInterface[] = await getFilesService({userID: requestData.userID, uniqueKey: requestData.uniqueKey})

        if(requestData.sharedWithMe){
            const sharedFiles = await getFilesSharedService(requestData.uniqueKey);
            files = [...files, ...sharedFiles];
        }

        let finalFiles = [];
        let users = {};

        for(let row of files){

            const userID:any = row.userID;

            if(users[userID] == null){
                users[userID] = await getUsersByID(userID);
                delete users[userID].password;
                delete users[userID].id;
                
            }
            delete row.userID;
            row.id = row.id + 2123432;
            row.type = row.type.substring(row.type.indexOf("/") + 1, row.type.length).toUpperCase();
            finalFiles.push({...row, createdBy: users[userID]} as unknown as File & {createdBy: User});
        }

        res.json(finalFiles);

    }

    @UploadFile(`files/<userID>`)
    async handlePostFiles(req: Request, res: Response) {

        const requestData = req.body;

        let result = [];

        for(let row of req.body.files){
            result.push(await postFilesService({
                name: row.name,
                fileURL: row.fileURL,
                uniqueToken: v1(),
                userID: requestData.userID,
                weight: row.weight,
                type: row.type
            }))
        }

        res.json(result);

    }
}