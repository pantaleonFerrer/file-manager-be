import { NextFunction, Request, RequestHandler, Response } from "express";
import Busboy from "busboy";
import { WeddoAWS } from "infrastructure/aws";
import { ReturnedFile } from '../infrastructure/aws';

export function UploadFile(folder: string) {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const previousFunc: RequestHandler = descriptor.value;
        descriptor.value = async function (
            req: Request,
            res: Response,
            next: NextFunction
        ) {

            folder.replace("<userID>", req.body.userID);

            const busboy = new Busboy({ headers: req.headers });

            req.body.files = [];

            busboy.on('file', async function (fieldname, file, filename, encoding, mimetype) {
                console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

                const location = await new WeddoAWS().uploadFile(file, filename, folder);

                req.body.files.push({
                    fileURL: location,
                    name: filename,
                    type: mimetype,
                    weight: 0
                } as ReturnedFile);

            });

            previousFunc.call(this, req, res, next);

        }
    }


}