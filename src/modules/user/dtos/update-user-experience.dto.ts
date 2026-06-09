import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class UpdateUserExperienceDto {
    @ApiProperty({ example: "uuid" })
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @ApiProperty({ example: 50 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    user_experience: number;
}
