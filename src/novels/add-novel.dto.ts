import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class AddNovelDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly aliases?: string;

  @IsString()
  readonly orig_lang?: string;

  @IsString()
  readonly image?: string;

  @IsString()
  readonly release_date?: string;

  @IsString()
  readonly description?: string;
}

export type novelVNDB = {
  id: number;
  title: string;
  aliases?: string;
  orig_lang?: string;
  image?: string;
  released?: string;
  description?: string;
};
