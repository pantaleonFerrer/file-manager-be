import { File } from "../entity/file"
import { Share } from "../entity/share"
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/user"
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.HOST,
    port: 3306,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, File, Share],
    migrations: [],
    subscribers: [],
})
