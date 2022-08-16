import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from "typeorm"
import { User } from "./user"

@Entity()
export class File {

    @PrimaryGeneratedColumn()
    id!: number

    @Column("varchar")
    name: string

    @Column({type: "varchar", nullable: true})
    fileURL: string
    
    @Column("varchar")
    uniqueToken: string

    @Column("int")
    userID!: User

    @Column({type: "double", nullable: true})
    weight!: number

    @Column({type: "varchar", nullable: true})
    type!: string

    @Column({type: "int", nullable: true})
    folderID!: number

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Timestamp

    @Column({type: "timestamp", nullable: true})
    deletedAt!: Timestamp

}

export interface CreateFile {
    fileURL?: string;
    name: string;
    uniqueToken: string;
    type?: string;
    weight?: number;
    userID: any;
    folderID?: any;
}
