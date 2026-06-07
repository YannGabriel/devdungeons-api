import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateAlternativeDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    descricao?: string;

    @IsOptional()
    @IsBoolean()
    correta?: boolean;
}
