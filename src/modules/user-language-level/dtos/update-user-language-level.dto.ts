import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateUserLanguageLevelDTO {
    @IsNotEmpty()
    @IsUUID()
    level_id: string;
}
