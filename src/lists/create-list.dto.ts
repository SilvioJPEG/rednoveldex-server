import { IsString, Length, IsNumber } from 'class-validator';

export class CreateListDto {
  @IsString({ message: 'Must be a string' })
  @Length(4, 99, {
    message: 'password length should be between 4 and 99 characters',
  })
  readonly title: string;

  @IsNumber()
  readonly userId: number;
}
