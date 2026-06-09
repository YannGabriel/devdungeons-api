import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDTO {
    @ApiProperty({ example: "João Silva" })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: "joao@email.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "123456", minLength: 6 })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}
