import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class AddNovelDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly original?: string;

  @IsString()
  readonly image?: string;

  @IsString()
  readonly releaseDate?: string;

  @IsString()
  readonly description?: string;
}

export type novelVNDB = {
  id: number;
  title: string;
  original?: string;
  image?: string;
  released?: string;
  description?: string;
};
