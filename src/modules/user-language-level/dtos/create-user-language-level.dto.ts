import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateUserLanguageLevelDTO {
    @IsNotEmpty()
    @IsUUID()
    user_id: string;

    @IsNotEmpty()
    @IsUUID()
    language_id: string;

    @IsNotEmpty()
    @IsUUID()
    level_id: string;
}
