import { IsNotEmpty, IsString } from "class-validator";


export class CreateUserDTO {

    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    email: string


    @IsNotEmpty()
    @IsString()
    password: string
}