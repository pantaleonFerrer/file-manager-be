import { NextFunction, Request, Response } from "express";

const bodyParser = async (req: Request, res: Response, next: NextFunction) => {
    if (["OPTION", "OPTIONS"].includes(req.method)) {
        res.json({ ok: true });
        return;
    }

    if (req.headers != null && req.headers["content-type"] === "application/json") {

        if (["POST", "PUT"].includes(req.method)) {
            try {
                req.body = await collectStream(req);

                next();

            } catch (err) {
                console.log(err)
                res.status(400).send("Bad JSON");
                return;
            }
        } else {
            res.status(400).send("Invalid request method");
            return;
        }
    } else if (req.headers && !req.headers["content-type"]) {
        req.body = req.query;
        next();
    }
}

const collectStream = async (req: Request) => {

    return new Promise((resolve, reject) => {
        const body: Buffer[] = [];
        req.on("data", (chunck: Buffer) => {
            body.push(chunck);
        })

        req.on("end", () => {
            const parsedBody = JSON.parse(body.toString());

            resolve(parsedBody);
        })
    });

}

export default bodyParser;