import { Entity, PrimaryGeneratedColumn, Column, Timestamp, ManyToOne } from "typeorm"
import { File } from "./file"
import { User } from "./user"

@Entity()
export class Share {

    @PrimaryGeneratedColumn()
    id!: number

    @Column("int")
    userIDProp!: User

    @Column({type: "int", nullable: true})
    userIDNoProp!: User

    @ManyToOne((type) => File, (file) => file.id)
    file!: File
    
    @Column({type: "timestamp", nullable: true})
    expirationDate!: Timestamp

    @Column("varchar")
    groupUUID!: string

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Timestamp

}
