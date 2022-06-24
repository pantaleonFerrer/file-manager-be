import express, {Express} from "express";
import { Authorized } from "./middlewares/authorized";
import bodyParser from "./middlewares/bodyParser";
import { AppDataSource } from "./infrastructure/data-source";
import { initControllers } from "./controllers";
import "reflect-metadata";
import 'dotenv/config';

const App:Express = express();

App.use(bodyParser);

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