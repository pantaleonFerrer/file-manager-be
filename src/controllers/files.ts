import { Request, Response, Router } from "express";
import { Express } from 'express';
import { getFilesService, getFilesSharedService, postFilesService, postShareService, updateFileWeightService } from "../services/files";
import { File as FileInterface } from "../entity/file";
import { v1 } from "uuid";
import { UploadFile } from "../middlewares/fileUpload";
import { getUsersByID } from "../services/users";
import { User } from '../entity/user';
import { randomString } from '../utils/generalUtils';


export class File {

    #router: Router = Router();

    constructor(App: Express) {

        //Files

        this.#router.get("/authorized/files", this.handleGetFiles.bind(this));
        this.#router.post("/authorized/files", this.handlePostFiles.bind(this));
        this.#router.put("/authorized/files", this.handleGetFiles.bind(this));
        this.#router.delete("/authorized/files", this.handleGetFiles.bind(this));
        this.#router.post("/authorized/folders", this.handlePostFolders.bind(this));

        // Shared

        this.#router.get("/sharedFile", this.handleGetSharedFile.bind(this));
        this.#router.post("/authorized/sharedFile", this.handlePostSharedFile.bind(this));

        App.use(this.#router);
    }

    async handleGetFiles(req: Request, res: Response) {

        const requestData = req.body;

        let basicFilter = 0;

        if (requestData.userID != null) basicFilter++;

        if (basicFilter === 0) {
            res.sendStatus(400);
            return;
        }

        if (requestData.folderID) {
            requestData.folderID = Number(requestData.folderID) - 2123432;
        }

        let files: FileInterface[] = await getFilesService({ userID: requestData.userID, uniqueKey: requestData.uniqueKey, folderID: requestData.folderID })

        if (requestData.sharedWithMe) {
            const sharedFiles = await getFilesSharedService({ uniqueToken: requestData.uniqueKey });
            files = [...files, ...sharedFiles];
        }

        let finalFiles = [];
        let users = {};

        for (let row of files) {

            const userID: any = row.userID;

            if (users[userID] == null) {
                users[userID] = await getUsersByID(userID);
                delete users[userID].password;
                delete users[userID].id;

            }
            delete row.userID;
            row.id = row.id + 2123432;
            row.type = row.type.substring(row.type.indexOf("/") + 1, row.type.length).toUpperCase();
            finalFiles.push({ ...row, createdBy: users[userID] } as unknown as File & { createdBy: User });
        }

        res.json(finalFiles);

    }

    async handlePostSharedFile(req: Request, res: Response) {

        const requestData = req.body;

        let basicFilter = 0;

        if (requestData.userID != null) basicFilter++;
        if (requestData.uniqueKeys?.length > 0) basicFilter++;

        if (basicFilter < 2) {
            res.sendStatus(400);
            return;
        }

        let files: FileInterface[] = await getFilesService({ userID: requestData.userID, uniqueKeys: requestData.uniqueKeys });

        const uuid = randomString(30);

        for (let row of files) {
            await postShareService({
                file: row.id,
                groupUUID: uuid,
                expirationDate: requestData.expirationDate,
                userIDProp: requestData.userID
            });
        }

        res.json({ ok: true, uuid });

    }

    async handleGetSharedFile(req: Request, res: Response) {

        const requestData = req.body;

        let basicFilter = 0;

        if (requestData.groupUUID != null) basicFilter++;

        if (basicFilter === 0) {
            res.sendStatus(400);
            return;
        }

        let files: any[] = await getFilesSharedService({ groupUUID: requestData.groupUUID });

        let finalFiles = [];
        let users = {};
        let newFiles = [];

        for (let row of files) {
            if (row.type.toLowerCase() === "folder") {
                newFiles = [...newFiles, ...(await getFilesService({ userID: requestData.userID, folderID: row.id }))];
            } else {
                newFiles.push(row);
            }
        }

        for (let row of newFiles) {

            if (row.expirationDate != null) {
                const expirationDate = new Date(row.expirationDate).getTime();
                if (expirationDate > new Date().getTime()) {
                    continue;
                }
            }

            const userID: any = row.userID;

            if (users[userID] == null) {
                users[userID] = await getUsersByID(userID);
                delete users[userID].password;
                delete users[userID].id;

            }
            delete row.userID;
            row.id = row.id + 2123432;
            row.type = row.type.substring(row.type.indexOf("/") + 1, row.type.length).toUpperCase();
            finalFiles.push({ ...row, createdBy: users[userID] } as unknown as File & { createdBy: User });
        }

        res.json(finalFiles);

    }

    @UploadFile(`files/<userID>`)
    async handlePostFiles(req: Request, res: Response) {

        const requestData = req.body;

        let result = [];

        let finalWeight = 0;

        for (let row of req.body.files) {
            result.push(await postFilesService({
                name: row.name,
                fileURL: row.fileURL,
                uniqueToken: v1(),
                userID: requestData.userID,
                weight: row.weight,
                type: row.type,
                folderID: Number(requestData.folderID) - 2123432
            }));

            if(requestData.folderID != null){
                finalWeight += row.weight;
            }

        }

        if(requestData.folderID != null){

            const folder = (await getFilesService({id: Number(requestData.folderID) - 2123432, userID: requestData.userID}))[0];

            await updateFileWeightService(Number(folder.weight) + finalWeight, folder.id);
        }

        res.json(result);

    }

    async handlePostFolders(req: Request, res: Response) {

        const requestData = req.body;

        res.json((await postFilesService({
            name: requestData.name,
            uniqueToken: v1(),
            userID: requestData.userID,
            type: "folder",
            folderID: requestData.folderID,
            weight: 0
        })));

    }
}