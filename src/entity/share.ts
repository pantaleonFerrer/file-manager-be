import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from "typeorm"
import { File } from "./file"
import { User } from "./user"

@Entity()
export class Share {

    @PrimaryGeneratedColumn()
    id!: number

    @Column("int")
    userIDProp!: User

    @Column("int")
    userIDNoProp!: User

    @Column("int")
    fileID!: File
    
    @Column("timestamp")
    expirationDate!: Timestamp

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Timestamp

}
