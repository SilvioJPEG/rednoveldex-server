import { IsString, IsNotEmpty } from 'class-validator';

export class AddNovelDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;
}