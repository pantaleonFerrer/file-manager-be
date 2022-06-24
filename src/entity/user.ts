import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number

    @Column("varchar")
    firstName!: string

    @Column("varchar")
    lastName!: string
    
    @Column("varchar")
    email!: string

    @Column("varchar")
    password!: string

    @Column("varchar")
    phone!: string

    @Column("json")
    colorSchema!: JSON

    @Column("varchar")
    userPhoto!: string

    @Column("varchar")
    subscriptionType!: string

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Timestamp

}
