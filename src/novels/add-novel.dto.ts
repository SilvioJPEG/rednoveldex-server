import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class AddNovelDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    readonly description?: string;

    @IsNumber()
    readonly releaseDate?: number;
}