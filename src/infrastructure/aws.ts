import AWS from "aws-sdk";
import 'dotenv/config';

export interface ReturnedFile {
    fileURL: string;
    name: string;
    type: string;
    weight: number;
}

export class WeddoAWS {

    private secretKey: string = process.env.AWS_SECRET;
    private bucket: string = process.env.BUCKET;
    private accessKey: string = process.env.AWS_ACCESS;
    public region: string = "eu-west-3";
    private awsInstance: AWS.S3;

    constructor() {
        this.awsInstance = new AWS.S3({
            credentials: {
                accessKeyId: this.accessKey,
                secretAccessKey: this.secretKey
            }
        });
    }

    async uploadFile(file: File, filename: string, folder?: string) {
        const uploadedFile: AWS.S3.ManagedUpload.SendData = await this.awsInstance.upload(
            { Bucket: this.bucket, Key: `${folder}/${filename}`, Body: file, ACL: 'public-read' },
            { partSize: 5 * 1024 * 1024, queueSize: 10 }
        )
            .on('httpUploadProgress', function (evt) {
                console.log(evt);
            }).send(function (err, data) {
                console.log("After Upload: " + new Date());
                console.log(err, data);
            });

        return uploadedFile.Location;
    }

}