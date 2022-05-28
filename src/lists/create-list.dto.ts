import {
  IsArray,
  Length,
  IsNumber,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsArray({ message: 'Must be an array' })
  @Length(4, 99, {
    message: 'password length should be between 4 and 99 characters',
  })
  @IsNotEmpty()
  readonly novels: number[];

  @IsNumber()
  @IsNotEmpty()
  readonly user_id: number;
}
