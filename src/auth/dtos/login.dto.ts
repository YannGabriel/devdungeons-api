import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: "joao@email.com" })
    @IsEmail({}, { message: "E-mail inválido" })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "123456" })
    @IsNotEmpty()
    @IsString()
    password: string;
}
