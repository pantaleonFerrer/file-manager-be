import { File } from "../entity/file"
import { Share } from "../entity/share"
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/user"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "weddo-filemanager",
    synchronize: true,
    logging: false,
    entities: [User,File, Share],
    migrations: [],
    subscribers: [],
})
