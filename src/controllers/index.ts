import { Auth } from "./auth";
import { Express } from 'express';

export function initControllers(App: Express){

    new Auth(App);

}
