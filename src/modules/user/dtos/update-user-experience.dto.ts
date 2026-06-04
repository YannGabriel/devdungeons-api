import { IsNotEmpty } from "class-validator"


export class UpdateUserExperienceDto{

    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    user_experiece: number
}