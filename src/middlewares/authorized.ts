import { NextFunction, Request, Response } from 'express';
import JWT, { JwtPayload, VerifyOptions } from "jsonwebtoken";
import fs from "fs";
import { dataRenderer } from '../utils/dataRenderer';
export interface DecodedJWT {
    sub: any
}

export async function Authorized(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        res.setHeader("WWW-Authenticate", "Bearer realm=\"Weddo OAuth\"")
            .sendStatus(403);
        return;
    }
    const bearer = req.headers.authorization.substring(7);
    if (process.env.ENV === "DEV") {
        const jwt = JWT.decode(bearer) as DecodedJWT;
        if (!jwt) {
            res.setHeader("WWW-Authenticate", "Bearer realm=\"Weddo OAuth\", error=\"invalid_token\"")
                .sendStatus(403);
            return;
        }

        req.body.userID = jwt.sub;

        next();

    } else {
        try {
            const publicKey = "WeddoFileManagerPRC"

            JWT.verify(bearer, publicKey, {
                algorithms: ["RS256"]
            }, (err, jwt) => {
                if (err != null) {
                    console.log(err);
                    res.setHeader("WWW-Authenticate", "Bearer realm=\"Weddo OAuth\", error=\"invalid_token\"")
                        .sendStatus(401);
                } else {
                    jwt = jwt as DecodedJWT;
                    req.body.userID = jwt.sub;
                }
            });

            next();

        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }

    }


}