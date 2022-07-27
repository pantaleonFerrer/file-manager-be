import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from "typeorm"
import { User } from "./user"

@Entity()
export class File {

    @PrimaryGeneratedColumn()
    id!: number

    @Column("varchar")
    name: string

    @Column("varchar")
    fileURL: string
    
    @Column("varchar")
    uniqueToken: string

    @Column("int")
    userID!: User

    @Column("double")
    weight!: number

    @Column("varchar")
    type!: string

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Timestamp

    @Column({type: "timestamp", nullable: true})
    deletedAt!: Timestamp

}

export interface CreateFile {
    fileURL: string;
    name: string;
    uniqueToken: string;
    type: string;
    weight: number;
    userID: any;
}
