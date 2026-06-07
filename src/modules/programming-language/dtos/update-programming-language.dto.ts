import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateProgrammingLanguageDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;
}
