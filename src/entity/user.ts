import { Entity, PrimaryGeneratedColumn, Column, Timestamp, IsNull } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: "varchar", nullable: true})
    firstName!: string

    @Column({type: "varchar", nullable: true})
    lastName!: string
    
    @Column("varchar")
    email!: string

    @Column("varchar")
    password!: string

    @Column({type: "varchar", nullable: true})
    phone!: string

    @Column({type: "json", nullable: true})
    colorSchema!: JSON

    @Column({type: "varchar", nullable: true})
    userPhoto!: string

    @Column({type: "varchar", nullable: true})
    subscriptionType!: string

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Timestamp

}
