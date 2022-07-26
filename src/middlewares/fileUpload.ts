import { NextFunction, Request, RequestHandler, Response } from "express";
import Busboy from "busboy";
import { ReturnedFile, WeddoAWS } from '../infrastructure/aws';

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

            folder = folder.replaceAll("<userID>", req.body.userID);

            const busboy = Busboy({ headers: req.headers });

            req.body.files = [];
            let formData;

            try {

            busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

               mimetype = filename.mimeType;

                filename = filename.filename.replaceAll(/[\s/]/g, "_");

                console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

                const location = new WeddoAWS().uploadFile(file, filename, folder);

                req.body.files.push({
                    fileURL: location,
                    name: filename,
                    type: mimetype,
                    weight: 0
                } as ReturnedFile);

            });

            busboy.on("field", (fieldname,val) => {
                    if (fieldname === "data") {
                        formData = val;
                    }
                }

            );

            busboy.on("finish", () => {
                req.body = { ...req.body, files: req.body.files, ...formData };

                previousFunc(req, res, next);
            });

            req.pipe(busboy);

            }catch{
                res.sendStatus(500);
            }

        }
    }


}