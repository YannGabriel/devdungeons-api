import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateProgrammingLanguageDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;
}
