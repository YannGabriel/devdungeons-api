import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class UpdateKnowledgeLevelDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    xp?: number;
}
