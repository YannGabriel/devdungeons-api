import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../enums/user-role.enum";

@Entity({ name: "users" })
export class UserEntity {
    @ApiProperty({ example: "uuid" })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({ example: "João Silva" })
    @Column({ name: "username", length: 100, nullable: false })
    username: string;

    @ApiProperty({ example: "joao@email.com" })
    @Column({ name: "email", nullable: false, unique: true })
    email: string;

    @Exclude()
    @Column({ name: "password", nullable: false })
    password: string;

    @ApiProperty({ enum: UserRole, example: UserRole.USER })
    @Column({ name: "role", type: "enum", enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @ApiProperty({ example: 0 })
    @Column({ name: "user_level", type: "int", default: 0 })
    user_level: number;

    @ApiProperty({ example: 0 })
    @Column({ name: "user_experience", type: "int", default: 0 })
    user_experience: number;
}
