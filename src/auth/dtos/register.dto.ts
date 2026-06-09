import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MinLength,
} from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: "João Silva" })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: "joao@email.com" })
    @IsEmail({}, { message: "E-mail inválido" })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "123456", minLength: 6 })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    password: string;

    @ApiPropertyOptional({
        type: [String],
        description: "IDs das linguagens de interesse",
        example: ["uuid-js", "uuid-py"],
    })
    @IsOptional()
    @IsArray()
    @IsUUID("all", { each: true })
    languageIds?: string[];

    @ApiPropertyOptional({
        description: "ID do nível inicial (aplicado a todas as linguagens selecionadas)",
        example: "uuid-basico",
    })
    @IsOptional()
    @IsUUID()
    levelId?: string;
}
