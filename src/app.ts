import express, {Express} from "express";
import { Authorized } from "./middlewares/authorized";
import bodyParser from "./middlewares/bodyParser";
import { AppDataSource } from "./infrastructure/data-source";
import { initControllers } from "./controllers";
import "reflect-metadata";
import 'dotenv/config';
import cors from "cors";

const App:Express = express();

App.use((req, res, next) => {
    res.on("finish", () => {
        const log = res.statusCode < 300 ? console.log : console.warn;
        log(`${req.method} ${req.url} ${req.ip}:
        Date: ${new Date().toISOString()}
        Content-Length: ${req.headers["content-length"]}
        User-Agent: ${req.headers["user-agent"]}
        X-Forwarded-For: ${req.headers["x-forwarded-for"]}
        Host: ${req.headers["host"]}
        Referer: ${req.headers["referer"]}
        ${res.statusCode} ${res.statusMessage}`);
    });
    next();
});

App.use(cors());

App.use(bodyParser);

App.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Authorization, Content-Type, Origin, Accept, X-Requested-With"
    );
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, DELETE, GET");
    next();
});

App.use("/authorized", Authorized);

AppDataSource.initialize();

initControllers(App);

App.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`);
});

export default App;

/*


    LOGIN
    REGISTER
    
    VER ARCHIVOS
    DESCARGAR ARCHIVOS
    ELIMINAR ARCHIVOS
    SUBIR ARCHIVOS
    COMPARTIR ARCHIVOS --> Sin login

*/