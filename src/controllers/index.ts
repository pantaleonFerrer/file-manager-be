import { Auth } from "./auth";
import { Express } from 'express';
import { File } from "./files";

export function initControllers(App: Express){

    new Auth(App);
    new File(App);

}
