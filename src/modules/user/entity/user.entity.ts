import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'username',
        length: 100,
        nullable: false,
    })
    username: string;

    @Column({
        name: 'email',
        nullable: false,
    })
    email: string;


    @Column({
        name: "password",
        nullable: false,
    })
    password: string

    @Column({
        name: "user_level",
        type: "int"
    })
    user_level: number

    @Column({
        name: "user_experience",
        type: "int"
    })
    user_experience: number
}